#!/bin/bash
# ============================================================
# Local WSL Deployment Script for Ecommerce App
# Supports: minikube, kind, k3s
# Usage: ./deploy-local.sh [--cluster-type minikube|kind|k3s]
# ============================================================
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log()     { echo -e "${BLUE}[INFO]${NC}  $1"; }
success() { echo -e "${GREEN}[OK]${NC}    $1"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $1"; }
error()   { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_IMAGE="ecommerce-backend:local"
FRONTEND_IMAGE="ecommerce-frontend:local"
BACKEND_NODEPORT=30088
FRONTEND_NODEPORT=30080

# ── Parse args ───────────────────────────────────────────────
CLUSTER_TYPE_ARG=""
while [[ $# -gt 0 ]]; do
  case $1 in
    --cluster-type) CLUSTER_TYPE_ARG="$2"; shift 2 ;;
    *) error "Unknown argument: $1" ;;
  esac
done

# ── Detect cluster type ──────────────────────────────────────
detect_cluster() {
  local ctx
  ctx=$(kubectl config current-context 2>/dev/null || echo "")
  if [[ "$ctx" == *"minikube"* ]]; then echo "minikube"
  elif [[ "$ctx" == *"kind"* ]];      then echo "kind"
  elif command -v k3s &>/dev/null || [[ "$ctx" == *"k3s"* ]]; then echo "k3s"
  else echo "unknown"
  fi
}

CLUSTER_TYPE="${CLUSTER_TYPE_ARG:-$(detect_cluster)}"
log "Cluster type: ${CLUSTER_TYPE}"

# ── Determine accessible host for frontend build ─────────────
get_host() {
  case $1 in
    minikube) minikube ip 2>/dev/null || echo "localhost" ;;
    *)        echo "localhost" ;;
  esac
}

HOST=$(get_host "$CLUSTER_TYPE")
API_URL="http://${HOST}:${BACKEND_NODEPORT}/api/v1"
log "Frontend will call backend at: ${API_URL}"

# ── Pre-flight checks ────────────────────────────────────────
log "Running pre-flight checks..."
command -v docker    &>/dev/null || error "docker not found"
command -v kubectl   &>/dev/null || error "kubectl not found"
kubectl cluster-info &>/dev/null || error "Cannot reach Kubernetes cluster. Is it running?"
success "Pre-flight checks passed"

# ── Build Docker images ──────────────────────────────────────
log "Building backend image (${BACKEND_IMAGE})..."
docker build \
  -t "${BACKEND_IMAGE}" \
  "${SCRIPT_DIR}/backend"
success "Backend image built"

log "Building frontend image (${FRONTEND_IMAGE}) with API_URL=${API_URL}..."
docker build \
  --target production \
  --build-arg REACT_APP_API_URL="${API_URL}" \
  -t "${FRONTEND_IMAGE}" \
  "${SCRIPT_DIR}/frontend"
success "Frontend image built"

# ── Load images into cluster ─────────────────────────────────
log "Loading images into ${CLUSTER_TYPE} cluster..."
case $CLUSTER_TYPE in
  minikube)
    minikube image load "${BACKEND_IMAGE}"
    minikube image load "${FRONTEND_IMAGE}"
    ;;
  kind)
    CLUSTER_NAME=$(kubectl config current-context | sed 's/kind-//')
    kind load docker-image "${BACKEND_IMAGE}" --name "${CLUSTER_NAME}"
    kind load docker-image "${FRONTEND_IMAGE}" --name "${CLUSTER_NAME}"
    ;;
  k3s)
    log "Importing images into k3s (requires sudo)..."
    docker save "${BACKEND_IMAGE}"  | sudo k3s ctr images import -
    docker save "${FRONTEND_IMAGE}" | sudo k3s ctr images import -
    ;;
  *)
    warn "Unknown cluster type — assuming Docker daemon is shared with k8s (e.g. k3s with docker)."
    warn "If pods fail to start with ImagePullBackOff, manually load the images."
    ;;
esac
success "Images loaded"

# ── Apply Kubernetes manifests ───────────────────────────────
log "Applying manifests via kustomize (overlays/local)..."
kubectl apply -k "${SCRIPT_DIR}/k8s/overlays/local"
success "Manifests applied"

# ── Wait for rollouts ────────────────────────────────────────
log "Waiting for MySQL StatefulSet to be ready (up to 5 min)..."
kubectl rollout status statefulset/mysql -n ecommerce --timeout=300s

log "Waiting for backend Deployment to be ready (up to 3 min)..."
kubectl rollout status deployment/backend -n ecommerce --timeout=180s

log "Waiting for frontend Deployment to be ready (up to 90s)..."
kubectl rollout status deployment/frontend -n ecommerce --timeout=90s

# ── Print access info ────────────────────────────────────────
echo ""
echo -e "${GREEN}============================================================${NC}"
success "Deployment complete!"
echo -e "${GREEN}============================================================${NC}"
echo ""
echo -e "  Frontend :  ${GREEN}http://${HOST}:${FRONTEND_NODEPORT}${NC}"
echo -e "  Backend  :  ${GREEN}http://${HOST}:${BACKEND_NODEPORT}${NC}"
echo -e "  Swagger  :  ${GREEN}http://${HOST}:${BACKEND_NODEPORT}/swagger-ui.html${NC}"
echo ""
echo "  Namespace : ecommerce"
echo "  kubectl get pods -n ecommerce   # check pod status"
echo "  kubectl get svc  -n ecommerce   # check services"
echo ""

if [[ "$CLUSTER_TYPE" == "minikube" ]]; then
  echo -e "  ${YELLOW}Tip:${NC} If NodePort is unreachable from Windows, run:"
  echo "       minikube service frontend-service -n ecommerce --url"
  echo "       minikube service backend-service  -n ecommerce --url"
  echo ""
fi

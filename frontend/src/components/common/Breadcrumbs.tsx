import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => (
  <nav className="flex items-center gap-1 text-sm text-gray-500 mb-4">
    {items.map((item, index) => (
      <React.Fragment key={index}>
        {index > 0 && <ChevronRightIcon className="w-3 h-3 text-gray-400" />}
        {item.path && index < items.length - 1 ? (
          <Link to={item.path} className="hover:text-amazon-blue hover:underline">{item.label}</Link>
        ) : (
          <span className={index === items.length - 1 ? 'text-gray-800 font-medium' : ''}>{item.label}</span>
        )}
      </React.Fragment>
    ))}
  </nav>
);

export default Breadcrumbs;

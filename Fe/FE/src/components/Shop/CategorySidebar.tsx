"use client";
import React from 'react';
import { Category } from '@/types/category';

interface CategorySidebarProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
}) => {
  return (
    <div className="bg-white shadow-1 rounded-lg py-4 px-5">
      <h3 className="text-lg font-semibold mb-4">Thể loại</h3>
      <ul className="space-y-2">
        <li>
          <button
            onClick={() => onCategorySelect(null)}
            className={`w-full text-left px-2 py-1 rounded hover:bg-gray-100 ${
              selectedCategory === null ? 'bg-blue-50 text-blue-600' : ''
            }`}
          >
            Tất cả danh mục
          </button>
        </li>
        {categories?.map((category) => (
          <li key={category._id}>
            <button
              onClick={() => onCategorySelect(category._id)}
              className={`w-full text-left px-2 py-1 rounded hover:bg-gray-100 ${
                selectedCategory === category._id ? 'bg-blue-50 text-blue-600' : ''
              }`}
            >
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategorySidebar; 
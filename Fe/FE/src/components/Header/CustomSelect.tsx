import React, { useState, useEffect } from "react";
import { Category } from "@/types/category";
import { apiService } from "@/services/api.service";
import { useRouter } from "next/navigation";

interface CustomSelectProps {
  onCategorySelect?: (categoryId: string | null) => void;
}

const CustomSelect = ({ onCategorySelect }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await apiService.getCategories();
        setCategories(data);
        if (data.length > 0) {
          setSelectedCategory(data[0]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCategoryClick = (category: Category | null) => {
    setSelectedCategory(category);
    
    // Navigate to shop-with-sidebar and filter by category
    if (category) {
      router.push(`/shop-with-sidebar?category=${category._id}`);
    } else {
      router.push('/shop-with-sidebar');
    }
    
    if (onCategorySelect) {
      onCategorySelect(category?._id || null);
    }
    setIsOpen(false);
  };

  useEffect(() => {
    // closing modal while clicking outside
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest(".dropdown-content")) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="dropdown-content custom-select relative" style={{ width: "200px" }}>
      <div
        className={`select-selected whitespace-nowrap ${
          isOpen ? "select-arrow-active" : ""
        }`}
        onClick={toggleDropdown}
      >
        {selectedCategory ? selectedCategory.name : "Tất cả danh mục"}
      </div>
      <div className={`select-items ${isOpen ? "" : "select-hide"}`}>
        <div
          onClick={() => handleCategoryClick(null)}
          className={`select-item ${
            !selectedCategory ? "same-as-selected" : ""
          }`}
        >
          Tất cả danh mục
        </div>
        {categories.map((category) => (
          <div
            key={category._id}
            onClick={() => handleCategoryClick(category)}
            className={`select-item ${
              selectedCategory?._id === category._id ? "same-as-selected" : ""
            }`}
          >
            {category.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomSelect;

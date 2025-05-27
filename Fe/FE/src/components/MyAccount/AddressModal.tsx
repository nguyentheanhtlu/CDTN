"use client";
import React, { useState, useEffect } from 'react';
import apiService from '@/services/api';
import { toast } from 'react-toastify';
import { Address } from '@/types/address';

interface AddressModalProps {
  onClose: () => void;
  onSuccess: () => void;
  address?: Address;
}

const AddressModal: React.FC<AddressModalProps> = ({ onClose, onSuccess, address }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    addressLine: '',
    ward: '',
    district: '',
    province: '',
    isDefault: false
  });

  useEffect(() => {
    if (address) {
      setFormData({
        name: address.name,
        phone: address.phone,
        addressLine: address.addressLine,
        ward: address.ward,
        district: address.district,
        province: address.province,
        isDefault: address.isDefault
      });
    }
  }, [address]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (address) {
        await apiService.updateAddress(address._id, formData);
        toast.success('Cập nhật địa chỉ thành công');
      } else {
        await apiService.addAddress(formData);
        toast.success('Thêm địa chỉ mới thành công');
      }
      onSuccess();
    } catch (error) {
      console.error('Lỗi khi lưu địa chỉ:', error);
      toast.error('Không thể lưu địa chỉ');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {address ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Họ và tên
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ
            </label>
            <input
              type="text"
              name="addressLine"
              value={formData.addressLine}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phường/Xã
            </label>
            <input
              type="text"
              name="ward"
              value={formData.ward}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quận/Huyện
            </label>
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tỉnh/Thành phố
            </label>
            <input
              type="text"
              name="province"
              value={formData.province}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600"
            />
            <label className="ml-2 text-sm text-gray-700">
              Đặt làm địa chỉ mặc định
            </label>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-light text-white rounded-md hover:bg-blue-700"
            >
              {address ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;

import React, { useState } from 'react';
import {Eye, EyeOff} from 'lucide-react';
import { useUserStore } from '../store/user.store';
import { useAuthStore } from '../store/authe.store';
import { useNavigate } from 'react-router-dom';
const ChangePasswordForm = () => {
    const {updatePassword} = useUserStore();
    const {autherChecking} = useAuthStore();
    const navigate = useNavigate();
    const [formData,setFormData] = useState({
        currentPassword:"",
        newPassword:"",
        confirmPassword:""
    })
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const toggleShow = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra mật khẩu mới và xác nhận khớp
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }
    if(formData.newPassword !== formData.confirmPassword){
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
    
    const result = await updatePassword(formData);
    if(result){
      autherChecking();
      // Clear form after successful update
      setFormData({
        currentPassword:"",
        newPassword:"",
        confirmPassword:""
      });
      setError('');
      navigate('/profile');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded-2xl shadow-md flex flex-col gap-4" data-theme="dark">
      <h2 className="text-2xl font-semibold mb-4 text-center select-none">Đổi Mật Khẩu</h2>

      {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
      
        {/* Mật khẩu hiện tại */}
        <div>
          <label className="block text-sm font-medium select-none">Mật khẩu hiện tại</label>
          <div className="relative">
            <input
              type={showPassword.current ? 'text' : 'password'}
              value={formData.currentPassword}
              onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
              className="w-full mt-1 p-2 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring focus:border-blue-500"
            />
            <span
              onClick={() => toggleShow('current')}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 cursor-pointer"
            >
              {showPassword.current ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>
        </div>

        {/* Mật khẩu mới */}
        <div>
          <label className="block text-sm font-medium select-none">Mật khẩu mới</label>
          <div className="relative">
            <input
              type={showPassword.new ? 'text' : 'password'}
              value={formData.newPassword}
              onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
              className="w-full mt-1 p-2 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring focus:border-blue-500"
            />
            <span
              onClick={() => toggleShow('new')}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 cursor-pointer"
            >
              {showPassword.new ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>
        </div>

        {/* Xác nhận mật khẩu */}
        <div>
          <label className="block text-sm font-medium select-none">Xác nhận mật khẩu mới</label>
          <div className="relative">
            <input
              type={showPassword.confirm ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              className="w-full mt-1 p-2 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring focus:border-blue-500"
            />
            <span
              onClick={() => toggleShow('confirm')}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 cursor-pointer"
            >
              {showPassword.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>
        </div>

        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl transition cursor-pointer select-none"
        >
          Đổi mật khẩu
        </button>
     
    </div>
  );
};
export default ChangePasswordForm;

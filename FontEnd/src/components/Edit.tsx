import React, { useState } from 'react';
import { useAuthStore } from '../store/authe.store';
import { useUserStore } from '../store/user.store';
import { useNavigate } from 'react-router-dom';
const FormCapNhatThongTin = () => {
    const {authUser,autherChecking} = useAuthStore();
    const {fullname,link,profileImg} = authUser;
    const {updateProfile} = useUserStore();
    const navigate = useNavigate();
  const [fullnameUser, setFullname] = useState(fullname);
  const [bioUser, setBio] = useState(link);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profileImg||null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('fullname', fullnameUser);
    formData.append('bio', bioUser);
    if (avatar) {
        formData.append('image', avatar);
    }

    const resuft = await updateProfile(formData);
    if(resuft){
        navigate('/profile');
        await autherChecking();
        
    }
  };
  return (
    <div className="max-w-2xl mx-auto p-6" data-theme="dark">
      <form onSubmit={handleSubmit} className=" rounded-xl shadow-md text-white space-y-6 p-8">
        <h2 className="text-2xl font-bold text-center mb-8 select-none">Chỉnh sửa thông tin</h2>

        <div className="flex justify-center mb-6">
          <div className="relative">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 select-none"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center">
                <span className="text-gray-400">No Image</span>
              </div>
            )}
            <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block mb-2 font-medium select-none">Họ tên</label>
            <input
              type="text"
              value={fullnameUser}
              onChange={(e) => setFullname(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập họ tên của bạn"
              required
            />
          </div>

          

          <div>
            <label className="block mb-2 font-medium select-none">Tiểu sử</label>
            <textarea
              value={bioUser}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Giới thiệu về bản thân bạn"
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg font-semibold transition-colors cursor-pointer select-none"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors cursor-pointer select-none"
          >
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormCapNhatThongTin;

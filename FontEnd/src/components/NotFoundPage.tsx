import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#18191a] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-blue-500 mb-4">404</h1>
        <div className="text-4xl font-semibold text-white mb-6">
          Oops! Trang không tồn tại
        </div>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Có vẻ như trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Home size={20} />
          <span>Về trang chủ</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound; 
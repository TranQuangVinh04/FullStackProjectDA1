import { Home, Search, Compass, Video, MessageCircle, Bell , PlusSquare,LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import React from 'react';
import { useAuthStore } from '../store/authe.store';
import { Link } from 'react-router-dom';


export default function Sidebar() {
  //store
  const {authUser,logout,isLogin} = useAuthStore();
  //state
  const [active, setActive] = useState('Trang chủ');
  //schema
  const menuItems= [
    { label: 'Trang chủ', icon: <Home />, active: true },
    { label: 'Tìm kiếm', icon: <Search /> },
    { label: 'Khám phá', icon: <Compass /> },
    { label: 'Reels', icon: <Video /> },
    { label: 'Tin nhắn', icon: <MessageCircle /> },
    { label: 'Thông báo', icon: <Bell /> },
    { label: 'Tạo', icon: <PlusSquare /> },
    { label: 'Trang cá nhân', icon: <img src={authUser?.profileImg ||"./imagebackround.png"} alt="Avatar" className="w-6 h-6 rounded-full" /> ,href: "/Profile"},
  ];
  const bottomItems = [
    { label: 'Đăng Xuất', icon: <LogOut /> },
];
const handleLogout = () => {
  logout();
}
useEffect(() => {
  const path = window.location.pathname;
  if(path === "/"){
    setActive("Trang chủ");
  }else if(path === "/Profile"){
    setActive("Trang cá nhân");
  }
}, []);
  return (
    <aside className="h-screen xl:w-64 w-[80px] bg-black text-white flex flex-col justify-between py-4 fixed">
      <div className='flex flex-col items-center justify-center'>
        <h1 className="xl:block hidden text-2xl font-semibold mb-6">NuNaNi</h1>
        <nav className="space-y-3 xl:w-[80%]">
        

        {/* Menu */}
        {menuItems.map((item) => (
          <Link 
            key={item.label}
            to={item.href || ""}
            className={`flex items-center space-x-3 px-2 py-2 rounded-lg hover:bg-white/10 w-full text-left cursor-pointer font-[Roboto] ${
              active === item.label ? 'font-bold' : 'font-normal'
            }`}
            onClick={() => setActive(item.label)}
          >
            <span className={`max-xl:relative top-[50%] left-[50%] max-xl:translate-x-[-50%] ${
              active === item.label ? 'text-blue-500' : ''
            }`}>
              {item.icon}
            </span>
            <span className='xl:block hidden'>{item.label}</span>
          </Link>
        ))}
        </nav>
      </div>
      <div className="space-y-3 p-2">
        {bottomItems.map((item) => (
          <button
            key={item.label}
            onClick={() => handleLogout()}
            className="flex items-center space-x-3 px-2 py-2 rounded-lg hover:bg-white/10 w-full text-left cursor-pointer"
          >
            <span className='max-xl:relative top-[50%] left-[50%] max-xl:translate-x-[-50%]'>{item.icon}</span>
            <span className='xl:block hidden'>{item.label}</span>
          </button>
        ))}
      </div>
    
    </aside>
  );
}

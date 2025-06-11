import { Home, Search, Compass, Video, MessageCircle, Bell , PlusSquare,LogOut,Lock, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import React from 'react';
import { useAuthStore } from '../store/authe.store';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useUserStore } from '../store/user.store';
import { useNotificationStore } from '../store/notification.store';
import NotificationDialog from './NotificationDialog';


export default function Sidebar() {
  const {getNotifications,notifications,markAsRead} = useNotificationStore();
  const path = useLocation();
  //store
  const {authUser,logout,isLogin} = useAuthStore();
  const {profileUser} = useUserStore();
  const username = authUser?.username;
  //state
  const [active, setActive] = useState('Trang chủ');
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const hangleBell = async (e:any) => {
    e.preventDefault();
    e.stopPropagation();
    if(notifications.filter((notification) => notification.read==false).length > 0){
      
      await markAsRead();
      await getNotifications();
  }else{return;}

}
  //schema
  const menuItems= [
    { label: 'Trang chủ', icon: <Home />, active: true },
    { label: 'Tìm kiếm', icon: <Search /> ,href: "/search"},
    authUser.role === "admin" ? { label: 'Admin', icon: <Shield /> ,href: "/admin"} :{label:"",icon:"",href:""},
    { label: 'Tin nhắn', icon: <MessageCircle /> ,href: "/message"},
    { label: 'Thông báo', icon: <Bell /> },
    { label: 'Tạo', icon: <PlusSquare /> ,href: "/create-post"},
    { label: 'Trang cá nhân', icon: <img src={authUser?.profileImg ||"./imagebackround.png"} alt="Avatar" className="w-6 h-6 rounded-full select-none" /> ,href:`${authUser.username}`},
  ];
  const bottomItems = [
    { label: 'Đổi Mật Khẩu', icon: <Lock /> ,href: `${authUser._id}/change-password`},
    { label: 'Đăng Xuất', icon: <LogOut /> },

];
const handleLogout = () => {
  logout();
}
useEffect(() => {
  if(path.pathname === "/"){
    setActive("Trang chủ");
  }else if(path.pathname === `/${username}`){
    setActive("Trang cá nhân");
  }else if(path.pathname === "/message" || path.pathname === "/Message" || path.pathname.split("/")[1] === "message"){
    setActive("Tin nhắn");
  }else if(path.pathname === "/create-post"){
    setActive("Tạo");
  }else if(path.pathname === "/search"){
    setActive("Tìm kiếm");
  }
  else{
    setActive("null");
  }
}, [path.pathname, username]);
useEffect(() => {
  getNotifications();
}, [getNotifications]);
  return (
    <aside className={`h-screen w-[80px] ${active === "Tin nhắn" ? "w-[80px]" : "xl:w-64"} bg-black text-white flex flex-col justify-between py-4 fixed border-r border-gray-700`}>
      <div className='flex flex-col items-center justify-center'>
        <h1 className={`${active === "Tin nhắn" ? "hidden" : "xl:block"} text-4xl font-Roboto mb-6 font-bold select-none`}>MIX</h1>
        <nav className="space-y-3 xl:w-[90%]">
        

        {/* Menu */}
        {menuItems.filter((item) => item.label !== ""||item.icon !== ""||item.href !== "").map((item) => (
          <Link 
            key={item.label}
            to={item.href || ""}
            className={`flex items-center space-x-3 px-2 py-2 rounded-lg hover:bg-white/10 w-full text-left cursor-pointer font-[Roboto] ${
              active === item.label ? 'font-bold' : 'font-normal'
            }`}
            onClick={(e) => {
              {item.label === "Thông báo" ? "" : setActive(item.label)}
              if (item.label === "Thông báo") {
                hangleBell(e);
                setShowNotificationDialog(true);
              }
            }}
          >
            
            <span className={`${active === "Tin nhắn" ? "relative top-[50%] left-[50%] translate-x-[-50%]" : "max-xl:relative top-[50%] left-[50%] max-xl:translate-x-[-50%]"} ${
              active === item.label ? 'text-blue-500' : ''
            }`}>
              <div className='relative'>
              {item.icon}
              
              {item.label === "Thông báo" && notifications.length > 0 && notifications.filter((notification) => notification.read==false).length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1  text-xs">
                {notifications.filter((notification) => !notification.read).length}
              </span>
            )}
            </div>
            </span>
            <span className={`${active === "Tin nhắn" ? "hidden" : "xl:block hidden select-none"}`}>{item.label}</span>
          </Link>
        ))}
        </nav>
      </div>
      <div className="space-y-3 p-2">
        {bottomItems.map((item) => (
          <Link 
            key={item.label}
            to={item.href || ""}
          >
          <button
            key={item.label}
            onClick={item.label === "Đăng Xuất" ? () => handleLogout() : () => {}}
            className="flex items-center space-x-3 px-2 py-2 rounded-lg hover:bg-white/10 w-full text-left cursor-pointer"
            
            
          >
            <span className={`${active === "Tin nhắn" ? "relative top-[50%] left-[50%] translate-x-[-50%]" : "max-xl:relative top-[50%] left-[50%] max-xl:translate-x-[-50%]" }`}>{item.icon}</span>
            <span className={` ${active === "Tin nhắn" ? "hidden" : "xl:block hidden select-none" }`}>{item.label}</span>
          </button>
          </Link>
        ))}
      </div>
    
      {/* Notification Dialog */}
      <NotificationDialog 
        isOpen={showNotificationDialog} 
        onClose={() => setShowNotificationDialog(false)}
      >
        
      </NotificationDialog>
    </aside>
  );
}

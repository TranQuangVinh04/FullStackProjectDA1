import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';
import { X } from 'lucide-react';
import { useNotificationStore } from '../store/notification.store';
import { Link } from 'react-router-dom';
import React,{useEffect} from 'react';
import { createPortal } from 'react-dom';

interface NotificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
}

const NotificationDialog = ({ isOpen, onClose }: NotificationDialogProps) => {
  const { notifications, isLoading, subscribeToNotifications, unSubscribeToNotifications } = useNotificationStore();

  const handleNotificationClick = async (notificationId: string) => {

  };
  useEffect(()=>{
    subscribeToNotifications();
    return ()=>{
      unSubscribeToNotifications();
    }
  },[subscribeToNotifications, unSubscribeToNotifications,notifications])

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[9999]"
          />
          
          {/* Dialog panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-[400px] bg-[#242526] shadow-lg z-[99999] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h2 className="text-xl font-semibold dark:text-white select-none">Thông báo</h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5 dark:text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Today */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 select-none">Hôm nay</h3>
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer"
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      {notification.type!=="deleteByAdmin" && <Link to={`/${notification.from.username}`}>
                        <img
                          src={notification.from.profileImg || './imagebackround.png'}
                          alt="Avatar"
                          className="w-10 h-10 rounded-full"
                        />
                      </Link>}
                      <div>
                        <p className="text-sm dark:text-white">
                          <span className="font-semibold">
                            {notification.type!=="deleteByAdmin" && <Link
                              to={`/${notification.from.username}`}
                              className="hover:underline"
                            >
                            <span></span>
                              {notification.from.fullname}
                            </Link>}
                          </span>{' '}
                          {notification.type === "like" && "Đã Thích Bài Post Của Bạn"}
                          {notification.type === "comment" && "Đã Bình Luận Bài Post Của Bạn"}
                          {notification.type === "follow" && "Đã Theo Dõi Bạn"}
                          {notification.type === "CreatePost" && "Vừa Tạo Bài Viết Mới"}
                          {notification.type === "deleteByAdmin" && `Admin Đã Vừa Xóa Bài Post Của Bạn`}
                        </p>
                        <span className="text-xs text-gray-500">
                          {new Date(notification.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* This Week */}
              {/* <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Tuần này</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer">
                    <img src="https://placekitten.com/42/42" alt="Avatar" className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="text-sm dark:text-white">
                        <span className="font-semibold">Sarah</span> đã theo dõi bạn
                      </p>
                      <span className="text-xs text-gray-500">2 ngày trước</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer">
                    <img src="https://placekitten.com/43/43" alt="Avatar" className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="text-sm dark:text-white">
                        <span className="font-semibold">John</span> đã chia sẻ bài viết của bạn
                      </p>
                      <span className="text-xs text-gray-500">5 ngày trước</span>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default NotificationDialog; 
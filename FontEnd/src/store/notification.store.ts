import { create } from "zustand";
import { axiosInstanace } from "../../config/axios";
import { toast } from "react-hot-toast";
import { useAuthStore } from "./authe.store";

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'CreatePost' | 'deleteByAdmin';
  message: string;
  read: boolean;
  createdAt: string;
  from: {
    _id: string;
    username: string;
    fullname: string;
    profileImg: string;
  };
  to: string;
  postId?: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  getNotifications: () => Promise<void>;
  markAsRead: () => Promise<void>;
  subscribeToNotifications:()=>void;
  unSubscribeToNotifications:()=>void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  getNotifications: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstanace.get("/natification/getNatification");
      set({notifications: response.data.notifications});
      
    } catch (error) {
      console.error("có vấn đề tại lấy thông báo:", error);
      set({ isLoading: false });
    }
  },

  markAsRead: async () => {
    try {
      await axiosInstanace.put(`/natification/readNatification`);
      
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  },
  subscribeToNotifications:()=>{
    const socket = useAuthStore.getState().socket;
    
    socket.on("newNotification", (newNotification:any) => {
        console.log("Thông Báo",newNotification)
        const currentNotifications = get().notifications || [];
        if(currentNotifications.find((notification:any) => notification.uniqueIdentifier === newNotification.uniqueIdentifier)) return;
        else{
            set({
                notifications: [...currentNotifications, newNotification]
            });
        }
        
    });
},
unSubscribeToNotifications:()=>{
    const socket = useAuthStore.getState().socket;
    socket.off("newNotification");
}
,

})); 
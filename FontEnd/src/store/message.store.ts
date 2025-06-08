import { create } from "zustand";
import { axiosInstanace } from "../../config/axios";
import { toast } from "react-hot-toast";
import { useAuthStore } from "./authe.store";

interface MessageState {
    userList: any[];
    messages: {messages: any[]};
    selectedUser: any;
    setSelectedUser: (user: any) => void;
    // getUser: (id: string) => Promise<boolean>;
    massageLoading: boolean;
    getMessage: (id: string) => Promise<boolean>;
    sendMessage: (id: string, message: string, images: any[]) => Promise<any>;
    subscribeToMessages:()=>void;
    unSubscribeToMessages:()=>void;
    getUserList: (id: string) => Promise<any>;
}
export const useMessageStore = create<MessageState>((set, get) => ({
    userList: [],
    messages: {messages: []},
    selectedUser: null,
    massageLoading: false,
    setSelectedUser: (user) => set({ selectedUser: user }),
    // getUser: async (id: string) => {
    //     if(id && id.length <23) return false;
    //     if(!id) {return false};
    //     set({ massageLoading: true });
    //     try {
    //         const resuft = await axiosInstanace.get(`/message/${id}`);
    //         set({ selectedUser: resuft.data });
    //         set({ massageLoading: false });
    //         return true;
    //     } catch (error) {
    //         console.log("có vấn đề về getUser của Message")
    //         set({ massageLoading: false });
    //         return false;
    //     }
    // },
    getMessage: async (id: string) => {
        if(id && id.length <23) return false;
        if(!id) {return false};
        set({ massageLoading: true });
        try {
            const result = await axiosInstanace.get(`/message/${id}/messages`);
            set({ messages: result.data });
            set({ massageLoading: false });
            return true;
        } catch (error) {
            console.log("có vấn đề về getMessage của Message")
            set({ massageLoading: false });
            return false;
        }
    },
    sendMessage: async (id: string, message: string, images: any[]) => {
        if(id && id.length <23) return false;
        if(!id) {return false};
        set({ massageLoading: true });
        const formData = new FormData();
        formData.append('content', message);
        images.forEach((image) => {
            formData.append('images', image);
        });
        try {
            const result = await axiosInstanace.post(`/message/${id}`, formData);
        
            set({ massageLoading: false });
            return true;
        } catch (error) {
            console.log("có vấn đề về sendMessage của Message")
            set({ massageLoading: false });
            return false;
        }
    },
    subscribeToMessages:()=>{
        const { selectedUser } = get();
        if(!selectedUser) return;
        const socket = useAuthStore.getState().socket;
        
        socket.on("newMessage", (newMessage) => {
            const isCurrentConversation = 
                newMessage.senderId._id === selectedUser._id || 
                newMessage.receiverId._id === selectedUser._id;
            
            if(!isCurrentConversation) return;
            
            const currentMessages = get().messages.messages || [];
            set({
                messages: {
                    messages: [...currentMessages, newMessage]
                }
            });
        });
    },
    unSubscribeToMessages:()=>{
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    }
    ,
    getUserList: async (id: string) => {
        try {
            const result = await axiosInstanace.get(`/message/get-list-message/${id}`);
            set({ userList: result.data.data });
        } catch (error) {
            console.log("có vấn đề về getUserList của Message")
            return false;
        }
        
    }
}));

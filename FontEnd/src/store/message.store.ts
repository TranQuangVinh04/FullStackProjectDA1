import { create } from "zustand";
import { axiosInstanace } from "../../config/axios";
import { toast } from "react-hot-toast";
import { useAuthStore } from "./authe.store";

interface MessageState {
    messages: {messages: any[]};
    selectedUser: any;
    setSelectedUser: (user: any) => void;
    getUser: (id: string) => Promise<boolean>;
    massageLoading: boolean;
    getMessage: (id: string) => Promise<boolean>;
    sendMessage: (id: string, message: string, images: any[]) => Promise<any>;
}
export const useMessageStore = create<MessageState>((set) => ({
    messages: {messages: []},
    selectedUser: null,
    massageLoading: false,
    setSelectedUser: (user) => set({ selectedUser: user }),
    getUser: async (id: string) => {
        if(id && id.length <23) return false;
        if(!id) {return false};
        set({ massageLoading: true });
        try {
            const resuft = await axiosInstanace.get(`/message/${id}`);
            set({ selectedUser: resuft.data });
            set({ massageLoading: false });
            return true;
        } catch (error) {
            console.log("có vấn đề về getUser của Message")
            set({ massageLoading: false });
            return false;
        }
    },
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
        console.log(images);
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
    }
}));

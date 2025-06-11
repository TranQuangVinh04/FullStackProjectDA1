import { create } from "zustand";
import { axiosInstanace } from "../../config/axios";
import { toast } from "react-hot-toast";
import { useAuthStore } from "./authe.store";
interface AdminState {
    users: any[]
    posts: any[]
    postsHavior: any[]
    getUsers: () => Promise<void>
    changePassword: (userId: string,password:string) => Promise<boolean>
    banOrUnbanUser: (userId: string) => Promise<boolean>
    getPostsHavior: () => Promise<void>
    deletePostAdmin: (postId: string) => Promise<boolean>
    deleteReportHavior: (postId: string) => Promise<boolean>
}
export const useAdminStore = create<AdminState>((set,get) => ({
    users: [],
    posts: [],
    postsHavior: [],
    getUsers: async () => {
        try {
            const response = await axiosInstanace.get("/admin/users");
            set({ users: response.data.data });
            
        } catch (error) {
            console.log("lỗi khi lấy danh sách người dùng",error.response.data)
        }
    },
    changePassword: async (userId: string,password:string) => {
        try {
            const response = await axiosInstanace.put(`/admin/change-password`,{userId,password});
            return true;
        } catch (error) {
            console.log("lỗi khi đổi mật khẩu",error.response.data)
            return false;
        }
    },
    banOrUnbanUser: async (userId: string) => {
        try {
            const response = await axiosInstanace.put(`/admin/ban-unban`,{userId});
            return true;
        } catch (error) {
            console.log("lỗi khi ban hoặc unban người dùng",error.response.data)
            return false;
        }
    },
    getPostsHavior: async () => {
        try {
            const response = await axiosInstanace.get("/admin/report-havior");
            set({ postsHavior: response.data.data });
        } catch (error) {
            console.log("lỗi khi lấy danh sách post havior",error.response.data)
        }
    },
    deletePostAdmin: async (postId: string) => {
        
        useAuthStore.setState({isLoading:true});
        try {
            const response = await axiosInstanace.delete(`/admin/delete-post/${postId}`);
            useAuthStore.setState({isLoading:false});
            return true;
        } catch (error) {
            console.log("lỗi khi xóa bài viết",error.response.data)
            useAuthStore.setState({isLoading:false});
            return false;
        }
    },
    deleteReportHavior: async (postId: string) => {
        useAuthStore.setState({isLoading:true});
        try {
            const response = await axiosInstanace.delete(`/admin/delete-rp-havior/${postId}`);
            useAuthStore.setState({isLoading:false});
            return true;
        } catch (error) {
            console.log("lỗi khi xóa báo cáo",error.response.data)
            useAuthStore.setState({isLoading:false});
            return false;
        }
    }
}))
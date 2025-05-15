import { create } from "zustand";
import { axiosInstanace } from "../../config/axios";
import { toast } from "react-hot-toast";
import { useAuthStore } from "./authe.store";
interface UserState {
    postsUser: any,
    getPostsUser: () => Promise<void>
    like: number,
    comments: number,
    shares: number,
    likepost: (id: string) => Promise<boolean>,
    updateProfile: (profileData: any) => Promise<boolean>,
    deletePost: (id: string) => Promise<boolean>
}

export const useUserStore = create<UserState>((set,get) => ({
    like: 0,
    comments: 0,
    shares: 0,
    postsUser: [],
        getPostsUser: async () => {
            try {
                const response = await axiosInstanace.get("/post/getAllPostUser");
                set({postsUser: response.data.data});
            } catch (error:any) {
                console.log("Lấy Posts không thành công");
            }
        },

        likepost: async (id: string) => {
            try {
                const response = await axiosInstanace.post(`/post/like/${id}`);
                toast.success(response.data.message);
                if(response.data.message == "Đã unlike thành công"){
                    return false;
                }
                return true;
            } catch (error:any) {
                toast.error(error.response.data.message);
                return false;
            }
        },
        updateProfile: async (profileData: any) => {
            useAuthStore.setState({ isLoading: true });
            try {
                const response = await axiosInstanace.put("/user/uploadImageProfile", profileData);
                toast.success(response.data.message);
                useAuthStore.setState({ isLoading: false });
                return true;
            } catch (error:any) {
                toast.error(error.response.data.message);
                useAuthStore.setState({ isLoading: false });
                return false;
            }
        },
        deletePost: async (id: string) => {
            try {
                const response = await axiosInstanace.delete(`/post/delete/${id}`);
                toast.success(response.data.message);
                return true;
            } catch (error:any) {
                toast.error(error.response.data.message);
                return false;
            }   
        }
}))

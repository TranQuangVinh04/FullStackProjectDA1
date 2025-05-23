import { create } from "zustand";
import { axiosInstanace } from "../../config/axios";
import { toast } from "react-hot-toast";
import { useAuthStore } from "./authe.store";
interface UserState {
    profileUser: any,
    likesPost: any,
    postsUser: any,
    getPostsUser: (username: string) => Promise<void>
    like: number,
    comments: number,
    shares: number,
    likepost: (id: string) => Promise<boolean>,
    updateProfileImg: (profileData: any) => Promise<boolean>,
    updateProfile: (data: any) => Promise<boolean>,
    deletePost: (id: string) => Promise<boolean>
    updatePassword: (data: any) => Promise<boolean>
    getPostLikes: (id: string) => Promise<boolean>
    getProfileUser: (username: string) => Promise<void>
    setFollowUser: (id: string) => Promise<boolean>
}

export const useUserStore = create<UserState>((set,get) => ({
    profileUser: null,
    likesPost: [],
    like: 0,
    comments: 0,
    shares: 0,
    postsUser: [],
    getPostsUser: async (username: string) => {
       
            try {
                const response = await axiosInstanace.get(`/post/getAllPostUser/${username}`);
                set({postsUser: response.data.data});
                
            } catch (error:any) {
                console.log("Không Lấy Được Các Bài Post Của Người Dùng")
              
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
        updateProfileImg: async (profileData: any) => {
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
            useAuthStore.setState({ isLoading: true });
            try {
                const response = await axiosInstanace.delete(`/post/delete/${id}`);
                toast.success(response.data.message);
                useAuthStore.setState({ isLoading: false });
                return true;
            } catch (error:any) {
                toast.error(error.response.data.message);
                useAuthStore.setState({ isLoading: false });
                return false;
            }   
        },
        updateProfile: async (data: any) => {
            useAuthStore.setState({ isLoading: true });
            try {
                const response = await axiosInstanace.put("/user/updateProfile", data);
                toast.success(response.data.message);
                useAuthStore.setState({ isLoading: false });
                return true;
            } catch (error:any) {
                toast.error(error.response.data.message);
                useAuthStore.setState({ isLoading: false });
                return false;
            }
        },
        updatePassword: async (data: any) => {
            useAuthStore.setState({ isLoading: true });
            try {
                const response = await axiosInstanace.put("/user/changePassword", data);
                toast.success(response.data.message);
                useAuthStore.setState({ isLoading: false });
                return true;
            } catch (error:any) {
                toast.error(error.response.data.message);
                useAuthStore.setState({ isLoading: false });
                return false;
            }
        },
        //có lỗi ở nay nè
        getPostLikes: async (id: string) => {
            try {
                const response = await axiosInstanace.get(`/post/getLikes/${id}`);
                set({likesPost: response.data.data});
                return true;
            } catch (error:any) {
                return false;
            }
        }
        ,getProfileUser:async (username:string) => {
          
            try {
                const response = await axiosInstanace.get(`/user/getProfile/${username}`);
                set({profileUser: response.data.user});
               
            } catch (error:any) {
                console.log("lấy profile không thành công");
            }
        },
        setFollowUser: async (id:string) => {
            try {
                const response = await axiosInstanace.post(`/user/followOrUnfollow/${id}`);
                toast.success(response.data.message);
                return true;
            } catch (error:any) {
                toast.error(error.response.data.message);
                return false;
            }
        }
}))

import { create } from "zustand";
import { axiosInstanace } from "../../config/axios";
import { toast } from "react-hot-toast";
import { useAuthStore } from "./authe.store";
import { url } from "inspector";

interface UserState {
    notification: any,
    allPosts: any,
    profileUser: any,
    likesPost: any,
    postsUser: any,
    getPostsUser: (username: string) => Promise<any>
    like: number,
    comments: number,
    shares: number,
    likepost: (id: string) => Promise<boolean>,
    updateProfileImg: (profileData: any) => Promise<boolean>,
    updateProfile: (data: any) => Promise<boolean>,
    deletePost: (id: string) => Promise<boolean>
    updatePassword: (data: any) => Promise<boolean>
    getProfileUser: (username: string) => Promise<any>
    setFollowUser: (id: string) => Promise<boolean>
    updatePost: (id: string, updatedPost: { content: string; media?: { url: string; type: "image" | "video" }[] }) => Promise<boolean>
    reportPost: ({postId, reason, description}:{postId: string, reason: string, description: string}) => Promise<boolean>
    commentPost: (id: string, comment: string) => Promise<boolean>
    createPost: (post: any) => Promise<boolean>
    getPosts: () => Promise<any>
    searchUsers: (query: string) => Promise<any[]>
    searchPosts: (query: string) => Promise<any[]>
    getSuggestedUsers: () => Promise<void>
    suggestUsers:any
    getHashtags: () => Promise<void>
    hashtags:any
}

export const useUserStore = create<UserState>((set,get) => ({
    hashtags:[],
    suggestUsers:[],
    notification: [],
    allPosts: [],
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
        getProfileUser:async (username:string) => {
          
            try {
                const response = await axiosInstanace.get(`/user/getProfile/${username}`);
                set({profileUser: response.data.user});
               
            } catch (error:any) {
                
                console.log("lấy profile không thành công");
                return false;
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
        },
        updatePost: async (id: string, updatedPost: { content: string; media?:any }) => {

            useAuthStore.setState({ isLoading: true });
            try {
                const response = await axiosInstanace.put(`/post/updatePostUser/${id}`, updatedPost);
                toast.success(response.data.message);
                useAuthStore.setState({ isLoading: false });
                return true;
            } catch (error:any) {
                toast.error(error.response.data.message);
                useAuthStore.setState({ isLoading: false });
                return false;
            }
        },
        reportPost: async ({postId, reason, description}:{postId: string, reason: string, description: string}) => {
            try {
                const response = await axiosInstanace.post(`/user/repostPost/${postId}`, {reason, description});
                toast.success(response.data.message);
                return true;
            } catch (error:any) {
                toast.error(error.response.data.message);
                return false;
            }
        },
        commentPost: async (id: string, comment: string) => {
            try {
                const response = await axiosInstanace.post(`/post/comment/${id}`, {content:comment});
                toast.success(response.data.message);
                return true;
            } catch (error:any) {
                toast.error(error.response.data.message);
                return false;
            }
        },
        createPost: async (post: any) => {
            useAuthStore.setState({ isLoading: true });
            try {
                const response = await axiosInstanace.post("/post/create", post);
                toast.success(response.data.message);
                useAuthStore.setState({ isLoading: false });
                return true;
            } catch (error:any) {
                toast.error(error.response.data.message);
                useAuthStore.setState({ isLoading: false });
                return false;
            }
        },
        getPosts: async () => {
            try {
                const response = await axiosInstanace.get("/post/all");
                set({allPosts: response.data.data});
            } catch (error:any) {
                console.log("Không Lấy Được Các Bài Post");
                return false;
            }
        },
        searchUsers: async (query: string) => {
            try {
                const response = await axiosInstanace.get(`/user/search?q=${encodeURIComponent(query)}`);
                return response.data.users;
            } catch (error) {
                console.error('có vấn đề tại search users:', error);
                return [];
            }
        },
        searchPosts: async (query: string) => {
            try {
                const response = await axiosInstanace.get(`/post/search?q=${encodeURIComponent(query)}`);
                console.log(response.data.posts);
                return response.data.posts;
              
            } catch (error) {
                console.error('có vấn đề tại search post', error);
                return [];
            }
        },
        getSuggestedUsers: async () => {
            try {
                const response = await axiosInstanace.get("/user/suggestion");
                set({suggestUsers: response.data.data});
            } catch (error:any) {
                console.log("Không Lấy Được Các Người Dùng Được Gợi Ý Theo Dõi");
                
            }
        },
        getHashtags: async () => {
            try {
                const response = await axiosInstanace.get(`/user/hashtags`);
                set({hashtags: response.data.data});
            } catch (error:any) {
                console.log("Không Lấy Được Các Bài Post Có Hashtag");
            }
        }
}))

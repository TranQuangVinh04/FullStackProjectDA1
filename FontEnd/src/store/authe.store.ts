import { create } from "zustand";
import { toast } from "react-hot-toast";
import  {axiosInstanace}  from "../../config/axios"
interface AuthState {
    isLogin: boolean
    authUser:any|null
    isLoading:boolean
    isRegister:boolean
    error:string | null
    login: (data:object) => Promise<void>
    autherChecking: () => Promise<any>
    register: (data:object) => Promise<void>
    logout: () => Promise<void>
  }
export const useAuthStore = create<AuthState>((set,get) => ({
    //user
    authUser: null,
    //loading
    isLoading: true,
    isLogin: false,
    isRegister: false,
    //error
    error: null,
    //login
    login: async (data:object) => {
        set({isLoading: true})
        
        try {
            const response = await axiosInstanace.post("/auth/login", data);
            set({authUser: response.data.user})
            toast.success(response.data.message);
            

            set({authUser: response.data.user,
                isLogin: true,
                isLoading: false,
            })

        } catch (error:any) {
            toast.error(error.response.data.message);
            
            set({authUser: null,
                isLogin: false,
                isLoading: false,
            });
        }
        
        
    },

    autherChecking: async () => {
        set({isLoading: true})
        try {
            const response = await axiosInstanace.get("/auth/getMe");
            set({authUser: response.data.user,
                isLogin: true,
                isLoading: false,
            })
        } catch (error:any) {
            set({authUser: null,
                isLogin: false,
                isLoading: false,
            });
        }
    },
    
    register: async (data:object) => {
        set({isLoading: true});
        try {
            const response = await axiosInstanace.post("/auth/register", data);
            set({authUser: response.data.user,
                isLogin: true,
                isLoading: false,
            })
        } catch (error:any) {
            toast.error(error.response.data.message);
            set({authUser: null,
                isLogin: false,
                isLoading: false,
            });
            
        }
        
    },
    logout: async () => {
        set({isLoading: true})
        try {
            const response = await axiosInstanace.post("/auth/logout")
            set({authUser: null,
                isLogin: false,
                isLoading: false,
            });
            toast.success(response.data.message)
        } catch (error:any) {
            toast.error(error.response.data.message);
        }
    }
}))

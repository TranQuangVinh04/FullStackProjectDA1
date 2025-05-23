import React from "react";
import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authe.store";
import { Eye } from "lucide-react";
import { EyeOff } from "lucide-react";
type Message = {
    type: string; text: string;
};
const Login = () => {
    //store
    const {login ,isLoading} = useAuthStore() 
    //state
    const [formData,setFormData] = useState({
        email:"",
        password:"",
        rememberMe:false
    
      });
      const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
      });
    const [messages, setMessages] = useState<Message[]>([]);
    const toggleShow = (field) => {
        setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
      };
    const simulateWelcomeMessage = async () => {
    
        const welcomeText = "Chào Mừng Bạn Đến Với Mạng Xã Hội Thu Nhỏ Nơi Bạn Có Thể Chia Sẻ Những Khoảng Khắc Cùng Bạn Bè!";
        const chars = welcomeText.split("");
        
        for (let i = 0; i < chars.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 50));
          setMessages(prev => [
            { 
              type: "system", 
              text: chars.slice(0, i + 1).join("") 
            }
          ]);
        }
    };
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        await login(formData);
    }
      useEffect(() => {
        simulateWelcomeMessage();
      }, []);
    
      
    return (
        <div >
            
            <div className="w-full h-[100vh] flex items-center justify-center" style={{
            background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)'
          }}>
            {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`absolute top-0 p-5 rounded-lg max-w-[80%] transition-all duration-300 ease-in-out 
                                }`}
                            >
                            <p className="text-2xl text-white font-bold font-sans">{message.text}</p>
                            </div>
                        ))}
            <img src="/bakroundTest.png" alt="" className=" object-cover rounded-l-lg w-[30%] h-[80%] "/>
                <div className=" h-[80%] w-[40%] flex items-start rounded-lg" data-theme="dark">
                    
                    <form onSubmit={handleLogin} className="flex h-full w-full rounded-r-lg p-5 flex-col" data-theme="business">
                        <div className="tailals pl-10">
                        
                        </div>

                        <div className="Login__Container Container flex flex-col gap-10 px-30 py-10">
                            <h1 className="text-4xl font-bold">Đăng Nhập</h1>
                            <div className="Login__Input flex flex-col gap-1">
                             
                                <input 
                                type="email" 
                                name="email"
                                placeholder="Email" 
                                className="w-full border-b-1 border-gray-300 bg-transparent outline-none focus:outline-none size-10" 
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                disabled={isLoading}
                                />
                                <br />
                               
                                
                                <div className="relative">
                                <input
                                name="password"
                                placeholder="Password" 
                                type={showPassword.confirm ? 'text' : 'password'}
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                className="w-full border-b-1 border-gray-300 bg-transparent  outline-none focus:outline-none size-10"
                                />
                                <span
                                onClick={() => toggleShow('confirm')}
                                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 cursor-pointer"
                                >
                                {showPassword.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                                </span>
                            </div>
                            </div>
                            <div className="Login__ForgotPasswordAndRememberPassword flex justify-between">
                                <div className="RememberPassword flex items-center gap-2">
                                    <input 
                                    type="checkbox" 
                                    onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})} 
                                    className="checkbox checkbox-success" 
                                    checked={formData.rememberMe}
                                    />
                                    <p>Nhớ Mật Khẩu</p>
                                </div>
                                <div className="ForgotPassword">
                                    <a href="/forgotpassword" className=" text-blue-500">Quên Mật Khẩu</a>
                                </div>
                            </div>
                            <div className="Login__Button w-full flex flex-col gap-2 justify-center items-center">

                            <button 
                                    type="submit" 
                                    className="btn btn-active w-[70%]"
                                    disabled={isLoading}
                                >
                                    {isLoading ? <span className="loading loading-spinner"></span> : "Đăng Nhập"}
                                </button>
                                
                               
                               
                            </div>
                            <div className="flex items-center gap-2">
                                    <hr className="w-[49%]"/> Or <hr className="w-[49%]"/>
                                    
                                </div>
                            <div className="flex items-center gap-5 justify-center">
                                    <button className="btn bg-black text-white border-black">
                                            <svg aria-label="GitHub logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="white" d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"></path></svg>
                                            Login with GitHub
                                    </button>
                                    <button className="btn bg-white text-black border-[#e5e5e5]">
                                            <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                                            Login with Google
                                    </button>
                                </div>
                        </div>
                        <div className="Login__ChangeRegister flex justify-center items-center h-[20%]">
                            <p>Bạn Chưa Có Tài Khoản? <a href="/register" className=" text-blue-500">Đăng Ký</a></p>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;

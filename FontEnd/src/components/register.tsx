import { useState, useEffect } from "react";
type Message = {
  type: string; text: string;
};
import { useAuthStore } from "../store/authe.store";
const Register = () => {
    const {register,isLoading} = useAuthStore()
    
    const [formData,setFormData] = useState({
      username:"",
      fullname:"",
      email:"",
      password:"",
      comfirmPassword:"",
  
    });
    const handleRegister = async (e:React.FormEvent) => {
        e.preventDefault();
        await register(formData);
    }
    const [messages, setMessages] = useState<Message[]>([]);
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
                                className={`absolute top-0 p-5 transition-all duration-300 ease-in-out ml-auto animate-slideRight
                                `}
                            >
                           <p className="text-2xl text-white font-bold font-sans">{message.text}</p>
                            </div>
                        ))}
            <img src="/bakroundTest.png" alt="" className=" object-cover rounded-l-lg w-[30%] h-[80%] "/>
                <div className=" h-[80%] w-[40%] flex items-start rounded-lg" data-theme="dark">
                    
                    <form onSubmit={handleRegister} className="flex h-full w-full rounded-r-lg p-5 flex-col" data-theme="business">
                        <div className="tailals pl-10">
                        
                        </div>

                        <div className="Register__Container Container flex flex-col gap-10 px-30 py-10">
                            <h1 className="text-4xl font-bold">Đăng Ký</h1>
                            <div className="Register__Input flex flex-col gap-1">
                            <input 
                              type="text" 
                              placeholder="Tên Người Dùng" 
                              className="w-full border-b-1 border-gray-300 bg-transparent outline-none focus:outline-none size-10" 
                              value={formData.username}
                              onChange={(e) => setFormData({...formData, username: e.target.value})}
                            />
                                <br />
                                <input 
                                  type="text" 
                                  placeholder="@Tên UserName" 
                                  className="w-full border-b-1 border-gray-300 bg-transparent outline-none focus:outline-none size-10" 
                                  value={formData.fullname}
                                  onChange={(e) => setFormData({...formData, fullname: e.target.value})}
                                  disabled={isLoading}
                                />
                                <br />
                                <input 
                                    type="email" 
                                    placeholder="Email" 
                                    className="w-full border-b-1 border-gray-300 bg-transparent outline-none focus:outline-none size-10" 
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    disabled={isLoading}
                                />
                                <br />
                                <input 
                                    type="password" 
                                    placeholder="Mật Khẩu"
                                    className="w-full border-b-1 border-gray-300 bg-transparent  outline-none focus:outline-none size-10" 
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    disabled={isLoading}
                                />
                                <br />
                                <input 
                                    type="password" 
                                    placeholder="Nhập Lại Mật Khẩu "
                                    className="w-full border-b-1 border-gray-300 bg-transparent  outline-none focus:outline-none size-10" 
                                    value={formData.comfirmPassword}
                                    onChange={(e) => setFormData({...formData, comfirmPassword: e.target.value})}
                                    disabled={isLoading}
                                />
                            </div>
                            
                            <div className="Register__Button w-full flex flex-col gap-2 justify-center items-center">

                                <button className="btn btn-active w-[70%]">{isLoading ? <span className="loading loading-spinner"></span> : "Đăng Ký"}</button>
                                
                                
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                                    <hr className="w-[49%]"/>Or<hr className="w-[49%]"/>
                                    
                        </div>
                        
                        <div className="Register__ChangeLogin flex justify-center items-center h-[20%]">
                            <p>Bạn Đã Có Tài Khoản? <a href="/login" className=" text-blue-500">Đăng Nhập</a></p>   
                            </div>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register;

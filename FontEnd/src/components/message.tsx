import React, { useEffect, useState, useRef } from 'react'
import { useAuthStore } from '../store/authe.store';
import { MessageCircle, Search, Check, CheckCheck } from 'lucide-react';
import { useMessageStore } from '../store/message.store';
import NoChatContent from './DefauftChat';
import { useLocation, Navigate } from 'react-router-dom';

interface Message {
    id: string;
    senderId: string;
    content: string;
    timestamp: string;
    status: 'delivered' | 'read';
    type: 'text' | 'image' | 'voice';
}

const Message = () => {
    //đây là phần thông tin người dùng và các user đang ở trạng thái onlline
    const {authUser, onlineUsers} = useAuthStore();
    //đây là phần liên quan đến người dùng sẽ nhắn với mình và tin nhắn sẽ được hiển thị
        const {
            messages, 
            setSelectedUser, 
            selectedUser, 
            // getUser,
            getMessage,
            sendMessage,
            subscribeToMessages,
            unSubscribeToMessages,
            getUserList,
            userList
        } = useMessageStore();
    //dữ liệu demo
    
    const path = useLocation();
    const[message, setMessage] = useState<string>("");
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messageContainerRef = useRef<HTMLDivElement>(null);
    const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
    const handleUserSelect = async(user: any) => {
        if(user){
            await setSelectedUser(user);
        }else{
           return;
        }
    

        
    }
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            // Giới hạn số lượng ảnh tối đa là 8
            const newFiles = [...selectedImages, ...files].slice(0, 8);
            setSelectedImages(newFiles);
            
            // Tạo preview cho tất cả ảnh
            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setImagePreviews(newPreviews);
        }
    };
    const handleRemoveImage = (index: number) => {
        const newImages = selectedImages.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        setSelectedImages(newImages);
        setImagePreviews(newPreviews);
    };
    const handleSendMessage = async () => {
        try {
            if (!message.trim() && selectedImages.length === 0) return;  
            // Gửi tin nhắn lên server
            const result = await sendMessage(selectedUser._id, message, selectedImages);
            
            if (result) {
                // Cập nhật lại danh sách tin nhắn từ server
                await getMessage(selectedUser._id);
                // Reset form
                setMessage("");
                setSelectedImages([]);
                setImagePreviews([]);
                await getUserList(authUser._id);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };
    useEffect(() => {
        getUserList(authUser._id);
    }, []);
    // Cleanup URLs khi component unmount
    useEffect(() => {
        return () => {
            imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
        };
    }, [imagePreviews]);
    useEffect(() => {
        if(selectedUser){
            getMessage(selectedUser._id);
        }
    }, [selectedUser]);
    useEffect(() => {
        subscribeToMessages();
        return () => {
            unSubscribeToMessages();
        };
    }, [selectedUser,subscribeToMessages,unSubscribeToMessages]);
    class HandleSendMassage {
        private static intsance: HandleSendMassage;
        private constructor(){}
        public static getInstance(): HandleSendMassage {
            if(!this.intsance){
                this.intsance = new HandleSendMassage();
            }
            return this.intsance;
        }
        public sendMessageEmoji(){
            alert("Chức Năng đang phát triển");
        }
        public sendMessageVoice(){
            alert("Chức Năng đang phát triển");
        }
    }
    const handleMessage = HandleSendMassage.getInstance();
    // useEffect(() => {
    //     if(path){
    //         getUser(path.pathname.split("/")[2]);
    //     }
        
    // }, [path.pathname]);
    const scrollToBottom = () => {
        if (shouldScrollToBottom && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ 
                behavior: "smooth",
                block: "end"
            });
        }
    };

    // Kiểm tra xem người dùng có đang ở gần bottom không
    const handleScroll = () => {
        if (messageContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = messageContainerRef.current;
            const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
            setShouldScrollToBottom(isNearBottom);
        }
    };
    useEffect(() => {
        const messageContainer = messageContainerRef.current;
        if (messageContainer) {
            messageContainer.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (messageContainer) {
                messageContainer.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages.messages]);

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            await handleSendMessage();
        }
    };
  return (
    <div className='w-full h-full flex '>
        {/* Sidebar */}
        <div className='w-1/5 h-full border-r border-gray-700 bg-black text-white ' data-theme="black">
          
                 {/* Header */}
            <div className='flex items-center p-4 border-b border-gray-700 '>
                <div className='relative'>
                <img 
                    src={authUser?.profileImg} 
                    alt="Avatar" 
                    className='w-10 h-10 rounded-full object-cover ring-2 ring-blue-500 ' 
                />
                                {onlineUsers.includes(authUser._id) && (
                                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-black" />
                            )}
                </div>

                <div className='ml-3 '>
                    <h1 className='text-lg font-semibold text-white'>{authUser?.fullname}</h1>
                    
                </div>
            </div>

            {/* Messages List */}
            <div className='flex flex-col overflow-y-auto h-[calc(100vh-180px)]'>
                <div className='px-4 py-2'>
                    <span className='text-white font-semibold text-lg flex items-center gap-2'>
                        <MessageCircle size={20} />
                        Tin nhắn
                    </span>
                </div>


                <div className='px-2 py-2'>
                    {userList.map((user, index) => (
                        <div
                            key={user.senderId._id===authUser._id ? user.receiverId._id : user.senderId._id}
                            className='flex items-center gap-3 p-2 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors'
                            onClick={() => handleUserSelect(user.senderId._id===authUser._id ? user.receiverId : user.senderId)}
                        >
                            <div className='relative'>
                                <img
                                    src={user.senderId._id===authUser._id ? user.receiverId.profileImg : user.senderId.profileImg}
                                    alt="User Avatar"
                                    className='w-12 h-12 rounded-full object-cover max-xl:hidden'
                                />
                                {onlineUsers.includes(user.senderId._id===authUser._id ? user.receiverId._id : user.senderId._id) && (
                                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-black" />
                            )}
                            </div>
                            <div className='flex-1'>
                                <h3 className='font-semibold text-white select-none'>{user.senderId._id === authUser._id ? user.receiverId.fullname : user.senderId.fullname}</h3>
                                <p className='text-sm text-gray-400 truncate select-none'>{user.text}</p>
                            </div>
                            <span className='text-xs text-gray-400 select-none'>{new Date(user.createdAt).toLocaleString()}</span>
                        </div>
                    ))}
                    {userList.length === 0 && (
                            <div className="text-center text-gray-400 py-8">
                                Không có tin nhắn nào
                            </div>
                )}
                </div>
            </div>
        </div>        
            

        {/* Chat Area */}
        <div className='flex-1'>
            {selectedUser ? (
                <div className='h-screen flex flex-col'>
                    {/* Chat header */}
                    <div className='p-4 border-b border-gray-700 flex items-center bg-black sticky top-0 z-10'>
                        <div className='relative'>
                            <img
                                src={selectedUser.profileImg}
                                alt={selectedUser.fullname}    
                                className='w-10 h-10 rounded-full object-cover '
                            />
                            {onlineUsers.includes(selectedUser._id) && (
                                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-black" />
                            )}
                        </div>
                        <div className='ml-3'>
                            <h2 className='text-white font-semibold'>{selectedUser.fullname}</h2>
                        </div>
                    </div>

                    {/* Messages container */}
                    <div 
                        ref={messageContainerRef}
                        className='flex-1 overflow-y-auto px-4'
                        style={{ 
                            scrollBehavior: 'smooth',
                            minHeight: '0'
                        }}
                    >
                        <div className='py-4 space-y-4'>
                            {[...messages.messages]
                                .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                                .map((message) => (
                                    <>
                                <div 
                                    key={message._id}
                                    className={`flex items-start gap-2 ${message.senderId._id === authUser._id ? 'justify-end' : ''}`}
                                >
                                    {message.senderId._id !== authUser._id && (
                                        <img
                                            src={selectedUser.profileImg}
                                            alt="Avatar"
                                            className='w-8 h-8 rounded-full object-cover'
                                        />
                                    )}
                                    <div className={`rounded-lg p-3 max-w-[70%] ${
                                        message.senderId._id === authUser._id 
                                            ? 'bg-blue-600' 
                                            : 'bg-gray-700'
                                    }`}>
                                        <p className='text-white'>{message.text}</p>
                                        <div className='flex items-center justify-between gap-1 mt-1'>
                                            <span className='text-xs text-gray-300'>{new Date(message.createdAt).toLocaleString()}</span>
                                            {message.senderId._id === authUser._id && (
                                                <span className='text-xs flex items-center gap-0.5 font-bold'>
                                                    {message.status === 'delivered' ? (
                                                        <>
                                                            <CheckCheck className="w-4 h-4 text-white" />
                                                            <span className="text-white text-[10px]">Đã xem</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CheckCheck className="w-4 h-4 text-white" />
                                                            <span className="text-white text-[10px]">Đã nhận</span>
                                                        </>
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {message.senderId._id === authUser._id && (
                                        <img
                                            src={authUser?.profileImg}
                                            alt="Avatar"
                                            className='w-8 h-8 rounded-full object-cover'
                                        />
                                    )}
                                </div>
                                <div className={`flex items-center gap-2 ${message.senderId._id === authUser._id ? 'justify-end' : ''}`}>   
                                    {message.image && message.image.length > 0 && message.image.map((image: any) => (
                                        <img src={image.url} alt="" className='w-50 h-50 object-cover' />
                                    ))}
                                </div>
                                </>
                            )
                        )
                            }
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Chat input - Fixed at bottom */}
                    <div className='border-t border-gray-700 bg-black sticky bottom-0 z-10'>
                        {/* Image Preview Grid */}
                        {imagePreviews.length > 0 && (
                            <div className='p-4 pb-0'>
                                <div className='grid grid-cols-8 gap-1 sm:gap-2 overflow-x-auto pb-2'>
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className='relative aspect-square min-w-[60px] sm:min-w-[80px]'>
                                            <img 
                                                src={preview} 
                                                alt={`Preview ${index + 1}`} 
                                                className='w-full h-full rounded-lg object-cover'
                                            />
                                            <button 
                                                onClick={() => handleRemoveImage(index)}
                                                className='absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white rounded-full p-0.5 sm:p-1 hover:bg-red-600 transition-colors'
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className='text-xs text-gray-400 mt-1 flex justify-between items-center'>
                                    <span>{imagePreviews.length}/8 ảnh đã chọn</span>
                                    {imagePreviews.length > 0 && (
                                        <button 
                                            onClick={() => {
                                                setSelectedImages([]);
                                                setImagePreviews([]);
                                            }}
                                            className='text-red-500 hover:text-red-600 text-xs'
                                        >
                                            Xóa tất cả
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className='p-4 flex items-center gap-2'>
                           
                            <button className='text-gray-400 hover:text-white transition-colors p-2 cursor-pointer' onClick={() => handleMessage.sendMessageEmoji()}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </button>

                          
                            <label className='text-gray-400 hover:text-white transition-colors p-2 cursor-pointer'>
                                <input 
                                    type="file" 
                                    className='hidden' 
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    multiple
                                />
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </label>

                          
                            <label className='text-gray-400 hover:text-white transition-colors p-2 cursor-pointer'>
                                <input type="file" className='hidden' />
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                </svg>
                            </label>

                          {/* Voice message button */}
                            <button className='text-gray-400 hover:text-white transition-colors p-2 cursor-pointer' onClick={() => handleMessage.sendMessageVoice()}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                </svg>
                            </button>

                            <input
                                type="text"
                                placeholder="Nhập tin nhắn..."
                                className='flex-1 bg-gray-700 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />

                            {/* Send button */}
                            <button className='bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors' onClick={handleSendMessage}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            ) : (   
                <div className='h-screen flex items-center justify-center text-gray-400'>
                    <NoChatContent />
                </div>
            )}
        </div>
    </div>
  )
}

export default Message;
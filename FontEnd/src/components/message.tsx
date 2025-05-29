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
    const {messages, setSelectedUser, selectedUser, getUser,getMessage,sendMessage} = useMessageStore();
    //dữ liệu demo
    const filteredUsers: any[] = [{data:{_id: 1, fullname: "John Doe", username: "John Doe", profileImg: "https://via.placeholder.com/150", message: "Hello, how are you?", time: "12:00 PM"}}]
    console.log(selectedUser);
    const path = useLocation();
    const[message, setMessage] = useState<string>("");
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

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
            const result = await sendMessage(selectedUser.data._id, message, selectedImages);
            
            if (result) {
                // Cập nhật lại danh sách tin nhắn từ server
                await getMessage(selectedUser.data._id);
                // Reset form
                setMessage("");
                setSelectedImages([]);
                setImagePreviews([]);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };
    // Cleanup URLs khi component unmount
    useEffect(() => {
        return () => {
            imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
        };
    }, [imagePreviews]);
    useEffect(() => {
        if(selectedUser){
            getMessage(selectedUser.data._id);
        }
    }, [selectedUser]);

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
    useEffect(() => {
        if(path){
            getUser(path.pathname.split("/")[2]);
        }
        
    }, [path.pathname]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages.messages]);

    

  return (
    <div className='w-full h-full flex'>
        {/* Sidebar */}
        <div className='w-1/5 h-full border-r border-gray-700 bg-black text-white' data-theme="black">
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

                <div className='ml-3 relative'>
                    <h1 className='text-lg font-semibold text-white'>{authUser?.fullname}</h1>
                    
                </div>
            </div>

            {/* Search Bar */}
            <div className='p-4'>
                <div className='relative'>
                    <input
                        type="text"
                        placeholder="Tìm kiếm tin nhắn..."
                        className='w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <Search className='absolute left-3 top-2.5 text-gray-400' size={20} />
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

                {/*  Cần Lên Y Tưởng Lại*/}

                {filteredUsers.length === 0 && (
                            <div className="text-center text-gray-400 py-8">
                                Không có tin nhắn nào
                            </div>
                )}
            </div>
        </div>

        {/* Chat Area */}
        <div className='flex-1'>
            {selectedUser ? (
                <div className='h-full flex flex-col'>
                    {/* Chat header */}
                    <div className='p-4 border-b border-gray-700 flex items-center'>
                        <img
                            src={selectedUser.data.profileImg}
                            alt={selectedUser.data.fullname}
                            className='w-10 h-10 rounded-full object-cover'
                        />
                            {onlineUsers.includes(selectedUser.data._id) && (
                                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-black" />
                            )}
                        <div className='ml-3'>
                            <h2 className='text-white font-semibold'>{selectedUser.data.fullname}</h2>
                            
                        </div>
                    </div>

                    {/* Messages will go here */}
                    <div className='flex-1 p-4 overflow-y-auto'>
                        <div className='space-y-4'>
                            {[...messages.messages]
                                .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                                .map((message) => (
                                <div 
                                    key={message._id}
                                    className={`flex items-start gap-2 ${message.senderId._id === authUser._id ? 'justify-end' : ''}`}
                                >
                                    {message.senderId._id !== authUser._id && (
                                        <img
                                            src={selectedUser.data.profileImg}
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
                                <div className='flex items-start gap-2'>
                                    <p>hello</p>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Chat input */}
                    <div className='p-4 border-t border-gray-700'>
                        {/* Image Preview Grid */}
                        {imagePreviews.length > 0 && (
                            <div className='mb-4'>
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

                        <div className='flex items-center gap-2'>
                           
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
                <div className='h-full flex items-center justify-center text-gray-400'>
                    <NoChatContent />
                </div>
            )}
        </div>
    </div>
  )
}

export default Message;
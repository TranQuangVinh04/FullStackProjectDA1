import React, { useState } from 'react';
import { X, Send, ChevronDown } from 'lucide-react';
import CreatePost from './CreatePost';
import { useUserStore } from '../store/user.store';
import { useAuthStore } from '../store/authe.store';

interface DialogCommentPostProps {
  isOpen: boolean;
  onClose: () => void;
  post: any;
  image?: { url: string; type: "image" | "video" }[]; 
  caption: any;
  avatar: any;
  name: any;
  time: any;
  commentss: any;
  likes: any;
  username: any;
}

const DialogComment: React.FC<DialogCommentPostProps> = ({ isOpen, onClose, post, image, caption, avatar, name, time, commentss, likes, username }) => {
    const {commentPost} = useUserStore();
    const {authUser} = useAuthStore();
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState<any[]>(commentss);
    const [showInput, setShowInput] = useState(false);
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
    const [showSortMenu, setShowSortMenu] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (comment.trim() === '') return;  
        const result = await commentPost(post, comment);
        if (result) {
            const newComment = {
                id: Date.now(),
                text: comment,
                user: {
                    fullname: authUser.fullname,
                    profileImg: authUser.profileImg
                },
                createdAt: new Date().toLocaleString()
            };
            setComments([...comments, newComment]);
            setComment('');
        }
    }

    const sortedComments = [...comments].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#242526] rounded-lg w-full max-w-7xl p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white items-center ml-[50%] translate-x-[-50%]">Bài Viết Của {name}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>
                
                <div className='flex gap-4'>
                    <div className='w-1/2'>
                    <div className="flex items-center gap-4 w-full">
          
          <img
            src={avatar ||"./imagebackround.png"}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover cursor-pointer select-none"
          />
          <div className="flex flex-col gap-1 ">
                <a href={`/${username}`} className="cursor-pointer">
            <h2 className="font-semibold cursor-pointer relative group ">
              {name}
              <span className="absolute bottom-[4.5px] left-0 w-full h-[1px] group-hover:bg-gray-50 transition-all duration-100"></span>
              </h2>
              </a>
            <p className="text-xs text-gray-400 border-white-500 relative group cursor-pointer select-none">
              {time}
              <span className="absolute bottom-[1.5px] left-0 w-full h-[1px] group-hover:bg-gray-50 transition-all duration-100"></span>
              </p>
          </div>
        
        </div>

            <p className="mb-3 text-white text-bold font-Roboto text-xl my-5">{caption}</p>
            
      {/* Image Grid */}
      {image && image.length > 0 && (
        <div className={`grid gap-2 mb-3 ${
          image.length === 1 ? 'grid-cols-1' : 
          image.length === 2 ? 'grid-cols-2' :
          image.length === 3 ? 'grid-cols-2' :
          'grid-cols-2'
        }`}>
          {image.map((img, index) => (
            <div 
              key={index}
              className={`relative ${
                image.length === 3 && index === 0 ? 'col-span-2' : ''
              }`}
              style={{ paddingTop: '80%' }}
            >
              {img.type === "image" ? <img
                src={img.url || "./imagebackround.png"}
                alt={`post-image-${index + 1}`}
                className="absolute inset-0 w-full h-full rounded-md object-cover"
              /> : <video
                src={img.url || "./imagebackround.png"}
                className="absolute inset-0 w-full h-full rounded-md object-cover"
                controls

                muted
                loop
              />}
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-between items-center text-sm text-gray-400 mt-3">
        <span className="cursor-pointer" >{likes} lượt thích</span>
        <div className="flex gap-4">
          <span>{comments.length} bình luận</span>
        </div>
      </div>
      
                    </div>
                    
                    <div className='w-1/2 bg-[#18191A] rounded-lg p-4'>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-white font-semibold">Bình luận</h3>
                            <div className="relative">
                                <button 
                                    onClick={() => setShowSortMenu(!showSortMenu)}
                                    className="flex items-center gap-2 text-gray-400 hover:text-white"
                                >
                                    Sắp xếp theo: {sortOrder === 'newest' ? 'Mới nhất' : 'Cũ nhất'}
                                    <ChevronDown size={16} />
                                </button>
                                {showSortMenu && (
                                    <div className="absolute right-0 mt-2 bg-[#3A3B3C] rounded-lg shadow-lg py-2 w-40">
                                        <button
                                            onClick={() => {
                                                setSortOrder('newest');
                                                setShowSortMenu(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-gray-200 hover:bg-[#4E4F50]"
                                        >
                                            Mới nhất
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSortOrder('oldest');
                                                setShowSortMenu(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-gray-200 hover:bg-[#4E4F50]"
                                        >
                                            Cũ nhất
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Có Thể Phát triển thêm tại đây ý tưởng gồm like comment và reply comment như phải thêm chức năng bên back end */}
                        <div className="h-[calc(100vh-200px)] overflow-y-auto mb-4">
                            {sortedComments.map((comment) => (
                                <div key={comment.id} className="flex gap-3 mb-4">
                                    <img 
                                        src={comment.user.profileImg || "./imagebackround.png"} 
                                        alt="avatar" 
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div className="flex flex-col gap-1">
                                        <h3 className="font-semibold text-white">{comment.user.fullname}</h3>
                                        <div className="flex-1">
                                            <div className="bg-[#3A3B3C] rounded-lg p-3">
                                                <p className="text-gray-200">{comment.text}</p>
                                            </div>
                                            {/* <div className="flex gap-4 mt-1 text-sm text-gray-400">
                                                <button className="hover:text-white">Thích</button>
                                                <button className="hover:text-white">Phản hồi</button>
                                                <span>{new Date(comment.createdAt).toLocaleString()}</span>
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <img 
                                src={avatar || "./imagebackround.png"} 
                                alt="avatar" 
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <input
                                type="text"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Viết bình luận..."
                                className="flex-1 bg-[#3A3B3C] text-white rounded-full px-4 py-2 focus:outline-none"
                            />
                            <button 
                                type="submit"
                                className="bg-[#3A3B3C] p-2 rounded-full hover:bg-[#4E4F50] cursor-pointer"
                            >
                                <Send size={20} className="text-white" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DialogComment;

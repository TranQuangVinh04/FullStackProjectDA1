import React, { useState, useCallback } from 'react';
import { X, Send, ChevronDown } from 'lucide-react';
import { useUserStore } from '../store/user.store';
import { useAuthStore } from '../store/authe.store';

interface DialogCommentPostProps {
  isOpen: boolean;
  onClose: () => void;
  post: any;
  image?: { url: string; type: "image" | "video" }[]; 
  caption: string;
  avatar: string;
  name: string;
  time: string;
  commentss: any[];
  likes: number;
  username: string;
}

interface Comment {
  id: number;
  text: string;
  user: {
    fullname: string;
    profileImg: string;
  };
  createdAt: string;
}

const DialogComment: React.FC<DialogCommentPostProps> = ({ 
  isOpen, 
  onClose, 
  post, 
  image, 
  caption, 
  avatar, 
  name, 
  time, 
  commentss, 
  likes, 
  username 
}) => {
  const { commentPost,getPostsUser } = useUserStore();
  const { authUser } = useAuthStore();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>(commentss);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim() === '' || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const result = await commentPost(post, comment.trim());
      
      if (result) {
        const newComment = {
          id: Date.now(),
          text: comment.trim(),
          user: {
            fullname: authUser.fullname,
            profileImg: authUser.profileImg
          },
          createdAt: new Date().toLocaleString()
        };
        setComments(prev => [...prev, newComment]);
        setComment('');
        getPostsUser(username);
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sortedComments = useCallback(() => {
    return [...comments].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [comments, sortOrder]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 md:p-0">
      <div className="bg-[#242526] rounded-xl w-full max-w-7xl animate-fade-in shadow-xl overflow-hidden">
        {/* Header */}
        <div className="relative border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white text-center py-4">
            Bài Viết Của {name}
          </h2>
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row h-[calc(100vh-80px)]">
          <div className="md:w-1/2 p-4 overflow-y-auto border-r border-gray-700/50">

            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <img
                  src={avatar || "./imagebackround.png"}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <a href={`/${username}`} className="group">
                  <span className="font-semibold text-white group-hover:underline">
                    {name}
                  </span>
                </a>
                <span className="text-sm text-gray-400">{time}</span>
              </div>
            </div>

            {/* Caption */}
            <p className="text-white text-lg mb-4">{caption}</p>

            {/* Media */}
            {image && image.length > 0 && (
              <div className={`grid gap-2 mb-4 ${
                image.length === 1 ? 'grid-cols-1' : 
                image.length === 2 ? 'grid-cols-2' :
                image.length === 3 ? 'grid-cols-2' :
                'grid-cols-2'
              }`}>
                {image.map((img, index) => (
                  <div 
                    key={index}
                    className={`relative aspect-square rounded-lg overflow-hidden ${
                      image.length === 3 && index === 0 ? 'col-span-2' : ''
                    }`}
                  >
                    {img.type === "image" ? (
                      <img
                        src={img.url || "./imagebackround.png"}
                        alt={`post-image-${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={img.url || "./imagebackround.png"}
                        className="w-full h-full object-cover"
                        controls
                        muted
                        loop
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Post Stats */}
            <div className="flex justify-between items-center text-sm text-gray-400 select-none">
              <span>{likes} lượt thích</span>
              <span>{comments.length} bình luận</span>
            </div>
          </div>

          
          <div className="md:w-1/2 flex flex-col h-full bg-[#18191A]">
            
            <div className="p-4 border-b border-gray-700/50">
              <div className="flex justify-between items-center">
                <h3 className="text-white font-semibold">Bình luận</h3>
                <div className="relative">
                  <button 
                    onClick={() => setShowSortMenu(!showSortMenu)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                  >
                    {sortOrder === 'newest' ? 'Mới nhất' : 'Cũ nhất'}
                    <ChevronDown size={16} className={`transform transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
                  </button>
                  {showSortMenu && (
                    <div className="absolute right-0 mt-2 bg-[#3A3B3C] rounded-lg shadow-lg py-1 w-40 z-10">
                      <button
                        onClick={() => {
                          setSortOrder('newest');
                          setShowSortMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-gray-200 hover:bg-[#4E4F50] transition-colors"
                      >
                        Mới nhất
                      </button>
                      <button
                        onClick={() => {
                          setSortOrder('oldest');
                          setShowSortMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-gray-200 hover:bg-[#4E4F50] transition-colors"
                      >
                        Cũ nhất
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {sortedComments().map((comment) => (
                <div key={comment.id} className="flex gap-3 group">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <img 
                      src={comment.user.profileImg || "./imagebackround.png"} 
                      alt="avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-semibold text-white">{comment.user.fullname}</h3>
                    <div className="bg-[#3A3B3C] rounded-2xl p-3 text-gray-200">
                      {comment.text}
                    </div>
                    <div className="flex gap-4 items-center">
                      <span className="text-xs text-gray-400">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Comment Input */}
            <div className="p-4 border-t border-gray-700/50">
              <form onSubmit={handleSubmit} className="flex gap-3 items-center">
                <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <img 
                    src={authUser?.profileImg || "./imagebackround.png"} 
                    alt="avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Viết bình luận..."
                  className="flex-1 bg-[#3A3B3C] text-white rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
                <button 
                  type="submit"
                  disabled={!comment.trim() || isSubmitting}
                  className="bg-[#3A3B3C] p-2.5 rounded-full hover:bg-[#4E4F50] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} className="text-white" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(DialogComment);

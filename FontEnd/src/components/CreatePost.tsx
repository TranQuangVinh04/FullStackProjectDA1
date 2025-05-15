import React, { useState } from "react";
import PostActions from "./PostActions";
import { MoreVertical, Trash } from 'lucide-react'; 
import { useUserStore } from "../store/user.store";

interface PostCardProps {
    id: string;
    avatar: string;
    name: string;
    time: string;
    caption: string;
    image?: { url: string }[]; 
    likes?: number;
    comments?: number;
    shares?: number;
    liked?: boolean;
    onDelete?: (id: string) => void; //cần fix
}

const PostCard: React.FC<PostCardProps> = ({
  id,
  avatar,
  name,
  time,
  caption,
  image = [], 
  likes,
  comments = 0,
  shares = 0,
  liked,
  onDelete,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const {deletePost,getPostsUser} = useUserStore();
  const handleDelete = async () => {
    const result = await deletePost(id);
    if(result){
      await getPostsUser();
    }
  };
  return (
    <div className="bg-[#18191a] text-white rounded-md shadow-md max-w-[650px] mx-auto my-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <img
            src={avatar ||"./imagebackround.png"}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h2 className="font-semibold">{name} <span className="text-blue-500">✔</span></h2>
            <p className="text-xs text-gray-400">{time}</p>
          </div>
        </div>
        
        {/* Menu Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-white/10 rounded-full"
          >
            <MoreVertical size={20} />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-[#242526] rounded-md shadow-lg py-1 z-10">
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-white/10"
              >
                <Trash size={16} />
                Xóa bài viết
              </button>
            </div>
          )}
        </div>
        
      </div>
      <p className="mb-3">{caption}</p>
      
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
              style={{ paddingTop: '60%' }}
            >
              <img
                src={img.url || "./imagebackround.png"}
                alt={`post-image-${index + 1}`}
                className="absolute inset-0 w-full h-full rounded-md object-cover"
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center text-sm text-gray-400 mt-3">
        <span>{likes} lượt thích</span>
        <div className="flex gap-4">
          <span>{comments} bình luận</span>
          <span>{shares} lượt chia sẻ</span>
        </div>
      </div>

      <PostActions
        id={id}
        initialLikes={likes}
        initialComments={comments}
        initialShares={shares}
        likedUser={liked || false}
      />
    </div>
  );
};

export default PostCard;
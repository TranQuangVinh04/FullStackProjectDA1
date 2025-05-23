import React, { useEffect, useState } from "react";
import PostActions from "./PostActions";
import { Edit, MoreVertical, Trash, BadgeAlert } from 'lucide-react'; 
import { useUserStore } from "../store/user.store";
import { ModelDilogLikeFollow } from './DialogUserFollow';
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authe.store";
interface PostCardProps {
    id: string;
    avatar: string;
    username: string;
    name: string;
    time: string;
    caption: string;
    image?: { url: string; type: "image" | "video" }[]; 
    likes?: number;
    comments?: number;
    shares?: number;
    liked?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({
  id,
  avatar,
  username,
  name,
  time,
  caption,
  image = [], 
  likes,
  comments = 0,
  shares = 0,
  liked,
}) => {
  const {authUser} = useAuthStore();
  const [showModalLike, setShowModalLike] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const {deletePost,getPostsUser,getPostLikes,likesPost} = useUserStore();
  const handleDelete = async () => {
    const result = await deletePost(id);
    if(result){
      await getPostsUser(username);
    }
  };
  useEffect(() => {
    //Khó fIX qÚA sẽ Fix Sao Có Lỗi ở đây nhớ
    getPostLikes(id);
  }, [id]);
  return (
    <div className="bg-[#18191a] text-white rounded-md shadow-md max-w-[650px] mx-auto my-6 p-4">
      {/* Header */}
      <div key={id} className="flex items-center justify-between mb-3">
     
        <div className="flex items-center gap-4 w-full">
          
          <img
            src={avatar ||"./imagebackround.png"}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover cursor-pointer select-none"
          />
          <div className="flex flex-col gap-1 ">
            <h2 className="font-semibold cursor-pointer relative group ">
              {name}
              <span className="absolute bottom-[4.5px] left-0 w-full h-[1px] group-hover:bg-gray-50 transition-all duration-100"></span>
              </h2>
            <p className="text-xs text-gray-400 border-white-500 relative group cursor-pointer select-none">
              {time}
              <span className="absolute bottom-[1.5px] left-0 w-full h-[1px] group-hover:bg-gray-50 transition-all duration-100"></span>
              </p>
          </div>
        
        </div>
      
        {/* Menu Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-white/10 rounded-full cursor-pointer"
          >
            <MoreVertical size={20} />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-[#242526] rounded-md shadow-lg py-1 z-10">
              {username == authUser.username && (<><button
                onClick={handleDelete}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-white/10 cursor-pointer"
              >
                <Trash size={16} />
                Xóa bài viết
              </button>
              <button
                onClick={()=>{}}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-white hover:bg-white/10 cursor-pointer"
              >
                <Edit size={16} />
                Sửa bài viết
              </button></>)
              
              }
              {username !== authUser.username && (<><button
                onClick={()=>{}}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-white hover:bg-white/10 cursor-pointer"
              >
                <BadgeAlert size={16} />
                Báo Cáo
              </button></>)
              }
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
        <span className="cursor-pointer" onClick={() => setShowModalLike(true)}>{likes} lượt thích</span>
        <div className="flex gap-4">
          <span>{comments} bình luận</span>
          <span>{shares} lượt chia sẻ</span>
        </div>
      </div>
      {showModalLike && (
        <ModelDilogLikeFollow
          isOpen={showModalLike}
          onClose={() => setShowModalLike(false)}
          users={likesPost}
          title="Người Thích"
        />
        
        
      )}
      <PostActions
        id={id}
        initialLikes={likes}
        initialComments={comments}
        initialShares={shares}
        likedUser={liked || false}
        username={username}
      />
    </div>
  );
};

export default PostCard;
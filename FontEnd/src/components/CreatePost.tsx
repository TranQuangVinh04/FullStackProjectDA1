import React, { useEffect, useState } from "react";
import PostActions from "./PostActions";
import { Edit, MoreVertical, Trash, BadgeAlert } from 'lucide-react'; 
import { useUserStore } from "../store/user.store";
import { ModelDilogLikeFollow } from './DialogUserFollowLike';
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authe.store";
import EditPost from "./EditPost";
import ReportPost from "./ReportPost";  
import { useAdminStore } from "../store/admin.store";
interface PostCardProps {
    id: string;
    avatar: string;
    username: string;
    name: string;
    time: string;
    caption: string;
    image?: { url: string; type: "image" | "video" }[]; 
    likes?: any[];
    comments?: number;
    comment?: any[];
    shares?: number;
    liked?: boolean;
    userId: string;
}

const PostCard: React.FC<PostCardProps> = ({
  userId,
  id,
  avatar,
  username,
  name,
  time,
  caption,
  image = [], 
  likes,
  comments = 0,
  comment,
  shares = 0,
  liked,
}) => {

  const {authUser,onlineUsers} = useAuthStore();
  const [showModalLike, setShowModalLike] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const {deletePost, getPostsUser ,updatePost,reportPost} = useUserStore();
  const {getPostsHavior,deletePostAdmin} = useAdminStore();
  
  const handleDelete = async () => {
    const result = await deletePost(id);
    if(result){
      await getPostsUser(username);
    }
    
  };
  
  const handleEdit = async (updatedPost: { content: string; media?: { url: string; type: "image" | "video" }[] }) => {
    
   
    const result = await updatePost(id,updatedPost);
    if(result){
      await getPostsUser(username);
      setShowEditModal(false);
    }
  };
  const handleDeletePost = async (id: string) => {
    const result = await deletePostAdmin(id);
    if(result){
      await getPostsHavior();
    }
  }
  const handleReport = async (reason: string, description: string, postId: string) => {
    const result = await reportPost({postId, reason, description});
    if(result){
      setShowReportModal(false);
    }
  }
  return (
    <div className="bg-[#18191a] text-white rounded-md shadow-md max-w-[700px] mx-auto my-6 p-4 z-1">
      {/* Header */}
      <div key={id} className="flex items-center justify-between mb-3">
     
        <div className="flex items-center gap-4 w-full h-full">
          
          <div className="relative">
            <img
              src={avatar ||"./imagebackround.png"}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover cursor-pointer select-none"
            />
            {onlineUsers.includes(userId) && (
                                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-black" />
            )}
          </div>
           

          
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
              {(username == authUser.username ) && (<>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-white/10 cursor-pointer"
                >
                  <Trash size={16} />
                  Xóa bài viết
                </button>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-white hover:bg-white/10 cursor-pointer"
                >
                  <Edit size={16} />
                  Sửa bài viết
                </button>
                {showEditModal &&  (
                      <>
                      <EditPost
                        isOpen={showEditModal}
                        onClose={() => setShowEditModal(false)}
                        post={{
                          id,
                          caption,
                          media: image
                        }}
                        onSave={handleEdit}
                      />
                      </>
                    )}
              </>)}
              {authUser.role === "admin" && (<>
                <button
                  onClick={() => handleDeletePost(id)}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-white/10 cursor-pointer"
                >
                  <Trash size={16} />
                  Xóa bài viết Người Dùng
                </button>
              </>)}
              {(username !== authUser.username) && (<><button
                onClick={() => setShowReportModal(true)}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-white hover:bg-white/10 cursor-pointer"
              >
                <BadgeAlert size={16} />
                Báo Cáo
              </button></>)
              }
              {showReportModal && (
                <ReportPost
                  isOpen={showReportModal}
                  onClose={() => setShowReportModal(false)}
                  postId={id}
                  onReport={handleReport}
                />
              )}
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
        <span className="cursor-pointer" onClick={() => setShowModalLike(true)}>{likes?.length} lượt thích</span>
        <div className="flex gap-4">
          <span>{comments} bình luận</span>
        </div>
      </div>
      {showModalLike && (
        <ModelDilogLikeFollow
          isOpen={showModalLike}
          onClose={() => setShowModalLike(false)}
          users={likes}
          title="Người Thích"
        />
        
        
      )}
      <PostActions
        id={id}
        initialLikes={likes?.length || 0}
        initialComments={comments}
        initialShares={shares}
        likedUser={liked || false}
        username={name}
        name={username}
        image={image}
        caption={caption}
        avatar={avatar}
        time={time}
        comment={comment}
      />
    </div>
  );
};

export default PostCard;
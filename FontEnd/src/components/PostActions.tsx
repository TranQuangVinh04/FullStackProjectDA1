import React, { useState } from "react";
import { ThumbsUp, MessageCircle, Share2 } from "lucide-react";
import { useUserStore } from "../store/user.store";
interface PostActionsProps {
  initialLikes?: number;
  initialComments?: number;
  initialShares?: number;
  id: string;
  likedUser: boolean;
  username: string;
}

const PostActions: React.FC<PostActionsProps> = ({
  id, 
  initialLikes = 0,
  initialComments = 0,
  initialShares = 0,
  likedUser = false,
  username,
}) => {
  const [showModalComment, setShowModalComment] = useState(false);
  const {likepost,getPostsUser} = useUserStore();
  const [likes, setLikes] = useState(initialLikes);
  const [comments, setComments] = useState(initialComments);
  const [shares, setShares] = useState(initialShares);
  const [liked, setLiked] = useState(likedUser);
  const handleLike = async () => {
    
    const resuft = await likepost(id);
    setLiked(resuft);
    if(resuft){
      setLikes(likes + 1);
      setLiked(resuft);
    }else{
      setLikes(likes - 1);
      setLiked(resuft);
    }
    await getPostsUser(username);
  };

  const handleComment = () => {
    
  };

  const handleShare = () => {
    setShares(shares + 1);
    alert("Cảm ơn bạn đã chia sẻ!");
  };
  return (
    <div className="border-t border-gray-700 mt-3 pt-2 flex justify-around text-sm text-gray-300">
      <button
        className={`flex items-center gap-1 cursor-pointer ${
          liked ? "text-blue-500" : "hover:text-white"
        }`}
        onClick={handleLike}
      >
        <ThumbsUp size={16} />
        Thích {likes > 0 ? `` : ""}
      </button>
      <button
        className="flex items-center gap-1 hover:text-white cursor-pointer"
        onClick={() => setShowModalComment(true)}
      >
        <MessageCircle size={16} />
        Bình luận {comments > 0 ? `(${comments})` : ""}
      </button>
      
      <button
        className="flex items-center gap-1 hover:text-white cursor-pointer"
        onClick={handleShare}
      >
        <Share2 size={16} />
        Chia sẻ {shares > 0 ? `(${shares})` : ""}
      </button>
      
    </div>
  );
};

export default PostActions;

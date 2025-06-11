import React, { useState } from "react";
import { ThumbsUp, MessageCircle, Share2 } from "lucide-react";
import { useUserStore } from "../store/user.store";
import DialogComment from "./DialogCommentPost";
interface PostActionsProps {
  initialLikes?: number;
  initialComments?: number;
  initialShares?: number;
  id: string;
  likedUser: boolean;
  username: string;
  image: any;
  caption: any;
  avatar: any;
  time: any;
  comment: any;
  name: string;
}

const PostActions: React.FC<PostActionsProps> = ({
  id, 
  initialLikes = 0,
  initialComments = 0,
  likedUser = false,
  username,
  image,
  caption,
  avatar,
  time,
  comment,
  name,
}) => {

  const [showModalComment, setShowModalComment] = useState(false);
  const {likepost,getPostsUser,getPosts} = useUserStore();
  const [likes, setLikes] = useState(initialLikes);
  const [comments, setComments] = useState(initialComments);
  const [liked, setLiked] = useState(likedUser);

  const handleLike = async () => {
    
    const resuft = await likepost(id);
    setLiked(resuft);
    

    await getPostsUser(name);
    getPosts();
  };
  return (
    <div className="border-t border-gray-700 mt-3 pt-2 flex justify-around text-sm text-gray-300">
      <button
        className={`flex items-center gap-1 cursor-pointer ${
          liked ? "text-blue-500" : "hover:text-white select-none"
        }`}
        onClick={handleLike}
      >
        <ThumbsUp size={16} />
        Thích
      </button>
      <button
        className="flex items-center gap-1 hover:text-white cursor-pointer select-none"
        onClick={() => setShowModalComment(true)}
      >
        <MessageCircle size={16} />
        Bình luận
      </button>
      <DialogComment
        isOpen={showModalComment}
        onClose={() => setShowModalComment(false)}
        post={id}
        image={image}
        caption={caption}
        name={username}
        avatar={avatar}
        time={time}
        commentss={comment}
        likes={initialLikes}
        username={name}
      />
      
      
    </div>
  );
};

export default PostActions;

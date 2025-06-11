import React, { useEffect, useState } from "react";
import { useUserStore } from "../store/user.store";
import { useAuthStore } from "../store/authe.store";
import CreatePost from "./CreatePost";
import { Spinner } from "./ui/Spinner";
import CreatePostDialog from "./CreatePostDialog";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

interface MediaItem {
  url: string;
  type: 'video' | 'image';
}

interface Post {
  _id: string;
  profileImg?: string;
  username: string;
  fullname: string;
  createdAt: string;
  content: string;
  media: (string | MediaItem)[];
  likes: Array<{ _id: string }>;
  comments: any[];
  user: {
    profileImg: string;
    username: string;
    fullname: string;
    _id: string;
  };
}



const EmptyState = ({setShowCreatePostDialog,showCreatePostDialog}:{setShowCreatePostDialog: (show: boolean) => void,showCreatePostDialog: boolean}) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <svg
      className="w-16 h-16 text-gray-400 mb-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
      />
    </svg>
    <h3 className="text-xl font-semibold text-white">Không có 1 post nào tồn tại có thể bạn là người đầu tiên của trang mạng xã hội của tôi chào mừng bạn</h3>
    <p className="text-white mt-2 mb-5">Hãy tạo post đầu tiên của bạn</p>
    <button className="bg-blue-500 text-white p-2 rounded-md cursor-pointer" onClick={() => setShowCreatePostDialog(true)}>Tạo post</button>
    {showCreatePostDialog && <CreatePostDialog isOpen={showCreatePostDialog} onClose={() => setShowCreatePostDialog(false)} />}
  </div>
);

const Home = () => {
  const { allPosts, getPosts,getSuggestedUsers,suggestUsers,setFollowUser ,getHashtags,hashtags} = useUserStore();
  const { authUser,autherChecking,isLoading:isLoadingAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [showCreatePostDialog, setShowCreatePostDialog] = useState(false);
  //Xử Lý Theo Dõi
const handleFollow = async (userId:string) => {
  const resuft = await setFollowUser(userId);
  if(resuft){
    await autherChecking();
  }
}
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        await getPosts();
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [getPosts]);
  useEffect(() => {
    getSuggestedUsers();
  }, [getSuggestedUsers]);
  useEffect(() => {
    getHashtags();
  }, [getHashtags]);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }
  return (
    <main className="min-h-screen">
      <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8 flex justify-between">
        <div className="space-y-6 flex-1 max-w-2xl">
          {allPosts.length === 0 ? (
            <EmptyState setShowCreatePostDialog={setShowCreatePostDialog} showCreatePostDialog={showCreatePostDialog} />
          ) : (
            allPosts.map((post: Post) => (
              <CreatePost
                key={post._id}
                userId={post?.user?._id||""}
                id={post._id}
                avatar={post?.user?.profileImg || ""}
                username={post?.user?.username || ""}
                name={post?.user?.fullname || ""}
                time={new Date(post.createdAt).toLocaleString()}
                caption={post.content.replace(/^"(.*)"$/, '$1')}
                image={post.media.length > 0 ? post.media.map(media => ({
                  url: typeof media === 'string' ? media : media.url || '',
                  type: typeof media === 'string' 
                    ? (media.toLowerCase().match(/\.(mp4|webm|ogg)$/) ? 'video' : 'image')
                    : (media.type || 'image')
                })) : []}
                likes={post.likes}
                liked={post.likes.map((like) => like._id).includes(authUser?._id)}
                comments={post.comments.length}
                comment={post.comments}
              />
            ))
          )}
        </div>

        <div className="w-80 ml-8 sticky top-6 h-fit max-[1422px]:hidden">
          {/* Trending Section */}
          <div className="bg-gray-900 rounded-lg p-4 mb-6">
            <h2 className="text-xl text-white font-semibold mb-4">Trending</h2>
            <div className="space-y-3">
                {hashtags.map(topic => (
                <div key={topic._id} className="flex items-center justify-between group cursor-pointer hover:bg-gray-800 p-2 rounded-lg transition-all">
                  <div>
                    <p className="text-white font-medium">#{topic.name}</p>
                    <p className="text-gray-400 text-sm">{topic.count} posts</p>
                  </div>
                  
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Users Section */}
          <div className="bg-gray-900 rounded-lg p-4">
            <h2 className="text-xl text-white font-semibold mb-4">Gợi ý Theo Dõi</h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
              {suggestUsers.filter(user => user.username !== authUser.username).map(user => (
               
                <div key={user.id} className="flex items-center justify-between group hover:bg-gray-800 p-2 rounded-lg transition-all">
                   <Link to={`/${user.username}`} key={user.id}>
                  <div className="flex items-center space-x-3">
                    <img src={user.profileImg} alt={user.username} className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="text-white font-medium">{user.fullname}</p>
                      <p className="text-gray-400 text-sm">@{user.username} {user.followers}</p>
                    </div>
                  </div>
                  </Link>
                  <button 
                  className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm hover:bg-blue-600 transition-colors cursor-pointer" 
                  onClick={()=>{handleFollow(user._id)}}
                  disabled={isLoadingAuth}>
                    {authUser.following.map((item)=>item._id).includes(user._id) ? "Đang Theo Dõi" : "Theo Dõi"}
                  
                  </button>
                </div>
               
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default React.memo(Home);
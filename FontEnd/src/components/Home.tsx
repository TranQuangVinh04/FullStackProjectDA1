import React, { useEffect, useState } from "react";
import { useUserStore } from "../store/user.store";
import { useAuthStore } from "../store/authe.store";
import CreatePost from "./CreatePost";
import { Spinner } from "./ui/Spinner";
import CreatePostDialog from "./CreatePostDialog";

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
    <h3 className="text-xl font-semibold text-gray-900">Không có 1 post nào tồn tại có thể bạn là người đầu tiên của trang mạng xã hội của tôi chào mừng bạn</h3>
    <p className="text-gray-500 mt-2">Hãy tạo post đầu tiên của bạn</p>
    <button className="bg-blue-500 text-white p-2 rounded-md" onClick={() => setShowCreatePostDialog(true)}>Tạo post</button>
    {showCreatePostDialog && <CreatePostDialog isOpen={showCreatePostDialog} onClose={() => setShowCreatePostDialog(false)} />}
  </div>
);

const Home = () => {
  const { allPosts, getPosts } = useUserStore();
  const { authUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [showCreatePostDialog, setShowCreatePostDialog] = useState(false);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <main className="min-h-screen py-6">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {allPosts.length === 0 ? (
            <EmptyState setShowCreatePostDialog={setShowCreatePostDialog} showCreatePostDialog={showCreatePostDialog}  />
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
      </div>
    </main>
  );
};

export default React.memo(Home);
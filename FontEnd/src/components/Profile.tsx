import { User, Bookmark, Trophy , Camera } from 'lucide-react';
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/authe.store";
import { useUserStore } from "../store/user.store";
import CreatePost from './CreatePost';
import FollowersModal from './Dialog';

function Profile() {
  //store
  const { authUser ,isLoading ,autherChecking} = useAuthStore();
  const { updateProfile } = useUserStore();

  //state
  const { username, fullname, profileImg, followers = [], following = [] } = authUser;
  const [activeTab, setActiveTab] = useState("posts");
  const [selectedImg, setSelectedImg] = useState(profileImg);
  const { getPostsUser, postsUser } = useUserStore();
  const [showModalFollowers, setShowModalFollowers] = useState(false);
  const [showModalFollowing, setShowModalFollowing] = useState(false);

  useEffect(() => {
    getPostsUser();
}, []);

//Xử Lý Upload ảnh
const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = async () => {
    const newImage = new FormData();
    newImage.append("image", file);
    const resuft = await updateProfile(newImage);
    if(resuft){
      await autherChecking();
    }
  };
};
  //mode
  const isDarkMode = true;
  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-black text-white" : "bg-white text-black"} min-xl:mx-60  `}>
      {/* Header */}
      <div className="flex flex-col items-center gap-4 relative pt-10 pb-3">
        <div className="absolute top-10 right-0 max-xl:w-40 px-3 py-3 ">
            <button className='btn btn-soft bg-[#333] text-white px-4 py-2 rounded-md cursor-pointer max-xl:text-[15px]'>Chỉnh sửa trang cá nhân</button>
            {/* <button className='btn btn-soft bg-[#333] text-white px-4 py-2 rounded-md cursor-pointer'>Kho lưu trữ</button> */}
        </div>

        <div className="flex items-center gap-40">
             {/* Avatar */}
          <div className="rounded-full border-4 border-purple-500 p-1 relative">
            <img
              src={ selectedImg|| "./imagebackround.png"}
              alt="avatar"
              className="w-32 h-32 object-cover rounded-full"
            />
          <label
              htmlFor="avatar-upload"
              className={`
                absolute bottom-0 right-0 
                bg-base-content hover:scale-105
                p-2 rounded-full cursor-pointer 
                transition-all duration-200  
              `}
          >
            <Camera className="w-4 h-4 text-black" />
            <input
              type="file"
              id="avatar-upload"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isLoading}
            />
          </label>
        </div>

        {/* Tên và username */}
        <div className="flex flex-col gap-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold">{fullname}</h1>
            <p className="text-sm text-gray-400">@{username}</p>
          </div>
          <div className="flex gap-10 mt-4 select-none">
            <div className="text-center">
              <p className="font-bold text-lg">{postsUser.length}</p>
              <p className="text-xs text-gray-400">Bài viết</p>
            </div>
            <button className="text-center cursor-pointer" onClick={() => setShowModalFollowers(true)}>
              <p className="font-bold text-lg">{followers.length}</p>
              <p className="text-xs text-gray-400">Người theo dõi</p>
            </button>
            <button className="text-center cursor-pointer" onClick={() => setShowModalFollowing(true)}>
              <p className="font-bold text-lg">{following.length}</p>
              <p className="text-xs text-gray-400">Đang theo dõi</p>
            </button>
          </div>
        </div>
      </div>
      <div className='text-center text-gray-400 mt-15 '>{authUser.link}</div>
    </div>
            {showModalFollowers && (
        <FollowersModal
          isOpen={showModalFollowers}
          onClose={() => setShowModalFollowers(false)}
          users={authUser.followers}
          title="Người Theo Dõi"
        />
        
        
      )}
      {showModalFollowing && (
        <FollowersModal
          isOpen={showModalFollowing}
          onClose={() => setShowModalFollowing(false)}
          users={authUser.following}
          title="Đang theo dõi"
        />
        
        
      )}
      
      <div className="flex justify-center border-t border-gray-700 pt-2 gap-6">
     
        <Tab
          icon={User}
          label="Bài viết"
          isActive={activeTab === "posts"}
          onClick={() => setActiveTab("posts")}
        />
        <Tab
          icon={Bookmark}
          label="Đã lưu"
          isActive={activeTab === "saved"}
          onClick={() => setActiveTab("saved")}
        />
        <Tab
          icon={Trophy}
          label="Thành tựu"
          isActive={activeTab === "achievements"}
          onClick={() => setActiveTab("achievements")}
        />
      </div>
      <div className="mt-5">
      
  {activeTab === "posts" && (
    <div>
      {postsUser.length === 0 ? (
        <div className="text-center text-gray-400">
          <p className="text-xl">Chia sẻ ảnh đầu tiên của bạn</p>
          <p className="text-sm mt-2">Khi bạn chia sẻ ảnh, ảnh sẽ xuất hiện trên trang cá nhân của bạn.</p>
          <button className='bg-blue-500 text-white px-4 py-2 rounded-md mt-4'>Chia sẻ ảnh đầu tiên</button>
        </div>
      ) : (
        postsUser.map((post) => (
          <CreatePost

            id={post._id}
            avatar={profileImg}
            name={fullname}
            time={new Date(post.createdAt).toLocaleString()}
            caption={post.content}
            image={post.media.length > 0 ? post.media: null}
            likes={post.likes.length}
            liked={post.likes.includes(authUser._id)}

          />
        ))
      )}
    </div>
  )}

  {activeTab === "saved" && (
    <div className="text-center text-gray-400">Bạn chưa lưu bài viết nào.</div>
  )}

  {activeTab === "achievements" && (
    <div className="text-center text-gray-400">Bạn chưa có thành tựu nào.</div>
  )}
</div>

      
    </div>
  );
}

function Tab({ icon: Icon, label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 text-sm px-4 py-2 rounded-md 
        ${isActive ? "bg-gray-700 text-white" : "text-gray-300 hover:text-white"} transition`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}



export default Profile;

import { User, Video, Trophy , Camera, MessageCircle, UserRoundPlus, UserRoundMinus } from 'lucide-react';
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/authe.store";
import { useUserStore } from "../store/user.store";
import CreatePost from './CreatePost';
import { ModelDilogLikeFollow } from './DialogUserFollowLike';
import { Link, useParams } from 'react-router-dom';
import Loading from './Loading';
import { useNavigate } from 'react-router-dom';
import { useMessageStore } from '../store/message.store';
function Profile() {
  //store
  const { authUser ,isLoading ,autherChecking} = useAuthStore();
  const { updateProfileImg ,getProfileUser ,profileUser ,setFollowUser} = useUserStore();
  const { getPostsUser, postsUser } = useUserStore();
  const { getUser, massageLoading } = useMessageStore();
  //state
  const {username} = useParams() as {username: string};
  const { username:Name, fullname, followers = [], following = [] } = authUser;
  const [activeTab, setActiveTab] = useState("posts");
  const [showModalFollowers, setShowModalFollowers] = useState(false);
  const [showModalFollowing, setShowModalFollowing] = useState(false);
  const navigate = useNavigate();

   let activeFollow = "follow"
   let profileImg = null;
 
  authUser.following.map((item)=>{
      username == item.username ? activeFollow = "unfollow" : activeFollow = "follow"
  })  
  
 
  useEffect(() => {
    const fetchData = async () => {
      const targetUsername = Name === username ? Name : username;
       await getPostsUser(targetUsername);
       const resuft = await getProfileUser(targetUsername);
       if(resuft !==undefined && resuft !==null && resuft ==false){
        navigate('/404')
       }
    };
   
    fetchData();
    
  }, [username]);
  if(profileUser?.profileImg){
    profileImg = profileUser?.profileImg
  }
  //Loading
  if(!profileUser){
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    )
  }

//Xử Lý Upload ảnh
const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = async () => {
    const newImage = new FormData();
    newImage.append("image", file);
    const resuft = await updateProfileImg(newImage);
    if(resuft){
      await autherChecking();
    }
  };
};
//Xử Lý Logic tin nhắn và chuyển trang
const handleMessage = async () => {
  const resuft = await getUser(profileUser?._id);
  if(resuft){
    navigate(`/message/${profileUser?._id}`);
  }else{
    return;
  }

}
//Xử Lý Theo Dõi
const handleFollow = async () => {
  const resuft = await setFollowUser(profileUser._id);
  if(resuft){
    await getProfileUser(username);
    await autherChecking();
  }
}
  //mode
  const isDarkMode = true;
  
  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-black text-white" : "bg-white text-black"} min-xl:mx-60  `}>
      {/* Header */}
      <div className="flex flex-col items-center gap-4 relative pt-10 pb-3">
        {authUser.username == username ?<Link to={`/${authUser._id}/edit`}>
        <div className="absolute top-10 right-0 max-xl:w-40 px-3 py-3 ">
            <button className='btn btn-soft bg-[#333] text-white px-4 py-2 rounded-md cursor-pointer max-xl:text-[15px]'>Chỉnh sửa trang cá nhân</button>
            {/* <button className='btn btn-soft bg-[#333] text-white px-4 py-2 rounded-md cursor-pointer'>Kho lưu trữ</button> */}
        </div>
       </Link>:"" }

        <div className="flex items-center gap-20">
             {/* Avatar */}
             
          <div className="rounded-full border-4 border-purple-500 p-1 relative cursor-pointer">
            
            <img
              src={profileImg || "./boy1.png"}
              alt="avatar"
              className="w-32 h-32 object-cover rounded-full"
            />
           
          {profileUser?.username === authUser.username && <label
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
          </label>}
        </div>
        
        {/* Tên và username */}
        <div className="flex flex-col gap-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold">{profileUser?.fullname||""}</h1>
            <p className="text-sm text-gray-400">@{profileUser?.username||""}</p>
          </div>
          <div className="flex gap-10 mt-4 select-none">
            <div className="text-center">
              <p className="font-bold text-lg">{postsUser.length}</p>
              <p className="text-xs text-gray-400">Bài viết</p>
            </div>
            <button className="text-center cursor-pointer" onClick={() => setShowModalFollowers(true)}>
              <p className="font-bold text-lg">{profileUser?.followers.length||0}</p>
              <p className="text-xs text-gray-400">Người theo dõi</p>
            </button>
            <button className="text-center cursor-pointer" onClick={() => setShowModalFollowing(true)}>
              <p className="font-bold text-lg">{profileUser?.following.length||0}</p>
              <p className="text-xs text-gray-400">Đang theo dõi</p>
            </button>
            
          </div>
          
        </div>
        {username !== Name && <div className='flex gap-5 max-xl:flex-col'>
            
            <button className="btn btn-accente border-[#e5e5e5] rounded-full" onClick={handleFollow}>
              {activeFollow =="unfollow" ? <><UserRoundMinus /> {"Hủy Theo Dõi"}</> : <><UserRoundPlus /> {"Theo Dõi"}</>}
              
            </button>
            <button className="btn btn-accent border-[#e5e5e5] rounded-full" onClick={handleMessage}>
              {massageLoading ? <span className="loading loading-spinner"></span> : <><MessageCircle />Nhắn tin</>}
            </button>
            </div>
     }
      </div>
      <div className='text-center text-gray-400 mt-15 '>{profileUser?.link||""}</div>
    </div>
            {showModalFollowers && (
        <ModelDilogLikeFollow
          isOpen={showModalFollowers}
          onClose={() => setShowModalFollowers(false)}
          users={profileUser?.followers}
          title="Người Theo Dõi"
        />
        
        
      )}
      {showModalFollowing && (
        <ModelDilogLikeFollow
          isOpen={showModalFollowing}
          onClose={() => setShowModalFollowing(false)}
          users={profileUser?.following}
          title="Người Đang Theo Dõi"
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
          icon={Video}
          label="Khoảng Khắc"
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
            avatar={profileUser?.profileImg||""}
            username={profileUser?.username||""}
            name={profileUser?.fullname||""}
            time={new Date(post.createdAt).toLocaleString()}
            caption={post.content.replace(/^"(.*)"$/, '$1')}
            image={post.media.length > 0 ? post.media: null}
            likes={post.likes}
            liked={post.likes.map((like)=>like._id).includes(authUser?._id)}
            comments={post.comments.length}
            comment={post.comments}
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
      className={`flex items-center gap-2 text-sm px-4 py-2 rounded-md cursor-pointer select-none
        ${isActive ? "bg-gray-700 text-white" : "text-gray-300 hover:text-white"} transition`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}



export default Profile;


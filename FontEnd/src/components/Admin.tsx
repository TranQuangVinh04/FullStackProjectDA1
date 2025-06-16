import React, { useState, useMemo, useEffect } from 'react';
import { useAdminStore } from '../store/admin.store';
import { useAuthStore } from '../store/authe.store';
import ChangePasswordDialog from './ChangePasswordDialog';
import ConfirmDialog from './ConfirmDialog';
import CreatePost from './CreatePost';
import { User as documentUserAdmin } from '../services/serviceAdmins';
import ServicesAdmin from '../services/serviceAdmins';


const Admin: React.FC = () => {
  //Handle Logic
  const adminServices = ServicesAdmin.getInstance();

  //Store Admin
  const {
    users,
    getUsers,
    banOrUnbanUser,
    getPostsHavior,
    postsHavior,
    deleteReportHavior
  } = useAdminStore()

  //Store Auth
  const {authUser} = useAuthStore()

  //state
  const [activeTab, setActiveTab] = useState<'users' | 'postsHavior'>('users');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<documentUserAdmin | null>(null);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [userToBan, setUserToBan] = useState<{ id: string; status: string } | null>(null);
  

  //filter reload
  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  // Pagination logic
  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  //getUsẻ
  useEffect(() => {
    getUsers()
  }, [getUsers])

  //getPostsHavior
  useEffect(() => {
    getPostsHavior()
  }, [getPostsHavior])

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
          
          {/* Tabs */}
          <div className="flex space-x-4 mb-6">
            <button
              className={`px-4 py-2 rounded-lg cursor-pointer ${
                activeTab === 'users' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setActiveTab('users')}
            >
              Users
            </button>
            <button
              className={`px-4 py-2 rounded-lg cursor-pointer ${
                activeTab === 'postsHavior' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setActiveTab('postsHavior')}
            >
              Posts Havior
            </button>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow p-6">
            {activeTab === 'users' ? (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-black">Quản lý người dùng</h2>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by username or email..."
                      value={searchTerm}
                      onChange={(e) => adminServices.handleSearchChange(e,setCurrentPage,setSearchTerm)}
                      className="w-64 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <svg
                      className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>

                {currentUsers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Không tìm thấy người dùng nào phù hợp với tiêu chí tìm kiếm.
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Tên người dùng</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Vai trò</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Trạng thái</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentUsers.map((user) => (
                        user._id !== authUser._id && (
                          <tr key={user._id}>
                            <td className="px-6 py-4 text-gray-500">{user.username}</td>
                            <td className="px-6 py-4 text-gray-500">{user.email}</td>
                            <td className="px-6 py-4 text-gray-500">{user.role}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 flex flex-col gap-2">
                              <button 
                                className={`btn hover:text-red-800 ${user.status === 'active' ? 'bg-red-500' : 'bg-green-500'} text-white rounded-md cursor-pointer`}
                                onClick={() => adminServices.handleBanOrUnbanUser({userId:user._id,status:user.status,setIsConfirmOpen,setUserToBan})}
                              >
                                {user.status === 'active' ? 'Khóa Tài Khoản' : 'Mở Khóa Tài Khoản'}
                              </button>
                              <button 
                                className="btn bg-blue-500 text-white rounded-md cursor-pointer"
                                onClick={() => adminServices.handleChangePassword({userId:user._id,username:user.username,setIsChangePasswordOpen,setSelectedUser})}
                              >
                                Đổi Mật Khẩu
                              </button>
                            </td>
                          </tr>
                        )
                      ))}
                    </tbody>
                  </table>
                )}

                {/* Pagination */}
                {filteredUsers.length > 0 && (
                  <div className="flex justify-center items-center space-x-2 mt-6">
                    <button
                      onClick={() => adminServices.handlePageChange(currentPage - 1,setCurrentPage)}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => adminServices.handlePageChange(page,setCurrentPage)}
                        className={`px-3 py-1 rounded cursor-pointer ${
                          currentPage === page
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => adminServices.handlePageChange(currentPage + 1,setCurrentPage)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h2 className="flex text-xl font-semibold mb-4 text-black">Các Post Bị Report</h2>
                 <div  className='flex gap-4 overflow-auto w-[100%] flex-wrap'>
                    {postsHavior.map((postHavior)=>(
                        
                            <div className=' bg-black rounded-lg p-4'>
                                <button className='float-right btn bg-red-500 text-white rounded-md cursor-pointer' onClick={()=>{adminServices.handleDeleteReportHavior(postHavior?._id,deleteReportHavior)}}>Xóa</button>
                                <h3 className='text-white'>{postHavior.text}</h3>
                                <p className='text-white-500'>{postHavior.problem =="inappropriate" ? "Nội dung không phù hợp" :""}</p>
                                <p className='text-white-500'>{postHavior.problem =="spam" ? "Spam" :""}</p>
                                <p className='text-white-500'>{postHavior.problem =="copyright" ? "Bản quyền" :""}</p>
                                <p className='text-white-500'>{postHavior.problem =="other" ? "Khác" :""}</p>
                                <p className='text-white-500'>{new Date(postHavior.createdAt).toLocaleDateString()}</p>
                                <div className='w-[300px]'>
                                    
                                    <CreatePost
                                        key={postHavior.post?._id}
                                        userId={postHavior.post?.user?._id||""}
                                        id={postHavior.post?._id}
                                        avatar={postHavior.post?.user?.profileImg || ""}
                                        username={postHavior.post?.user?.username || ""}
                                        name={postHavior.post?.user?.fullname || ""}
                                        time={new Date(postHavior.post?.createdAt).toLocaleString()}
                                        caption={postHavior.post?.content.replace(/^"(.*)"$/, '$1')}
                                        image={postHavior.post?.media.length > 0 ? postHavior.post?.media.map(media => ({
                                        url: typeof media === 'string' ? media : media.url || '',
                                        type: typeof media === 'string' 
                                            ? (media.toLowerCase().match(/\.(mp4|webm|ogg)$/) ? 'video' : 'image')
                                            : (media.type || 'image')
                                        })) : []}
                                        likes={postHavior.post?.likes}
                                        liked={postHavior.post?.likes.map((like) => like._id).includes(authUser?._id)}
                                        comments={postHavior.post?.comments.length}
                                        comment={postHavior.post?.comments}
                                    />
                              </div>
                            </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Change Password Dialog */}
      {selectedUser && (
        <ChangePasswordDialog
          isOpen={isChangePasswordOpen}
          onClose={() => setIsChangePasswordOpen(false)}
          onSubmit={()=>{}}
          username={selectedUser.username}
          userId={selectedUser.id}
        />
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setUserToBan(null);
        }}
        onConfirm={()=>{adminServices.handleConfirmBan(userToBan,banOrUnbanUser,getUsers)}}
        title={userToBan?.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
        message={
          userToBan?.status === 'active'
            ? 'Bạn có chắc chắn muốn khóa tài khoản này không?'
            : 'Bạn có chắc chắn muốn mở khóa tài khoản này không?'
        }
      />
    </>
  );
};

export default Admin; 
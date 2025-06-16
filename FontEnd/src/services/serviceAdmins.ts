import { toast } from "react-hot-toast";
//interFace Admin
export interface User {
    id: string;
    username: string;
    email: string;
    role: string;
    status: 'active' | 'banned';
  }
export interface HandleBanOrUnbanUser {
    userId: string;
    status: string;
    setIsConfirmOpen: (isConfirmOpen: boolean) => void;
    setUserToBan: (userToBan: { id: string; status: string } | null) => void;
}
export interface HandleChangePassword {
    userId: string;
    username: string;
    setIsChangePasswordOpen: (isChangePasswordOpen: boolean) => void;
    setSelectedUser: (selectedUser: User | null) => void;
}

//Class Admin Services
class ServicesAdmin {
    private static instance: ServicesAdmin;
    private constructor() {}
    public static getInstance(): ServicesAdmin {
        if (!ServicesAdmin.instance) {
            ServicesAdmin.instance = new ServicesAdmin();
        }
        return ServicesAdmin.instance;
    }
    public async handlePageChange(pageNumber: number,setCurrentPage: (pageNumber: number) => void) {
        setCurrentPage(pageNumber);
    }
    public async handleBanOrUnbanUser (data:HandleBanOrUnbanUser) {
        const {userId,status,setIsConfirmOpen,setUserToBan} = data;
        setIsConfirmOpen(true);
        setUserToBan({id:userId,status});
    }
    public async handleDeleteReportHavior(postId:string,deleteReportHavior: (postId: string) => Promise<boolean>){
        const result = await deleteReportHavior(postId);
        if(result){
            toast.success("Xóa báo cáo thành công");
        }else{
            toast.error("Xóa báo cáo thất bại");
        }
    }
    public async handleConfirmBan(userToBan: { id: string; status: string }|null,banOrUnbanUser: (userId: string) => Promise<boolean>,getUsers: () => void){
        if (userToBan) {
            const result = await banOrUnbanUser(userToBan.id);
            if (result) {
              toast.success(userToBan.status === 'active' ? 'Người Dùng Đã Bị Cấm' : 'Người Dùng Đã Được Mở Khóa');
              getUsers();
            } else {
              toast.error('Thất bại');
            }
          }
    }
    public async handleChangePassword(data:HandleChangePassword){
        const {userId,username,setIsChangePasswordOpen,setSelectedUser} = data;
        setIsChangePasswordOpen(true);
        setSelectedUser({ id: userId, username, email: '', role: '', status: 'active' });  
    }
    public async handleSearchChange(e: React.ChangeEvent<HTMLInputElement>,setCurrentPage: (currentPage: number) => void,setSearchTerm: (searchTerm: string) => void){
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    }
}
export default ServicesAdmin;
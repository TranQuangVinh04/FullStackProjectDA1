import React, { useState } from 'react';

interface ReportPostProps {

    isOpen: boolean;
    onClose: () => void;    
    onReport: (reason: string, description: string,postId: string) => void;
    postId: string;
}

 const ReportPost: React.FC<ReportPostProps> = ({ isOpen, onClose, onReport, postId }) => {
    const [reason, setReason] = useState('spam');
    const [description, setDescription] = useState('');
    
    if(!isOpen) return null;
    return (
        <>
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className=" rounded-lg p-4 w-full max-w-md bg-[#242526]" data-theme="dark">
                <h2 className="text-lg font-bold mb-4">Báo cáo bài viết</h2>
                <div className="mb-4 bg-[#242526]">
                    <label htmlFor="reason" className="block mb-2">Lý do</label>
                    <select id="reason" className="w-full p-2 border rounded bg-[#242526] text-white" value={reason} onChange={(e) => setReason(e.target.value)}>
                        <option value="spam">Spam</option>
                        <option value="inappropriate">Nội dung không phù hợp</option>
                        <option value="copyright">Bản quyền</option>
                        <option value="other">Khác</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block mb-2">Mô tả</label>
                    <textarea id="description" className="w-full p-2 border rounded" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                </div>
                <div className="flex justify-end gap-2">
                <button className="btn btn-outline btn-warning px-4 py-2 rounded" onClick={() => onReport(reason, description, postId)}>Báo cáo</button>
                <button className="btn btn-outline bg-gray-500 text-white px-4 py-2 rounded" onClick={onClose}>Hủy</button>
                </div>
            </div>
        </div>
        </>
    )
}
export default ReportPost;
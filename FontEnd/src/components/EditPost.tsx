import React, { useState } from 'react';
import { X } from 'lucide-react';

interface EditPostProps {
  isOpen: boolean;
  onClose: () => void;
  post: {
    id: string;
    caption: string;
    media?: { url: string; type: "image" | "video" }[];
  };
  onSave: (updatedPost: { content: string; media?: { url: string; type: "image" | "video" }[] }) => void;
}

const EditPost: React.FC<EditPostProps> = ({ isOpen, onClose, post, onSave }) => {

  const [caption, setCaption] = useState(post.caption);

  const [images, setImages] = useState(post.media || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ content: caption, media: images });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#242526] rounded-lg w-full max-w-2xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Chỉnh sửa bài viết</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full bg-[#3a3b3c] text-white rounded-lg p-3 min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Bạn đang nghĩ gì?"
            />
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {images.map((img, index) => (
                <div key={index} className="relative group">
                  {img.type === "image" ? (
                    <img
                      src={img.url}
                      alt={`post-image-${index}`}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  ) : (
                    <video
                      src={img.url}
                      className="w-full h-40 object-cover rounded-lg"
                      controls
                      muted
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, i) => i !== index))}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost; 
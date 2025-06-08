import React, { useState, useRef, useCallback } from "react";
import { X, ImagePlus, VideoIcon } from "lucide-react";
import { useUserStore } from "../store/user.store";
import { useAuthStore } from "../store/authe.store";
import { useNavigate } from "react-router-dom";
import { Spinner } from "./ui/Spinner";

interface CreatePostDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MediaFile {
  file: File;
  preview: string;
  type: "image" | "video";
}

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
const MAX_FILES = 4;

const CreatePostDialog: React.FC<CreatePostDialogProps> = ({ isOpen, onClose }) => {
  const [content, setContent] = useState("");
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createPost } = useUserStore();        
  const { authUser } = useAuthStore();
  const navigate = useNavigate();

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File ${file.name} quá lớn. Kích thước tối đa là 25MB`;
    }

    if (file.type.startsWith('image/') && !ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return `Loại ảnh ${file.type} không được hỗ trợ. Vui lòng sử dụng JPEG, PNG, GIF hoặc WEBP`;
    }

    if (file.type.startsWith('video/') && !ALLOWED_VIDEO_TYPES.includes(file.type)) {
      return `Loại video ${file.type} không được hỗ trợ. Vui lòng sử dụng MP4, WEBM hoặc QuickTime`;
    }

    return null;
  };

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Giới hạn kích thước tối đa là 1920px
        const MAX_DIMENSION = 1920;
        if (width > height && width > MAX_DIMENSION) {
          height = (height * MAX_DIMENSION) / width;
          width = MAX_DIMENSION;
        } else if (height > MAX_DIMENSION) {
          width = (width * MAX_DIMENSION) / height;
          height = MAX_DIMENSION;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Không thể nén ảnh'));
            }
          },
          'image/jpeg',
          0.8
        );
      };
      img.onerror = () => reject(new Error('Lỗi khi tải ảnh'));
    });
  };

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setError(null);

    if (files.length + mediaFiles.length > MAX_FILES) {
      setError(`Bạn chỉ có thể tải lên tối đa ${MAX_FILES} file`);
      return;
    }

    for (const file of files) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        continue;
      }

      try {
        let processedFile = file;
        if (file.type.startsWith('image/')) {
          processedFile = await compressImage(file);
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          const type = processedFile.type.startsWith('image/') ? 'image' : 'video';
          setMediaFiles(prev => [...prev, { 
            file: processedFile,
            preview: reader.result as string,
            type
          }]);
        };
        reader.readAsDataURL(processedFile);
      } catch (err) {
        setError('Có lỗi xảy ra khi xử lý file');
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [mediaFiles.length]);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    try {
      if (!content.trim() && mediaFiles.length === 0) return;
      setIsLoading(true);
      setIsSubmitting(true);
      setError(null);

      const formData = new FormData();
      formData.append("content", content.trim());

      mediaFiles.forEach((mediaFile) => {
        formData.append("media", mediaFile.file);
      });

      const result = await createPost(formData);
      if (result) {
        setContent("");
        setMediaFiles([]);
        onClose();
        navigate(`/`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi đăng bài';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const removeMedia = useCallback((index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleClose = useCallback(() => {
    if (content.trim() || mediaFiles.length > 0) {
      if (window.confirm('Bạn có chắc muốn hủy? Nội dung bài viết sẽ bị mất.')) {
        setContent("");
        setMediaFiles([]);
        setIsSubmitting(false);
        onClose();
      }
    } else {
      setIsSubmitting(false);
      onClose();
    }
  }, [content, mediaFiles.length, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 md:p-0">
      <div 
        className="bg-[#242526] rounded-xl w-full max-w-xl animate-fade-in shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white text-center py-4">
            Tạo bài viết
          </h2>
          <button
            onClick={handleClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <img
                src={authUser?.avatar || "./imagebackround.png"}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-white">{authUser?.name}</span>
              <span className="text-sm text-gray-400">Công khai</span>
            </div>
          </div>

          {/* Content Input */}
          <div className="min-h-[150px]">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Bạn đang nghĩ gì?"
              className="w-full bg-transparent text-white resize-none outline-none min-h-[120px] text-lg placeholder-gray-400"
              disabled={isLoading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
              {error}
            </div>
          )}

          {/* Media Preview */}
          {mediaFiles.length > 0 && (
            <div className={`grid ${
              mediaFiles.length === 1 ? 'grid-cols-1' : 
              mediaFiles.length === 2 ? 'grid-cols-2' :
              'grid-cols-2'
            } gap-2 rounded-lg overflow-hidden bg-gray-800/50 p-2`}>
              {mediaFiles.map((file, index) => (
                <div key={index} className="relative group aspect-square">
                  {file.type === 'image' ? (
                    <img
                      src={file.preview}
                      alt={`upload-${index}`}
                      className="w-full h-full object-cover rounded-lg transition-transform group-hover:brightness-75"
                    />
                  ) : (
                    <video
                      src={file.preview}
                      className="w-full h-full object-cover rounded-lg transition-transform group-hover:brightness-75"
                      controls
                    />
                  )}
                  <button
                    onClick={() => removeMedia(index)}
                    className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
                    disabled={isLoading}
                  >
                    <X size={16} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload Options */}
          <div className="bg-[#323436] rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">Thêm vào bài viết</span>
              <div className="flex gap-1">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 hover:bg-white/10 rounded-lg transition-colors group relative"
                  disabled={isLoading || mediaFiles.length >= MAX_FILES}
                  title={mediaFiles.length >= MAX_FILES ? `Đã đạt giới hạn ${MAX_FILES} file` : "Thêm ảnh"}
                >
                  <ImagePlus size={22} className="text-green-500" />
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 whitespace-nowrap">
                    Ảnh
                  </span>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 hover:bg-white/10 rounded-lg transition-colors group relative"
                  disabled={isLoading || mediaFiles.length >= MAX_FILES}
                  title={mediaFiles.length >= MAX_FILES ? `Đã đạt giới hạn ${MAX_FILES} file` : "Thêm video"}
                >
                  <VideoIcon size={22} className="text-blue-500" />
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 whitespace-nowrap">
                    Video
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={(!content.trim() && mediaFiles.length === 0) || isLoading || isSubmitting}
            className={`w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
              content.trim() || mediaFiles.length > 0
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-blue-500/50 cursor-not-allowed"
            } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              <>
                <Spinner size="sm" />
                <span>Đang đăng...</span>
              </>
            ) : (
              'Đăng'
            )}
          </button>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={[...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES].join(',')}
          multiple
          className="hidden"
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

export default React.memo(CreatePostDialog); 
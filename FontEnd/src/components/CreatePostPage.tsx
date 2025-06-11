import React, { useState } from 'react'
import { useAuthStore } from '../store/authe.store'
import CreatePostDialog from './CreatePostDialog'
import { PlusCircle } from 'lucide-react'

const CreatePostPage = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-2xl text-white mb-6">Tạo bài viết của bạn</h1>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-3 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full transition-colors cursor-pointer"
      >
        <PlusCircle size={24} />
        <span className="text-lg font-medium">Tạo bài viết mới</span>
      </button>
      
      <CreatePostDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  )
}

export default CreatePostPage
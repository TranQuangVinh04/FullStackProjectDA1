import React, { useState } from 'react'
import { Search, Users, FileText } from 'lucide-react'
import { useUserStore } from '../store/user.store'
import { Link } from 'react-router-dom'
import CreatePost from './CreatePost'
import { useAuthStore } from '../store/authe.store'

type SearchType = 'users' | 'posts'

interface SearchResult {
  type: SearchType
  data: any[]

}

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState<SearchType>('users')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<SearchResult | null>(null)
  const { searchUsers, searchPosts } = useUserStore()
  const { authUser } = useAuthStore()
  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    try {
      if (searchType === 'users') {
        const users = await searchUsers(searchQuery)
        setResults({ type: 'users', data: users })
      } else {
        const posts = await searchPosts(searchQuery)
        setResults({ type: 'posts', data: posts })
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderResults = () => {
    if (!results || results.data.length === 0) {
      return (
        <div className="text-center text-gray-400 py-8 select-none">
          Không tìm thấy kết quả nào
        </div>
      )
    }

    if (results.type === 'users') {
      return (
        <div className="space-y-4">
          {results.data.map((user: any) => (
            <Link
              to={`/${user.username}`}
              key={user._id}
              className="flex items-center gap-4 p-4 bg-[#242526] rounded-lg hover:bg-[#3A3B3C] transition-colors"
            >
              <img
                src={user.profileImg || "./imagebackround.png"}
                alt={user.fullname}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="text-white font-medium">{user.fullname}</h3>
                <p className="text-gray-400">@{user.username}</p>
              </div>
            </Link>
          ))}
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {results.data.map((post: any) => (
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
      ))}
    </div>
    )
  }

  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl text-white font-semibold mb-6 select-none">Tìm kiếm</h1>
        
        {/* Search Input */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Tìm kiếm..."
              className="w-full bg-[#3A3B3C] text-white px-4 py-2.5 pl-10 rounded-lg outline-none"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <button
            onClick={handleSearch}
            disabled={isLoading || !searchQuery.trim()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Đang tìm...' : 'Tìm kiếm'}
          </button>
        </div>

        {/* Search Type Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setSearchType('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              searchType === 'users'
                ? 'bg-blue-500 text-white'
                : 'bg-[#3A3B3C] text-gray-300 hover:bg-[#4E4F50] select-none'
            }`}
          >
            <Users size={18} />
            <span className='select-none'>Người dùng</span>
          </button>
          <button
            onClick={() => setSearchType('posts')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              searchType === 'posts'
                ? 'bg-blue-500 text-white'
                : 'bg-[#3A3B3C] text-gray-300 hover:bg-[#4E4F50]'
            }`}
          >
            <FileText size={18} />
            <span className='select-none'>Bài viết</span>
          </button>
        </div>
      </div>

    
      {renderResults()}
    </div>
  )
}

export default SearchPage 
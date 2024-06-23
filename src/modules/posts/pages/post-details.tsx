import React from 'react'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import { useRouter } from 'next/router'

const inter = Inter({ subsets: ['latin'] })

interface Post {
  _id: string
  title: string
  cover: string
  description: string
  themes: Theme[]
  createdBy: CreatedBy
  coverUrl: string
  id: string
}

interface Theme {
  _id: string
  name: string
  coverUrl: string
  id: string
}

interface CreatedBy {
  _id: string
  username: string
  email: string
  id: string
}

const PostDetailPage = ({ post }: { post: Post }) => {
  const router = useRouter()

  const handleGoBack = () => {
    router.back()
  }

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
      style={{ backgroundColor: 'rgb(50, 50, 50)' }}
    >
      <div className="w-full max-w-7xl">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-white">{post.title}</h1>
          <button
            className="bg-gray-700 text-gray-300 hover:bg-gray-600 px-4 py-2 rounded-md font-bold"
            onClick={handleGoBack}
          >
            Volver
          </button>
        </div>
        <div className="mb-8">
          <Image
            src={post.coverUrl}
            alt={post.title}
            width={1280}
            height={720}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>
        <div className="mb-8">
          <p className="text-gray-300 text-lg">{post.description}</p>
        </div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Temáticas</h2>
          <div className="flex flex-wrap gap-4">
            {post.themes.map((theme) => (
              <span
                key={theme.id}
                className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm"
              >
                {theme.name}
              </span>
            ))}
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Publicado por</h2>
          <div className="flex items-center">
            <Image
              src={`https://ui-avatars.com/api/?name=${post.createdBy.username}`}
              alt={post.createdBy.username}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <h3 className="text-lg font-bold text-white">
                {post.createdBy.username}
              </h3>
              <p className="text-gray-300 text-sm">{post.createdBy.email}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default PostDetailPage

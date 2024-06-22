import React, { useState, useEffect } from 'react'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'

import { useRouter } from 'next/router'
import { fetchPosts } from '../services'
import { fetchThemes } from '@modules/themes/services'

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

const PostsPage = () => {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [themes, setThemes] = useState<Theme[]>([])

  useEffect(() => {
    const getThemes = async () => {
      const response = await fetchThemes()

      setThemes(response)
    }

    getThemes()
  }, [])

  useEffect(() => {
    const getAllPosts = async () => {
      try {
        const themeId = router?.query?.themeId

        const response = await fetchPosts(themeId)

        setPosts(response)
      } catch (error) {
        console.error('Error fetching posts:', error)
      }
    }

    if (router.isReady) {
      getAllPosts()
    }
  }, [router.query.themeId, router.isReady])

  const handleThemeFilter = (theme: any) => {
    router.push({
      pathname: '/',
      query: { themeId: theme._id },
    })
  }

  const handleClearFilter = () => {
    router.push({
      pathname: '/',
    })
  }

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
      style={{ backgroundColor: 'rgb(50, 50, 50)' }}
    >
      <div className="w-full max-w-7xl">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-white">
            {posts.length} Publicaciones
          </h1>

          <h1 className="text-xl font-bold text-white">
            {themes.length} Temáticas
          </h1>
        </div>
        <div className="mb-8">
          <div className="flex flex-wrap gap-4">
            <button
              className={`px-4 py-2 rounded-md font-bold ${
                !router?.query?.themeId
                  ? 'bg-blue-500 text-white hover:bg-blue-700'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              onClick={handleClearFilter}
            >
              Todas las temáticas
            </button>
            {themes.map((theme) => (
              <button
                key={theme?._id}
                className={`px-4 py-2 rounded-md font-bold ${
                  router?.query?.themeId === theme?._id
                    ? 'bg-blue-500 text-white hover:bg-blue-700'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                onClick={() => handleThemeFilter(theme)}
              >
                {theme.name}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:cols-3 lg:grid-cols-4 gap-8">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <Image
                src={post.coverUrl}
                alt={post.title}
                className="w-full h-48 object-cover"
                width={640}
                height={480}
              />
              <div className="p-4">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 line-clamp-4 mb-2">
                  {post.description}
                </p>
                <Link
                  href={`/posts/${post._id}`}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  Leer más
                </Link>
                <div className="flex flex-wrap gap-2 my-4">
                  {post.themes.slice(0, 3).map((theme) => (
                    <span
                      key={theme.id}
                      className="bg-blue-500 text-white px-2 py-1 rounded-md text-sm"
                    >
                      {theme.name}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">
                    Publicado por {post.createdBy.username}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default PostsPage

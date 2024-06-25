import React, { useState, useEffect, useRef } from 'react'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'

import { useRouter } from 'next/router'
import { fetchPosts } from '../services'
import { fetchThemes } from '@modules/themes/services'
import { useAuth } from '@modules/auth/context'
import { PermissionEnum, RolesEnum } from '@modules/common/enums'
import { IPost } from '../interfaces'
import { ITheme } from '@modules/themes/interfaces'

const inter = Inter({ subsets: ['latin'] })

const PostsPage = () => {
  const router = useRouter()
  const { user, logout, hasPermission, hasRole } = useAuth()

  const [posts, setPosts] = useState<IPost[]>([])
  const [themes, setThemes] = useState<ITheme[]>([])
  const [infoPosts, setInfoPosts] = useState<{
    video: number
    image: number
    text: number
  } | null>(null)

  const searchInputRef = useRef<HTMLInputElement>(null)

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
        const themeId = router?.query?.themeId as unknown as string
        const search = router?.query?.search as unknown as string

        const response = await fetchPosts({ themeId, search })

        if (searchInputRef.current && search) {
          searchInputRef.current.value = search
        }

        setPosts(response.posts)
        setInfoPosts(response.infoPosts)
      } catch (error) {
        console.error('Error fetching posts:', error)
      }
    }

    if (router.isReady) {
      getAllPosts()
    }
  }, [router.query.themeId, router.query.search, router.isReady])

  const handleThemeFilter = (theme: any) => {
    if (String(theme._id) === router.query.themeId) {
      delete router.query.themeId

      router.push({
        pathname: '/',
        query: {
          ...router.query,
        },
      })

      return
    }

    router.push({
      pathname: '/',
      query: {
        ...router.query,
        themeId: theme._id,
      },
    })
  }

  const handleClearFilter = () => {
    delete router.query.themeId

    router.push({
      pathname: '/',
      query: {
        ...router.query,
      },
    })
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target

    if (Boolean(value)) {
      const query = { ...router.query, search: value }

      router.push({
        pathname: '/',
        query,
      })
    } else {
      delete router.query.search

      router.push({
        pathname: '/',
        query: { ...router.query },
      })
    }
  }

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
      style={{ backgroundColor: 'rgb(50, 50, 50)' }}
    >
      <div className="w-full max-w-7xl">
        <div className={`mb-8  ${user ? '' : 'flex justify-end'} items-center`}>
          {user ? (
            <div className="flex justify-between items-center">
              <div className="">
                {hasRole(RolesEnum.ADMIN) && (
                  <Link
                    href="/themes/create"
                    className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-700 rounded-md "
                  >
                    Crear temática
                  </Link>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-white">Usuario: {user.username}</span>

                {hasPermission([PermissionEnum.C]) && (
                  <Link
                    href="/posts/create"
                    className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-700 rounded-md "
                  >
                    Crear Publicación
                  </Link>
                )}

                <button
                  onClick={logout}
                  className="bg-gray-600 text-gray-300 hover:bg-gray-500 px-4 py-2 rounded-md font-bold"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                href="/sign-in"
                className="px-4 py-2 bg-gray-500 text-white hover:bg-gray-700 rounded-md "
              >
                Iniciar sesión
              </Link>
            </div>
          )}
        </div>
        <div className="mb-8 flex justify-end items-center space-x-4">
          <span className="text-2xl font-bold text-white">
            {infoPosts?.text} {infoPosts?.text === 1 ? 'Texto' : 'Textos'}
          </span>
          <span className="text-2xl font-bold text-white">
            {infoPosts?.image} {infoPosts?.image === 1 ? 'Imagen' : 'Imagenes'}
          </span>
          <span className="text-2xl font-bold text-white">
            {infoPosts?.video} {infoPosts?.video === 1 ? 'Video' : 'Videos'}
          </span>
        </div>
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-white">
            {posts.length} Publicaciones
          </h1>
          <div className="flex flex-1 items-center">
            <input
              type="text"
              placeholder="Buscar por título"
              className="w-full mx-8 px-4 py-2 rounded-md bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleSearch}
              ref={searchInputRef}
            />
          </div>

          <h1 className="text-2xl font-bold text-white">
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

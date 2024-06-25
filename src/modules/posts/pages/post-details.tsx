import React, { useCallback, useEffect, useState } from 'react'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import { useRouter } from 'next/router'

import { TypeContentEnum } from '@modules/common/enums'
import { getEmbeddedYouTubeURL, setRedirectCache } from '@modules/common/utils'
import { IPost } from '../interfaces'
import { useAuth } from '@modules/auth/context'

const inter = Inter({ subsets: ['latin'] })

const PostDetailPage = ({ post }: { post: IPost }) => {
  const { back, push } = useRouter()
  const { user, hasPermission } = useAuth()
  const [contentTxt, setContentTxt] = useState('')

  useEffect(() => {
    const fetchTextFileContent = async () => {
      try {
        const contentTxt = post.contentUrl.find(
          (content) => content.typeContent === TypeContentEnum.TEXT
        )

        if (!contentTxt?.value) {
          return
        }

        const response = await fetch(contentTxt?.value)
        const text = await response.text()

        setContentTxt(text)
      } catch (error) {
        console.error('Error al cargar el archivo txt:', error)
      }
    }

    fetchTextFileContent()
  }, [post.contentUrl])

  const handleGoBack = () => {
    back()
  }

  const goToSignIn = useCallback(() => {
    setRedirectCache(`/posts/${post._id}`)

    push('/sign-in')
  }, [post._id, push])

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

        {user && hasPermission(['R']) ? (
          post.contentUrl.map((content) => {
            if (content.typeContent === TypeContentEnum.VIDEO) {
              return (
                <iframe
                  key={content.typeContent}
                  src={getEmbeddedYouTubeURL(content.value)}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  className="w-full h-[400px]"
                  allowFullScreen
                ></iframe>
              )
            }

            if (content.typeContent === TypeContentEnum.IMAGE) {
              return (
                <Image
                  key={content.typeContent}
                  src={content.value}
                  alt={content.typeContent}
                  width={1280}
                  height={720}
                  className="w-full h-96 object-cover rounded-lg my-4"
                />
              )
            }

            if (content.typeContent === TypeContentEnum.TEXT) {
              return (
                <pre
                  key={content.typeContent}
                  className="bg-gray-400 text-wrap my-4 p-4"
                >
                  {contentTxt}
                </pre>
              )
            }

            return null
          })
        ) : (
          <div className="items-center space-x-4 my-10">
            <span>Hay contenido privado, para acceder a él debes</span>
            <button
              className="px-4 py-2 bg-gray-500 text-white hover:bg-gray-700 rounded-md"
              onClick={goToSignIn}
            >
              Iniciar sesión
            </button>
          </div>
        )}

        <div className="my-8">
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

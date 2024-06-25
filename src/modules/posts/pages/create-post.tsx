import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Inter } from 'next/font/google'
import { useRouter } from 'next/router'
import { useAuth } from '@modules/auth/context'
import { fetchThemes } from '@modules/themes/services'
import { createPostService } from '../services/createPost'
import { ICreatePost } from '../interfaces'
import { ITheme } from '@modules/themes/interfaces'
import { createPostValidationSchema } from '../utils'

const inter = Inter({ subsets: ['latin'] })

const CreatePostPage = () => {
  const router = useRouter()
  const { hasPermission } = useAuth()

  const [themes, setThemes] = useState<ITheme[]>([])
  const [selectedThemes, setSelectedThemes] = useState<ITheme[]>([])
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [typeContentState, setTypeContentState] = useState<string[]>([])
  const [serverError, setServerError] = useState('')
  const [videoContent, setVideoContent] = useState<string>('')
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [textFiles, setTextFiles] = useState<File[]>([])

  useEffect(() => {
    const getThemes = async () => {
      const response = await fetchThemes()
      setThemes(response)
    }

    getThemes()
  }, [])

  useEffect(() => {
    const typeContentSet = new Set<string>()

    for (const theme of selectedThemes) {
      const typeContent = theme.category.typeContent

      typeContentSet.add(typeContent.toLocaleLowerCase())
    }

    const typeContent = Array.from(typeContentSet)

    setTypeContentState(typeContent)
  }, [selectedThemes])

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ICreatePost>({
    resolver: yupResolver(createPostValidationSchema),
  })

  const onSubmit = async (data: ICreatePost) => {
    try {
      setIsSubmitting(true)

      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('description', data.description)
      selectedThemes.forEach((theme) => formData.append('themes', theme._id))
      formData.append('cover', coverImage as Blob)

      if (videoContent) {
        formData.append('content', videoContent)
      }

      if (imageFiles.length > 0) {
        imageFiles.forEach((file) => {
          formData.append('contentFiles', file)
        })
      }

      if (textFiles.length > 0) {
        textFiles.forEach((file) => {
          formData.append('contentFiles', file)
        })
      }

      await createPostService(formData)

      setServerError('')

      router.push('/')
    } catch (err: any) {
      console.error('Error creating post:', err)
      setServerError(err?.error?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleThemeSelect = (theme: ITheme) => {
    if (selectedThemes.find((item) => item._id === theme._id)) {
      setSelectedThemes(selectedThemes.filter((item) => item._id !== theme._id))
    } else {
      setSelectedThemes([...selectedThemes, theme])
    }
  }

  const handleCoverImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    setCoverImage(file || null)
  }

  const handleGoBack = () => {
    router.back()
  }

  if (!hasPermission(['C'])) {
    router.replace('/401')
    return null
  }

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
      style={{ backgroundColor: 'rgb(50, 50, 50)' }}
    >
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Crear nueva publicación
        </h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              htmlFor="cover"
              className="block text-gray-700 font-bold mb-2"
            >
              Imagen de portada
            </label>
            <input
              type="file"
              id="cover"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.cover ? 'border-red-500' : ''
              }`}
              {...register('cover')}
              onChange={handleCoverImageChange}
            />

            {errors?.cover?.message && (
              <p className="text-red-500 text-xs italic">
                {errors.cover.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-gray-700 font-bold mb-2"
            >
              Título
            </label>
            <input
              type="text"
              id="title"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.title ? 'border-red-500' : ''
              }`}
              placeholder="Ingresa el título de la publicación"
              {...register('title')}
            />
            {errors.title && (
              <p className="text-red-500 text-xs italic">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-gray-700 font-bold mb-2"
            >
              Descripción
            </label>
            <textarea
              id="description"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.description ? 'border-red-500' : ''
              }`}
              placeholder="Ingresa la descripción de la publicación"
              {...register('description')}
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-xs italic">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="themes"
              className="block text-gray-700 font-bold mb-2"
            >
              Temas
            </label>
            <div className="flex flex-wrap gap-2">
              {themes.map((theme) => (
                <button
                  key={theme._id}
                  type="button"
                  className={`px-4 py-2 rounded-md font-bold ${
                    selectedThemes.find((item) => item._id === theme._id)
                      ? 'bg-blue-500 text-white hover:bg-blue-700'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  onClick={() => handleThemeSelect(theme)}
                >
                  {theme.name}
                </button>
              ))}
            </div>
            {errors.themes && (
              <p className="text-red-500 text-xs italic">
                {errors.themes.message}
              </p>
            )}
          </div>

          {typeContentState.includes('video') && (
            <div className="mb-4">
              <label
                htmlFor="content"
                className="block text-gray-700 font-bold mb-2"
              >
                Contenido (Video)
              </label>
              <input
                type="text"
                id="content"
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.content ? 'border-red-500' : ''
                }`}
                placeholder="Ingresa el contenido (video)"
                {...register('content')}
                value={videoContent}
                onChange={(e) => setVideoContent(e.target.value)}
              />
              {errors.content && (
                <p className="text-red-500 text-xs italic">
                  {errors.content.message}
                </p>
              )}
            </div>
          )}

          {(typeContentState.includes('image') ||
            typeContentState.includes('text')) && (
            <div className="mb-4">
              <label
                htmlFor="contentFiles"
                className="block text-gray-700 font-bold mb-2"
              >
                Contenido (Imagen/Texto)
              </label>
              <div className="flex space-x-4">
                {typeContentState.includes('image') && (
                  <div className="flex-1">
                    <input
                      type="file"
                      className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                        errors.contentFiles ? 'border-red-500' : ''
                      }`}
                      {...register('contentFiles')}
                      onChange={(e) =>
                        setImageFiles(Array.from(e.target.files || []))
                      }
                    />
                    {errors.contentFiles && (
                      <p className="text-red-500 text-xs italic">
                        {errors.contentFiles.message}
                      </p>
                    )}
                  </div>
                )}
                {typeContentState.includes('text') && (
                  <div className="flex-1">
                    <input
                      type="file"
                      accept=".txt"
                      className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                        errors.contentFiles ? 'border-red-500' : ''
                      }`}
                      {...register('contentFiles')}
                      onChange={(e) =>
                        setTextFiles(Array.from(e.target.files || []))
                      }
                    />
                    {errors.contentFiles && (
                      <p className="text-red-500 text-xs italic">
                        {errors.contentFiles.message}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {serverError && (
            <div className="mb-4 mt-4 text-red-500 text-xs italic">
              {serverError}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="submit"
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                !isValid || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={!isValid || isSubmitting}
            >
              Crear Publicación
            </button>
            <button
              type="button"
              className="bg-gray-700 text-gray-300 hover:bg-gray-600 px-4 py-2 rounded-md font-bold"
              onClick={handleGoBack}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}

export default CreatePostPage

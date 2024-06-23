import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { makeRequest } from '@modules/common/utils'
import { useAuth } from '@modules/auth/context'
import { fetchThemes } from '@modules/themes/services'
import { createPostService } from '../services/createPost'

const inter = Inter({ subsets: ['latin'] })

interface Post {
  title: string
  description: string
  themes: Array<string> // id de los themes a los que el post esta relacionado
  cover: any // este es un archivo de imagen que se adjunta y lo recibe el backend
}

interface Theme {
  _id: string
  name: string
  cover: string
  description: string
  categories: any[]
  createdBy?: string
  createdAt?: string
  updatedAt?: string
  __v: number
  coverUrl: string
  id: string
}

const CreatePostPage = () => {
  const { user } = useAuth()
  const router = useRouter()

  const [themes, setThemes] = useState<Theme[]>([])
  const [selectedThemes, setSelectedThemes] = useState<string[]>([])
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  useEffect(() => {
    const getThemes = async () => {
      const response = await fetchThemes()
      setThemes(response)
    }

    getThemes()
  }, [])

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('El título es obligatorio'),
    description: Yup.string().required('La descripción es obligatoria'),
    themes: Yup.array()
      .of(Yup.string())
      .min(1, 'Debes seleccionar al menos un tema'),
    cover: Yup.mixed().required('Debes seleccionar una imagen de portada'),
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Post>({
    resolver: yupResolver(validationSchema),
  })

  const onSubmit = async (data: Post) => {
    console.log({ data, selectedThemes })

    // return data
    try {
      setIsSubmitting(true)

      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('description', data.description)
      selectedThemes.forEach((theme) => formData.append('themes', theme))
      formData.append('cover', coverImage as Blob)

      // await makeRequest({
      //   method: 'POST',
      //   url: 'api/v1/posts',
      //   data: formData,
      // })
      await createPostService(formData)

      router.push('/')
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleThemeSelect = (theme: Theme) => {
    if (selectedThemes.includes(theme._id)) {
      setSelectedThemes(selectedThemes.filter((t) => t !== theme._id))
    } else {
      setSelectedThemes([...selectedThemes, theme._id])
    }
  }

  const handleCoverImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    setCoverImage(file || null)
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

          <div className="mb-4">
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
                    selectedThemes.includes(theme._id)
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

            {errors.cover && (
              <p className="text-red-500 text-xs italic">
                {errors.cover.message}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                !isValid || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={!isValid || isSubmitting}
            >
              Crear Publicación
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}

export default CreatePostPage

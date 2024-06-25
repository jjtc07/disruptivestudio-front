import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { Inter } from 'next/font/google'
import { useAuth } from '@modules/auth/context'
import { ITheme } from '../interfaces'
import { ICategory } from '@modules/categories/interfaces'
import { fetchCategories } from '@modules/categories/services'
import { createThemeService } from '../services'
import { RolesEnum } from '@modules/common/enums'
import { useRouter } from 'next/router'

const inter = Inter({ subsets: ['latin'] })

const CreateThemePage = () => {
  const router = useRouter()

  const { hasRole, user } = useAuth()

  const [categories, setCategories] = useState<ICategory[]>([])
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [serverError, setServerError] = useState('')

  useEffect(() => {
    const getCategories = async () => {
      const response = await fetchCategories()
      setCategories(response)
    }

    getCategories()
  }, [])

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es obligatorio'),
    description: Yup.string().required('La descripción es obligatoria'),
    category: Yup.string().required('Debes seleccionar una categoría'),
    cover: Yup.mixed().required('Debes seleccionar una imagen de portada'),
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ITheme>({
    resolver: yupResolver(validationSchema),
  })

  const onSubmit = async (data: ITheme) => {
    try {
      setIsSubmitting(true)

      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('description', data.description)
      formData.append('category', data.category)
      formData.append('cover', coverImage as Blob)

      await createThemeService(formData)

      setServerError('')

      router.push('/')
    } catch (err: any) {
      console.error('Error creating theme:', err)
      setServerError(err?.error?.message)
    } finally {
      setIsSubmitting(false)
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

  if (user && !hasRole(RolesEnum.ADMIN)) {
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
          Crear nuevo tema
        </h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 font-bold mb-2"
            >
              Nombre
            </label>
            <input
              type="text"
              id="name"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.name ? 'border-red-500' : ''
              }`}
              placeholder="Ingresa el nombre del tema"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-red-500 text-xs italic">
                {errors.name.message}
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
              placeholder="Ingresa la descripción del tema"
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
              htmlFor="category"
              className="block text-gray-700 font-bold mb-2"
            >
              Categoría
            </label>
            <select
              id="category"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.category ? 'border-red-500' : ''
              }`}
              {...register('category')}
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-xs italic">
                {errors.category.message}
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
            {errors?.cover?.message && (
              <p className="text-red-500 text-xs italic">
                {errors.cover.message}
              </p>
            )}
          </div>

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
              Crear Tema
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

export default CreateThemePage

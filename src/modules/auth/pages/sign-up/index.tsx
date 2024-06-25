import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Inter } from 'next/font/google'
import { makeRequest } from '@modules/common/utils'
import { useRouter } from 'next/navigation'
import { useAuth } from '@modules/auth/context'
import { signUpValidationSchema } from '@modules/auth/utils'

const inter = Inter({ subsets: ['latin'] })

const SignUpPage = () => {
  const router = useRouter()
  const { user } = useAuth()

  const [roles, setRoles] = useState<any[]>([])
  const [serverError, setServerError] = useState('')

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await makeRequest({
          method: 'GET',
          url: 'roles',
        })

        setRoles(response.data)
      } catch (error) {
        console.error('Error al obtener los roles:', error)
      }
    }
    fetchRoles()
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(signUpValidationSchema),
    mode: 'all',
  })

  const onSubmit = async (data: any) => {
    try {
      await makeRequest({
        method: 'POST',
        url: 'auth/sign-up',
        data,
      })

      setServerError('')

      router.push('/sign-in')
    } catch (err: any) {
      setServerError(err?.error?.message)
    }
  }

  if (user) {
    router.replace('/')
    return null
  }

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Registro</h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="username"
            >
              Nombre de usuario
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.username ? 'border-red-500' : ''
              }`}
              id="username"
              type="text"
              placeholder="Ingresa tu nombre de usuario"
              {...register('username')}
            />
            {errors.username && (
              <p className="text-red-500 text-xs italic">
                {errors.username.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="email"
            >
              Correo electrónico
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.email ? 'border-red-500' : ''
              }`}
              id="email"
              type="email"
              placeholder="Ingresa tu correo electrónico"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-red-500 text-xs italic">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="password"
            >
              Contraseña
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${
                errors.password ? 'border-red-500' : ''
              }`}
              id="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-red-500 text-xs italic">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="confirmPassword"
            >
              Confirmar contraseña
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${
                errors.confirmPassword ? 'border-red-500' : ''
              }`}
              id="confirmPassword"
              type="password"
              placeholder="Confirma tu contraseña"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs italic">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="role"
            >
              Rol
            </label>
            <select
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${
                errors.role ? 'border-red-500' : ''
              }`}
              id="role"
              {...register('role')}
            >
              <option value="">Selecciona un rol</option>
              {roles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.name}
                </option>
              ))}
            </select>
            {errors.role && (
              <p className="text-red-500 text-xs italic">
                {errors.role.message}
              </p>
            )}
          </div>
          {serverError && (
            <div className="mb-4 text-red-500 text-xs italic">
              {serverError}
            </div>
          )}
          <div className="flex items-center justify-between">
            <button
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                !isValid ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              type="submit"
              disabled={!isValid}
            >
              Registrarse
            </button>
            <a
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              href="/login"
            >
              ¿Ya tienes una cuenta? Inicia sesión
            </a>
          </div>
        </form>
      </div>
    </main>
  )
}

export default SignUpPage

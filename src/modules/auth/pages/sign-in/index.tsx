import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { makeRequest } from '@modules/common/utils'
import { useAuth } from '@modules/auth/context'

const inter = Inter({ subsets: ['latin'] })

const SignInPage = () => {
  const { login } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required('El correo electrónico es obligatorio')
      .email('El correo electrónico no es válido'),
    password: Yup.string()
      .required('La contraseña es obligatoria')
      .min(5, 'La contraseña debe tener al menos 5 caracteres'),
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(validationSchema),
  })

  const onSubmit = async (data: any) => {
    try {
      const response = await makeRequest({
        method: 'POST',
        url: 'auth/sign-in',
        data,
      })

      login(response.data)

      setServerError('')
    } catch (err: any) {
      setServerError(err?.error?.message)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Iniciar sesión</h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
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
          <div className="mb-6 relative">
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
              type={showPassword ? 'text' : 'password'}
              placeholder="Ingresa tu contraseña"
              {...register('password')}
            />
            <div
              className="absolute top-[52px] transform -translate-y-1/2 right-3 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <FaEyeSlash className="text-gray-600" />
              ) : (
                <FaEye className="text-gray-600" />
              )}
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs italic">
                {errors.password.message}
              </p>
            )}
          </div>
          {serverError && (
            <div className="mb-4 -mt-4 text-red-500 text-xs italic">
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
              Iniciar sesión
            </button>
            <Link
              href={'/sign-up'}
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            >
              Crear nueva cuenta
            </Link>
          </div>
        </form>
      </div>
    </main>
  )
}

export default SignInPage

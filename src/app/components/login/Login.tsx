'use client'

import api from '@/api/api'
import { LoginFormData, validateLoginForm } from '@/schemas/UserSchema'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface LoginProps {
  children: React.ReactNode
}

export default function Login({ children }: LoginProps) {
  const router = useRouter()
  const [register, setRegister] = useState(false)
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [submissionError, setSubmissionError] = useState('')

  function handleRegister() {
    setRegister(true)
  }

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmissionError('')

    // Validate form using Zod schema
    const validationResult = validateLoginForm(formData)

    if (!validationResult.success) {
      // Convert Zod errors to a more usable format
      const fieldErrors: Record<string, string> = {}
      validationResult.error.errors.forEach((error) => {
        if (error.path[0]) {
          fieldErrors[error.path[0] as string] = error.message
        }
      })

      setErrors(fieldErrors)
      return
    }

    // Clear any previous errors
    setErrors({})

    try {
      setLoading(true)

      // Call the login endpoint
      const response = await api.post('/user/login', formData)

      console.log('Login successful:', response.data)

      // Store the token in a cookie
      if (response.data.token) {
        Cookies.set('accessToken', response.data.token, { expires: 1 })
      }

      // Redirect to dashboard/home page after successful login
      router.push('/')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Login error:', err)

      // Handle error responses from the API
      if (err.response?.data?.error) {
        setSubmissionError(err.response.data.error)
      } else if (err.response?.data?.details) {
        // Handle Zod validation errors from backend
        setSubmissionError(
          err.response.data.details[0]?.message || 'Erro de validação',
        )
      } else {
        setSubmissionError('Email ou senha inválidos')
      }
    } finally {
      setLoading(false)
    }
  }

  return register ? (
    children
  ) : (
    <div className="flex min-h-screen items-center justify-center px-4 py-6 sm:px-0 sm:py-0">
      <div className="flex flex-col items-center w-full max-w-sm">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">
          Faça seu login
        </h1>

        {submissionError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded w-full">
            {submissionError}
          </div>
        )}

        <div className="w-full sm:w-sm h-auto sm:h-sm">
          <form
            className="space-y-3 sm:space-y-4 bg-white p-4 sm:p-6 rounded-md shadow-md"
            onSubmit={handleSubmit}
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email
              </label>
              <div className="mt-1 sm:mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full rounded-md border-0 px-3 sm:px-4 py-1.5 sm:py-2 text-gray-900 shadow-sm ring-1 ring-inset ${
                    errors.email ? 'ring-red-500' : 'ring-gray-300'
                  } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm sm:text-sm sm:leading-6`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Senha
              </label>
              <div className="mt-1 sm:mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full rounded-md border-0 px-3 sm:px-4 py-1.5 sm:py-2 text-gray-900 shadow-sm ring-1 ring-inset ${
                    errors.password ? 'ring-red-500' : 'ring-gray-300'
                  } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm sm:text-sm sm:leading-6`}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-2 sm:mt-0 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="mt-6 sm:mt-10 text-center text-xs sm:text-sm text-gray-500">
            Não possui uma conta?{' '}
            <button
              onClick={handleRegister}
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              cadastre-se
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

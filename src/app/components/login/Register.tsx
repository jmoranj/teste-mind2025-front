'use client'
import api from '@/api/api'
import { RegisterFormData, validateRegisterForm } from '@/schemas/UserSchema'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Register() {
  const router = useRouter()
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [submissionError, setSubmissionError] = useState('')

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
    const validationResult = validateRegisterForm(formData)

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

      // Call the register endpoint (omit confirmPassword)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...registrationData } = formData
      const response = await api.post('/user/register', registrationData)

      console.log('Registration successful:', response.data)

      // Redirect to home page after successful registration
      router.push('/')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Registration error:', err)

      // Handle error responses from the API
      if (err.response?.data?.error) {
        setSubmissionError(err.response.data.error)
      } else if (err.response?.data?.details) {
        // Handle Zod validation errors from backend
        setSubmissionError(
          err.response.data.details[0]?.message || 'Erro de validação',
        )
      } else {
        setSubmissionError('Ocorreu um erro durante o registro')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0d132b] px-4 py-6 sm:px-0 sm:py-0">
      <div className="w-full max-w-sm sm:max-w-lg bg-white rounded-lg shadow-md px-4 sm:px-8 py-6 sm:py-10">
        <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-5 sm:mb-8">
          Crie sua conta
        </h1>

        {submissionError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {submissionError}
          </div>
        )}

        <form
          className="w-full flex flex-col gap-3 sm:gap-4"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-900">
              Nome completo
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 sm:px-4 py-1.5 sm:py-2 rounded-md border-0 ring-1 ring-inset ${
                errors.name ? 'ring-red-500' : 'ring-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-gray-900`}
              placeholder="Digite seu nome"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-900">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 sm:px-4 py-1.5 sm:py-2 rounded-md border-0 ring-1 ring-inset ${
                errors.email ? 'ring-red-500' : 'ring-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-gray-900`}
              placeholder="exemplo@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-900">Senha</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 sm:px-4 py-1.5 sm:py-2 rounded-md border-0 ring-1 ring-inset ${
                errors.password ? 'ring-red-500' : 'ring-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-gray-900`}
              placeholder="********"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-900">
              Confirme sua senha
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-3 sm:px-4 py-1.5 sm:py-2 rounded-md border-0 ring-1 ring-inset ${
                errors.confirmPassword ? 'ring-red-500' : 'ring-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-gray-900`}
              placeholder="********"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-1.5 sm:py-2 px-3 sm:px-4 rounded-md shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 mt-2 sm:mt-4"
            disabled={loading}
          >
            {loading ? 'Enviando...' : 'Enviar'}
          </button>
        </form>

        <div className="mt-5 sm:mt-6 text-center">
          <span className="text-xs sm:text-sm text-gray-500">
            Já possui uma conta?{' '}
          </span>
          <a
            href="/login"
            className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Faça login
          </a>
        </div>
      </div>
    </div>
  )
}

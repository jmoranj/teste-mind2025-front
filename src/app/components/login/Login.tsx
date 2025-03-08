'use client'

import { useState } from 'react'
interface LoginProps {
  children: React.ReactNode
}
export default function Login({ children }: LoginProps) {
  const [register, setRegister] = useState(false)

  function handleregister() {
    setRegister(true)
  }

  return register ? (
    children
  ) : (
    <div className="flex min-h-screen items-center justify-center px-4 py-6 sm:px-0 sm:py-0">
      <div className="flex flex-col items-center w-full max-w-sm">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">
          Faça seu login
        </h1>
        <div className="w-full sm:w-sm h-auto sm:h-sm">
          <form className="space-y-3 sm:space-y-4 bg-white p-4 sm:p-6 rounded-md shadow-md">
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
                  type="email"
                  autoComplete="email"
                  className="block w-full rounded-md border-0 px-3 sm:px-4 py-1.5 sm:py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm sm:text-sm sm:leading-6"
                />
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
                  type="password"
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 px-3 sm:px-4 py-1.5 sm:py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-2 sm:mt-0"
            >
              Entrar
            </button>
          </form>

          <p className="mt-6 sm:mt-10 text-center text-xs sm:text-sm text-gray-500">
            Não possui uma conta?{' '}
            <button
              onClick={handleregister}
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

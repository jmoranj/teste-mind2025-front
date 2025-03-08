export default function Register() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0d132b] px-4 py-6 sm:px-0 sm:py-0">
      <div className="w-full max-w-sm sm:max-w-lg bg-white rounded-lg shadow-md px-4 sm:px-8 py-6 sm:py-10">
        <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-5 sm:mb-8">
          Crie sua conta
        </h1>
        <form className="w-full flex flex-col gap-3 sm:gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-900">
              Nome completo
            </label>
            <input
              type="text"
              className="w-full px-3 sm:px-4 py-1.5 sm:py-2 rounded-md border-0 ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-gray-900"
              placeholder="Digite seu nome"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-900">Email</label>
            <input
              type="email"
              className="w-full px-3 sm:px-4 py-1.5 sm:py-2 rounded-md border-0 ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-gray-900"
              placeholder="exemplo@email.com"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-900">Senha</label>
            <input
              type="password"
              className="w-full px-3 sm:px-4 py-1.5 sm:py-2 rounded-md border-0 ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-gray-900"
              placeholder="********"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-900">
              Confirme sua senha
            </label>
            <input
              type="password"
              className="w-full px-3 sm:px-4 py-1.5 sm:py-2 rounded-md border-0 ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-gray-900"
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-1.5 sm:py-2 px-3 sm:px-4 rounded-md shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 mt-2 sm:mt-4"
          >
            Enviar
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

'use client'

import { useState } from 'react'
import AddProducts from '../products/AddProducts'

export default function TransactionsContainer() {
  const [openModal, setOpenModal] = useState(false)

  function handleModalOpen() {
    setOpenModal(true)
  }

  function handleModalClose() {
    setOpenModal(false)
  }

  return (
    <>
      <div className="container mx-auto mt-6 bg-#0d132b rounded-lg py-6 px-4 sm:px-6 sm:flex sm:items-center sm:justify-between sm:space-x-6 lg:space-x-8 border-1">
        <dl className="divide-y divide-gray-200 space-y-6 text-sm text-white flex-auto sm:divide-y-0 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-x-6 lg:w-1/2 lg:flex-none lg:gap-x-8">
          <div className="flex justify-between sm:block">
            <dt className="font-bold">Último registro</dt>
            <dd className="sm:mt-1">20/02/2025</dd>
          </div>
          <div className="flex justify-between pt-6 font-medium sm:block sm:pt-0">
            <dt className="font-bold">Faturamento</dt>
            <dd>400000,00</dd>
          </div>
        </dl>
        <button
          onClick={handleModalOpen}
          className="w-full flex items-center justify-center bg-white mt-6 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:mt-0"
        >
          Adicionar novo produto
        </button>
      </div>
      <AddProducts isOpen={openModal} onClose={handleModalClose} />
    </>
  )
}

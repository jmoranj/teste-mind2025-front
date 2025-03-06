'use client'

import { useState } from 'react'
import Modal from './Modal'

export default function ProductsContainer() {
  const [OpenModal, setOpenModal] = useState(false)
  type Product = {
    id: number
    image: string
    name: string
    quantity: number
    price: number
  }

  const mockedProducts: Product[] = [
    {
      id: 1,
      image: 'um',
      name: 'playstation',
      quantity: 2,
      price: 23,
    },
    {
      id: 2,
      image: 'um',
      name: 'playstation',
      quantity: 2,
      price: 23,
    },
    {
      id: 3,
      image: 'um',
      name: 'playstation',
      quantity: 2,
      price: 23,
    },
  ]

  return (
    <div className="text-white">
      <div className="container mx-auto px-4 py-8">
        <section aria-labelledby="recent-heading" className="mt-16">
          <div className="space-y-20">
            <div className="sm:hidden">
              <div className="mb-4 p-4 border rounded-lg shadow">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-white">Transactions</h3>
                      <button className="text-blue-500 hover:text-blue-700">
                        Editar
                      </button>
                    </div>
                    <div className="font-medium"></div>
                    <div className="text-sm text-gray-500 mt-1">
                      Quantidade:
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead className="text-sm text-amber-50 text-left">
                  <tr>
                    <th scope="col" className="w-32 px-4 py-3 font-normal">
                      Imagem
                    </th>
                    <th
                      scope="col"
                      className="w-2/5 lg:w-1/3 px-4 py-3 font-normal"
                    >
                      Produto
                    </th>
                    <th
                      scope="col"
                      className="w-1/5 px-4 py-3 font-normal text-center"
                    >
                      Quantidade
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 font-normal text-center"
                    >
                      Valor Unidade
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 font-normal text-center"
                    >
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="border-b border-amber-50 divide-y divide-amber-50 text-sm border-t">
                  {mockedProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="px-4 py-4">
                        <div className="w-16 h-16 min-w-[4rem]">
                          {product.image}
                        </div>
                      </td>
                      <td className="px-4 py- 4">
                        <div className="font-medium text-gray-900">
                          {product.name}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {product.quantity}
                      </td>
                      <td className={`px-4 py-4 text-center`}>
                        {product.price}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          className="text-blue-500 hover:text-blue-700 inline-flex items-center justify-center"
                          onClick={() => setOpenModal(true)}
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
      {OpenModal && <Modal closeModal={setOpenModal} />}
    </div>
  )
}

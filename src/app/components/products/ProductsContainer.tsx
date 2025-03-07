'use client'

import Product from '@/app/schemas/ProductsSchemas'
import { useState } from 'react'
import UpdateProducts from './UpdateProduct'

export default function ProductsContainer() {
  const [openModal, setOpenModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'playstation',
      description: 'string',
      quantity: 2,
      image: new Blob(['mock image content'], { type: 'image/jpeg' }),
      price: 23,
    },
    {
      id: 2,
      name: 'playstation',
      description: 'string',
      quantity: 2,
      image: new Blob(['mock image content'], { type: 'image/jpeg' }),
      price: 23,
    },
    {
      id: 3,
      name: 'playstation',
      description: 'string',
      quantity: 2,
      image: new Blob(['mock image content'], { type: 'image/jpeg' }),
      price: 23,
    },
  ])

  const handleSelectedProduct = (product: Product) => {
    setSelectedProduct(product)
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setSelectedProduct(null)
  }

  const deleteOnClick = (productId: number) => {
    const newProducts = products.filter((product) => product.id !== productId)
    setProducts(newProducts)
  }

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
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-4 py-4">
                        <div className="w-16 h-16 min-w-[4rem]"> </div>
                      </td>
                      <td className="px-4 py- 4">
                        <div className="font-medium ">{product.name}</div>
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
                          onClick={() => handleSelectedProduct(product)}
                        >
                          Editar
                        </button>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          className="text-grey-500 hover:text-red-700 inline-flex items-center justify-center"
                          onClick={() => deleteOnClick(product.id)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-trash-2"
                          >
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            <line x1="10" x2="10" y1="11" y2="17" />
                            <line x1="14" x2="14" y1="11" y2="17" />
                          </svg>
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
      <UpdateProducts
        item={selectedProduct}
        isOpen={openModal}
        onClose={handleCloseModal}
      />
    </div>
  )
}

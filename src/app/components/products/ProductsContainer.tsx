'use client'

import Cookies from 'js-cookie'

import api from '@/api/api'
import { ProductResponse } from '@/schemas/ProductsSchemas'
import { useEffect, useState } from 'react'
import AddProducts from './AddProducts'
import UpdateProducts from './UpdateProduct'

export default function ProductsContainer() {
  const [openAddModal, setOpenAddModal] = useState(false)
  const [openUpdateModal, setOpenUpdateModal] = useState(false)
  const [selectedProduct, setSelectedProduct] =
    useState<ProductResponse | null>(null)
  const [products, setProducts] = useState<ProductResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError('')

      // Get current user ID from the JWT token
      let userId = ''

      try {
        // Get userId from token
        const token = Cookies.get('accessToken')
        if (token) {
          // Decode JWT to get user ID
          const base64Url = token.split('.')[1]
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
          const decodedToken = JSON.parse(window.atob(base64))
          userId = decodedToken.userId // assuming your token has userId property
        }
      } catch (error) {
        console.error('Error getting user ID:', error)
        setError('Failed to authenticate user')
        setLoading(false)
        return
      }

      // Make API call with userId
      const response = await api.get(`/product/${userId}`)
      setProducts(response.data)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Error fetching products:', err)
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  // Load products when component mounts
  useEffect(() => {
    fetchProducts()
  }, [])

  const handleProductAdded = () => {
    fetchProducts() // Refresh products list
  }

  const handleProductUpdated = () => {
    fetchProducts() // Refresh products list
  }

  // Handle product selection for update
  const handleSelectedProduct = (product: ProductResponse) => {
    setSelectedProduct(product)
    setOpenUpdateModal(true)
  }

  // Handle closing update modal
  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false)
    setSelectedProduct(null)
  }

  // Handle product deletion
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      await api.delete(`/product/${productId}`)
      // Refresh product list
      fetchProducts()

      window.location.reload()
    } catch (err) {
      console.error('Error deleting product:', err)
      alert('Failed to delete product')
    }
  }

  // Open add product modal
  const openAddProductModal = () => {
    setOpenAddModal(true)
  }

  // Handle close of add product modal
  const handleCloseAddModal = () => {
    setOpenAddModal(false)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getImage = (imageData: any) => {
    if (!imageData) return '/placeholder-image.png'

    try {
      // If imageData is already a string URL, use it directly
      if (typeof imageData === 'string' && imageData.startsWith('http')) {
        return imageData
      }

      // If imageData is a base64 string
      if (typeof imageData === 'string' && imageData.startsWith('data:')) {
        return imageData
      }

      // Handle different types of binary data
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let binaryData: any

      // If it's an ArrayBuffer or ArrayBufferView
      if (imageData instanceof ArrayBuffer || ArrayBuffer.isView(imageData)) {
        binaryData = imageData
      }
      // If it's a Buffer (Node.js) or array-like object, convert to Uint8Array
      else if (
        Array.isArray(imageData) ||
        (imageData && typeof imageData === 'object')
      ) {
        // Handle Buffer or array-like representation of binary data
        binaryData = new Uint8Array(Object.values(imageData))
      }
      // Fallback for string that might be base64 without prefix
      else if (typeof imageData === 'string') {
        // Try to decode base64
        try {
          const binary = atob(imageData)
          const bytes = new Uint8Array(binary.length)
          for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i)
          }
          binaryData = bytes.buffer
        } catch (e) {
          console.error('Failed to decode base64 string:', e)
          return '/placeholder-image.png'
        }
      }

      // Create a blob from the binary data with image MIME type
      const blob = new Blob([binaryData], { type: 'image/jpeg' })
      return URL.createObjectURL(blob)
    } catch (error) {
      console.error('Error converting image data:', error)
      return '/placeholder-image.png'
    }
  }

  return (
    <div className="text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Produtos</h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg">Não há produtos cadastrados.</p>
            <button
              onClick={openAddProductModal}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
            >
              Adicionar Produto
            </button>
          </div>
        ) : (
          <section aria-labelledby="recent-heading" className="mt-6">
            <div className="space-y-6">
              {/* Mobile View */}
              <div className="sm:hidden">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="mb-4 p-4 border rounded-lg shadow"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-300 rounded-md overflow-hidden">
                        <img
                          src={getImage(product.image)}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium text-white">
                            {product.name}
                          </h3>
                          <div className="flex space-x-2">
                            <button
                              className="text-blue-500 hover:text-blue-700"
                              onClick={() => handleSelectedProduct(product)}
                            >
                              Editar
                            </button>
                            <button
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              Excluir
                            </button>
                          </div>
                        </div>
                        <div
                          className={`font-medium ${product.category ? 'text-green-500' : 'text-red-500'}`}
                        >
                          R$ {product.price.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Quantidade: {product.quantity}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead className="text-sm text-amber-50 text-left">
                    <tr>
                      <th scope="col" className="w-32 px-4 py-3 font-bold">
                        Imagem
                      </th>
                      <th
                        scope="col"
                        className="w-2/5 lg:w-1/3 px-4 py-3 font-bold"
                      >
                        Produto
                      </th>
                      <th
                        scope="col"
                        className="w-1/5 px-4 py-3 font-bold text-center"
                      >
                        Quantidade
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 font-bold text-center"
                      >
                        Valor Unidade
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 font-bold text-center"
                      >
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="border-b border-amber-50 divide-y divide-amber-50 text-sm border-t">
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-4 py-4">
                          <div className="w-16 h-16 min-w-[4rem] rounded overflow-hidden bg-gray-100">
                            <img
                              src={getImage(product.image)}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-medium ">{product.name}</div>
                          {product.description && (
                            <div className="text-sm text-gray-400">
                              {product.description}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {product.quantity}
                        </td>
                        <td
                          className={`px-4 py-4 text-center ${product.category ? 'text-green-500' : 'text-red-500'}`}
                        >
                          R$ {product.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div className="flex justify-center space-x-4">
                            <button
                              className="text-blue-500 hover:text-blue-700 inline-flex items-center justify-center"
                              onClick={() => handleSelectedProduct(product)}
                            >
                              Editar
                            </button>
                            <button
                              className="text-red-500 hover:text-red-700 inline-flex items-center justify-center"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
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
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Add Product Modal */}
      <AddProducts
        isOpen={openAddModal}
        onClose={handleCloseAddModal}
        onSuccess={handleProductAdded}
      />

      {/* Update Product Modal */}
      <UpdateProducts
        item={selectedProduct}
        isOpen={openUpdateModal}
        onClose={handleCloseUpdateModal}
        onSuccess={handleProductUpdated}
      />
    </div>
  )
}

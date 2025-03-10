'use client'
import Cookies from 'js-cookie'

import api from '@/api/api'
import { ProductResponse } from '@/schemas/ProductsSchemas'
import { useEffect, useState } from 'react'
import AddProducts from '../products/AddProducts'

export default function BalanceTransactions() {
  const [openModal, setOpenModal] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [products, setProducts] = useState<ProductResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({
    lastTransactionDate: '-',
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  })

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

        // If token doesn't contain userId, make an API call to get user info
        if (!userId) {
          const userResponse = await api.get('/user/me')
          userId = userResponse.data.id
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

      // Calculate statistics from products
      calculateStats(response.data)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Error fetching products:', err)
      setError('Failed to load product data')
    } finally {
      setLoading(false)
    }
  }

  // Calculate statistics from product data
  const calculateStats = (productData: ProductResponse[]) => {
    if (!productData.length) {
      setStats({
        lastTransactionDate: '-',
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
      })
      return
    }

    // Sort products by date (newest first)
    const sortedProducts = [...productData].sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return dateB - dateA
    })

    // Get last transaction date
    const lastDate = sortedProducts[0].date

    // Format date nicely
    const formattedDate = new Date(lastDate).toLocaleDateString('pt-BR')

    // Calculate income (entries) and expenses (exits)
    const totalIncome = productData
      .filter((product) => product.category) // true = entry
      .reduce((sum, product) => sum + product.price * product.quantity, 0)

    const totalExpense = productData
      .filter((product) => !product.category) // false = exit
      .reduce((sum, product) => sum + product.price * product.quantity, 0)

    // Calculate balance
    const balance = totalIncome - totalExpense

    setStats({
      lastTransactionDate: formattedDate,
      totalIncome,
      totalExpense,
      balance,
    })
  }

  // Load products when component mounts
  useEffect(() => {
    fetchProducts()
  }, [])

  function handleModalOpen() {
    setOpenModal(true)
  }

  function handleModalClose() {
    setOpenModal(false)
    // Refresh data when modal closes to get newly added products
    fetchProducts()
  }

  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  return (
    <>
      <div className="container mx-auto mt-6 bg-#0d132b rounded-lg py-6 px-4 sm:px-6 border border-gray-700">
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : (
          <div className="sm:flex sm:items-center sm:justify-between sm:space-x-6 lg:space-x-8">
            <dl className="divide-y divide-gray-700 space-y-6 text-sm text-white flex-auto sm:divide-y-0 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-x-6 lg:w-3/4 lg:flex-none lg:gap-x-8">
              <div className="flex justify-between sm:block p-2">
                <dt className="font-bold text-gray-300">Último registro</dt>
                <dd className="sm:mt-1 font-medium">
                  {stats.lastTransactionDate}
                </dd>
              </div>
              <div className="flex justify-between pt-6 sm:block sm:pt-0 p-2">
                <dt className="font-bold text-gray-300">Faturamento</dt>
                <dd className="sm:mt-1 font-medium text-green-400">
                  {formatCurrency(stats.totalIncome)}
                </dd>
              </div>
              <div className="flex justify-between pt-6 sm:block sm:pt-0 p-2">
                <dt className="font-bold text-gray-300">Saldo</dt>
                <dd
                  className={`sm:mt-1 font-medium ${stats.balance >= 0 ? 'text-green-400' : 'text-red-400'}`}
                >
                  {formatCurrency(stats.balance)}
                </dd>
              </div>
            </dl>
            <button
              onClick={handleModalOpen}
              className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 mt-6 py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors sm:w-auto sm:mt-0"
            >
              Adicionar novo produto
            </button>
          </div>
        )}
      </div>
      <AddProducts
        isOpen={openModal}
        onClose={handleModalClose}
        onSuccess={fetchProducts}
      />
    </>
  )
}

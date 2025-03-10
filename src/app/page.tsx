'use client'

import api from '@/api/api'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import TransactionsContainer from './components/Layout/BalanceTransactions'
import ProductsContainer from './components/products/ProductsContainer'

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const token = Cookies.get('accessToken')

        if (!token) {
          // No token found, redirect to login
          router.push('/login')
          return
        }

        // Verify token validity by making a request to the API
        await api.get('/user/validate-jwt')

        // If the request succeeds, the token is valid
        setIsLoading(false)
      } catch (error) {
        console.error('Authentication check failed:', error)
        // Token is invalid or expired, redirect to login
        router.push('/login')
      }
    }

    checkAuth()
  }, [router])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Render the page content only if authenticated
  return (
    <div>
      <TransactionsContainer />
      <ProductsContainer />
    </div>
  )
}

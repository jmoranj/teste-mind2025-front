import api from '@/api/api'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function Auth() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = Cookies.get('accessToken')

        if (!token) {
          router.push('/login')
          return
        }

        await api.get('/user/validate-jwt')
        setIsAuthenticated(true)
        setIsLoading(false)
      } catch (error) {
        console.error('Authentication check failed:', error)
        router.push('/login')
      }
    }

    checkAuth()
  }, [router])

  return { isLoading, isAuthenticated }
}

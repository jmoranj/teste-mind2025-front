import api from '@/api/api'
import { NextPageContext } from 'next'
import ServerCookie from 'next-cookies'

export default async function AuthReq(
  ctx: NextPageContext,
): Promise<string | null> {
  const { accessToken } = ServerCookie(ctx)

  if (!accessToken) return null

  try {
    await api.get('/users/validate-jwt', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    return `Bearer ${accessToken}`
  } catch (err) {
    console.error('Token validation error:', err)
    return null
  }
}

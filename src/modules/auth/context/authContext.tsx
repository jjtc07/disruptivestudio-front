import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useRouter } from 'next/router'

import {
  ACCESS_TOKEN,
  getRedirectCache,
  removeRedirectCache,
} from '@modules/common/utils'
import { fetchUser } from '../services/fetchUser'
import { IUser, IUserSignIn } from '../interfaces'

interface AuthContextType {
  user: IUser | null
  isAuth: boolean
  isLoading: boolean
  hasPermission: (permissions: string[]) => boolean
  hasRole: (roleKey: string) => boolean
  login: (user: IUserSignIn) => void
  logout: () => void
}

interface Props {
  children: ReactNode
}

const authContextDefaultValues: AuthContextType = {
  user: null,
  isAuth: false,
  isLoading: true,
  login: (user: IUserSignIn) => {},
  logout: () => {},
  hasPermission: () => false,
  hasRole: () => false,
}
const AuthContext = createContext<AuthContextType>(authContextDefaultValues)

export function AuthProvider({ children }: Props) {
  const { push, isReady } = useRouter()

  const [user, setUser] = useState<IUser | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isAuth, setIsAuth] = useState<boolean>(false)

  const getToken = useCallback(() => localStorage.getItem(ACCESS_TOKEN), [])

  useEffect(() => {
    if (isReady && !isAuth) {
      const accessToken = localStorage.getItem(ACCESS_TOKEN)

      if (!accessToken) {
        return
      }

      getUser()
    }
  }, [isReady, isAuth])

  const getUser = async () => {
    setIsLoading(true)

    try {
      const user = await fetchUser()

      setUser(() => user)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const login = (user: IUserSignIn) => {
    localStorage.setItem(ACCESS_TOKEN, user?.token)

    setUser(user)
    setIsAuth(true)

    const urlRedirect = getRedirectCache()

    if (urlRedirect) {
      removeRedirectCache()

      push(urlRedirect)
    } else {
      push('/')
    }
  }

  const logout = async () => {
    localStorage.removeItem(ACCESS_TOKEN)
    setUser(null)
    removeRedirectCache()

    push('/sign-in')
  }

  const hasPermission = (permissions: string[]) => {
    if (!user || !user.role || !user.role.permissions) {
      return false
    }

    return permissions.every((p) => user.role.permissions.includes(p))
  }

  const hasRole = (roleKey: string) => {
    if (!user || !user?.role || user?.role?.key !== roleKey) {
      return false
    }

    return true
  }

  const value = {
    user,
    isAuth,
    isLoading,
    getToken,
    login,
    logout,
    hasPermission,
    hasRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}

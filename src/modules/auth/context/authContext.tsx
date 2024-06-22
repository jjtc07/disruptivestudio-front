import { ACCESS_TOKEN } from '@modules/common/utils'
import { useRouter } from 'next/router'
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { fetchUser } from '../services/fetchUser'
import { IUser, IUserSignIn } from '../interfaces'

type authContextType = {
  user: IUser | null
  isAuth: boolean
  isLoading: boolean
  login: (user: IUserSignIn) => void
}

type Props = {
  children: ReactNode
}

const authContextDefaultValues: authContextType = {
  user: null,
  isAuth: false,
  isLoading: true,
  login: (user: IUserSignIn) => {},
}
const AuthContext = createContext<authContextType>(authContextDefaultValues)

export function AuthProvider({ children }: Props) {
  const { push, isReady, replace } = useRouter()
  const [user, setUser] = useState<IUser | null>(null)
  const [isAuth, setIsAuth] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const getToken = useCallback(() => localStorage.getItem(ACCESS_TOKEN), [])

  useEffect(() => {
    if (isReady && !isAuth) {
      const accessToken = localStorage.getItem(ACCESS_TOKEN)

      if (!accessToken) {
        return
      }

      getUser()
    }
  }, [isReady, isAuth, replace])

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

    push('/')
  }

  const value = {
    user,
    isAuth,
    isLoading,
    getToken,
    login,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}

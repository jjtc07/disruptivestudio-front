import { IRole } from './role.interface'

export interface IUserSignIn {
  _id: string
  id: string
  username: string
  email: string
  role: IRole
  token: string
}

export interface IUser {
  _id: string
  id: string
  username: string
  email: string
  role: IRole
}

import { ITheme } from '@modules/themes/interfaces'
import { IContent } from './content.interface'
import { CreatedBy } from '@modules/auth/interfaces'

export interface IPost {
  _id: string
  title: string
  cover: string
  description: string
  content: IContent[]
  contentUrl: IContent[]
  themes: ITheme[]
  createdBy: CreatedBy
  coverUrl: string
  id: string
}

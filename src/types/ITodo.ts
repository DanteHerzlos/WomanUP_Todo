import { IFile } from "./IFile"

export interface ITodo {
  id?: string
  title: string
  body: string
  finishDate: string
  checked: boolean
  files: IFile[]
}
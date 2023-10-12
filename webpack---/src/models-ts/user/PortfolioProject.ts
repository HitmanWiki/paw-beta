import cloneDeep from 'lodash/cloneDeep'
import uniqueId from 'lodash/uniqueId'
import File, { FileFromServer } from '@/models-ts/File'
import Image from '@/models/Image'
import { isImage } from '@/utils/file'

type AttachedFile = { key: string, description: string, base64: string, mimeType: string }

export default class PortfolioProject {
  private _attachedFiles: Array<AttachedFile> = []
  id: string | number
  projectName: string
  projectInfo: string
  files: Array<File | UploadedFile>

  constructor ({ id = uniqueId('project_'), projectName = '', projectInfo = '', files = [] }: Partial<PortfolioProject>) {
    Object.assign(this, cloneDeep({ id, projectName, projectInfo, files }))
  }

  static fromServer ({ id, project_name, project_info, relations }: PortfolioProjectFromServerProps) {
    return new PortfolioProject({
      id,
      projectName: project_name || '',
      projectInfo: project_info || '',
      files: (relations.File || []).map(File.fromServer),
    })
  }

  toServer () {
    return {
      project_name: this.projectName.trim(),
      project_info: this.projectInfo.trim(),
      relations: {
        File: this.files,
      },
    }
  }
  getFiles () {
    const images = []
    const other = []
    for (let file of this.files) {
      if (!(file as UploadedFile).key && isImage(file)) {
        images.push(file)
      } else {
        other.push(file)
      }
    }
    return [...Image.arrayFromServer(images), ...other]
  }
  addFile (file: UploadedFile) {
    this.files.push(file)
  }
  deleteFile (index: number) {
    const files = this.getFiles()
    const file = files[index]
    if (file instanceof Image) {
      this.files = this.files.filter(f => {
        return !(f instanceof File) || !f.filename.includes(files[index].name)
      })
    } else {
      let i = -1
      if (file instanceof File) {
        i = this.files.findIndex(f => f instanceof File && f.id === file.id)
      } else {
        i = this.files.findIndex(f => (f as UploadedFile).key === file.key)
      }
      if (i !== -1) {
        this.files.splice(i, 1)
      }
    }
  }
  get images () {
    return Image.arrayFromServer(this.files)
      .concat(this._attachedFiles.map(file => ({
        ...new Image({
          id: file.key,
          src: file.base64,
          description: file.description,
          name: file.key,
        }),
        isAttach: true,
      })))
  }
}

export type PortfolioProjectFromServerProps = {
  id: number
  project_name: string | null
  project_info: string | null
  relations: {
    File: Array<FileFromServer>
  }
}

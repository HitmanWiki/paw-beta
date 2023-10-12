import Vue, { PropType } from 'vue'
import uniqueId from 'lodash/uniqueId'
import File from '@/models-ts/File'
import * as buttons from '@/constants/button'
import { isImage, readFile, readImage } from '@/utils/file'
import snackMixin from '@/mixins/snackMixin'

const TO_MB = 1024 * 1024
const IMAGE_LIMIT = 5 * TO_MB
const FILE_LIMIT = 10 * TO_MB

export default Vue.extend<any, any, any, any>({
  name: 'lx-files-upload-new',
  mixins: [snackMixin],
  props: {
    acceptFormats: {
      type: Array as PropType<Array<String>>,
      default: () => [],
    },
    errorMsg: String,
    files: {
      type: Array as PropType<Array<Object>>,
      default: () => [],
    },
    disabled: Boolean,
    imageOnly: Boolean,
    fileSizeLimit: Number, // in Mb
    isMultiple: {
      type: Boolean,
      default: true,
    },
    limit: {
      type: Number,
      default: 0,
    },
    customCheck: Function,
    loading: Boolean,
  },
  data () {
    return {
      buttons,
      uploadedFiles: [],
      dragOver: false,
    }
  },
  computed: {
    accept () {
      if (!this.acceptFormats.length) {
        return undefined
      }
      return this.acceptFormats.map((format: string) => `.${format}`).join(', ')
    },
  },
  methods: {
    isImage,
    onClickSelect () {
      const input = this.$refs.fileInput
      if (input) {
        input.click()
      }
    },
    onDragOver () {
      this.dragOver = true
    },
    onDragOut () {
      this.dragOver = false
    },
    async uploadFiles (e: any) {
      if (!this.disabled) {
        this.dragOver = false
        e.preventDefault()
        const files = e.dataTransfer ? Array.from(e.dataTransfer.files) : (e.target as HTMLInputElement).files
        if (files?.length) {
          for (let file of files) {
            if (this.limit && this.files.length >= this.limit) {
              this.openSnackbar({
                type: this.SnackTypes.FAILURE,
                text: `The maximum number of files has been reached ${this.limit}`,
              })
              break
            }
            await this.addFile(file)
          }
        }
        (e.target as HTMLInputElement).value = ''
        this.scrollToBottom()
      }
    },
    async addFile (file: any) {
      const fileData = this.imageOnly ? await readImage(file, this.accept) : await readFile(file)
      const fileIsImage = isImage(fileData)
      const dotIndex = file.name.lastIndexOf('.')
      let format = null
      let fileSizeLimit = this.fileSizeLimit ? this.fileSizeLimit * TO_MB : 0
      if (!fileSizeLimit) {
        fileSizeLimit = fileIsImage ? IMAGE_LIMIT : FILE_LIMIT
      }
      if (dotIndex !== -1) {
        format = file.name.substring(dotIndex + 1).toLowerCase()
      }
      if (this.acceptFormats.length && this.acceptFormats.indexOf(format) === -1) {
        this.openSnackbar({
          type: this.SnackTypes.FAILURE,
          text: `Invalid file format. Please upload in ${this.accept}`,
        })
      } else if (file.size > fileSizeLimit) {
        this.openSnackbar({
          type: this.SnackTypes.FAILURE,
          text: `File size cannot exceed ${fileSizeLimit / TO_MB} MB`,
        })
      } else {
        const uploadedFile = {
          base64: fileData.base64,
          mimeType: fileData.mimeType,
          description: file.name,
          key: uniqueId('file_'),
        }
        if (this.customCheck && this.customCheck(uploadedFile)) {
          const id = uniqueId('file_')
          this.uploadedFiles = [...this.uploadedFiles, {
            id,
            name: file.name,
          }]
        }
        this.$emit('upload', {
          base64: fileData.base64,
          mimeType: fileData.mimeType,
          description: file.name,
          key: uniqueId('file_'),
        })
      }
    },
    removeFile (file: File | UploadedFile, index: number) {
      this.$emit('remove', file, index)
    },
    scrollToBottom () {
      this.$nextTick(() => {
        const fileList = this.$refs.fileList
        if (fileList) {
          fileList.scrollTo(0, fileList.scrollHeight)
        }
      })
    },
    getSrcImage (file: any) {
      return file.base64 ? file.base64 : file.src
    },
    getSrcSetImage (file: any) {
      return file.base64 ? undefined : file.srcSet
    },
  }
})

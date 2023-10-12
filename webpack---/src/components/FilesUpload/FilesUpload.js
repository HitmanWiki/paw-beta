import VueTypes from 'vue-types'
import uniqueId from 'lodash/uniqueId'
import * as buttons from '@/constants/button'
import {
    isImage,
    readFile,
    readImage
} from '@/utils/file'
import snackMixin from '@/mixins/snackMixin'

const TO_MB = 1024 * 1024
const IMAGE_LIMIT = 5 * TO_MB
const FILE_LIMIT = 10 * TO_MB

export default {
    name: 'lx-files-upload',
    mixins: [snackMixin],
    props: {
        acceptFormats: VueTypes.array.def([]),
        errorMsg: VueTypes.oneOfType([VueTypes.string, null]).def(null),
        files: VueTypes.arrayOf(VueTypes.any).def([]),
        disabled: Boolean,
        errStatic: Boolean,
        imageOnly: Boolean,
        fileSizeLimit: Number, // in Mb
        isMultiple: VueTypes.bool.def(true),
        limit: VueTypes.number.def(0),
        customCheck: VueTypes.func.def(() => true),
    },
    data() {
        return {
            buttons,
            uploadedFiles: [],
            dragOver: false,
        }
    },
    computed: {
        accept() {
            if (!this.acceptFormats.length) {
                return undefined
            }
            return this.acceptFormats.map(format => `.${format}`).join(', ')
        },
        showBanner() {
            return this.imageOnly && !this.isMultiple && this.files[0]
        },
    },
    methods: {
        isImage,
        onClickSelect() {
            const input = this.$refs.fileInput
            if (input) {
                input.click()
            }
        },
        onDragOver() {
            this.dragOver = true
        },
        onDragOut() {
            this.dragOver = false
        },
        async uploadFiles(e) {
            if (!this.disabled) {
                this.dragOver = false
                e.preventDefault()
                const files = e.dataTransfer ? Array.from(e.dataTransfer.files) : e.target.files
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
                e.target.value = ''
                this.scrollToBottom()
            }
        },
        async addFile(file) {
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
                    text: `Invalid file format. Please upload in ${this.acceptFormats.join(', ')}`,
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
                if (this.customCheck(uploadedFile)) {
                    const id = uniqueId('file_')
                    this.uploadedFiles = [...this.uploadedFiles, {
                        id,
                        name: file.name,
                    }]
                    this.$emit('upload', {
                        base64: fileData.base64,
                        mimeType: fileData.mimeType,
                        description: file.name,
                        key: uniqueId('file_'),
                    })
                }
            }
        },
        removeFile(file, index) {
            this.$emit('remove', file, index)
        },
        scrollToBottom() {
            this.$nextTick(() => {
                const fileList = this.$refs.fileList
                if (fileList) {
                    fileList.scrollTo(0, fileList.scrollHeight)
                }
            })
        },
        getSrcImage(file) {
            return file.base64 ? file.base64 : file.src
        },
        getSrcSetImage(file) {
            return file.base64 ? undefined : file.srcSet
        },
    }
}
import Joi from 'joi'
import omit from 'lodash/omit'
import AbstractModel from '@/models/AbstractModel'
import File from '@/models/File'
import Image from '@/models/Image'

class Portfolio extends AbstractModel {
    _attachedFiles = []

    static propTypes = {
        id: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
        project_name: Joi.string().default(''),
        project_info: Joi.string().default('').allow('', null),
        relations: Joi.object().keys({
            File: Joi.array().items(Joi.object().instance(File)).default([]),
        }).default({
            File: [],
        }),
    }
    constructor(data) {
        super({
            ...data,
            relations: {
                File: (data.relations ? .File || []).map(File.fromServer),
            }
        })
    }
    static fromServer(data) {
        return new Portfolio(data)
    }

    static toServer(data) {
        return {
            ...omit(data, 'id'),
            relations: {
                File: [...data.files, ...data.attachedFiles],
            },
        }
    }

    get images() {
        return Image.arrayFromServer(this.files)
    }

    get files() {
        return this.relations.File
    }

    set files(files) {
        this.relations.File = files
    }

    get attachedFiles() {
        return this._attachedFiles
    }

    set attachedFiles(files) {
        this._attachedFiles = files
    }

    attachFile(file) {
        this._attachedFiles.push(file)
    }

    detachFile(index) {
        this._attachedFiles.splice(index, 1)
    }
}

export default Portfolio
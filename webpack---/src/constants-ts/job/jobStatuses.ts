export const STATUS_NEW = -1
export const STATUS_DRAFT = 1
export const STATUS_PUBLISHED = 2

export const JOB_STATUSES = {
  [STATUS_NEW]: {
    name: 'New',
    description: 'The job is new and not yet saved',
  },
  [STATUS_DRAFT]: {
    name: 'Draft',
    description: 'The job is saved and not visible to anyone except you',
  },
  [STATUS_PUBLISHED]: {
    name: 'Published',
    description: 'The job was successfully published and is visible to everyone',
  },
}

export type JobStatus = typeof STATUS_NEW | typeof STATUS_DRAFT | typeof STATUS_PUBLISHED

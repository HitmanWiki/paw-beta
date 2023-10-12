export const STAGE_NEW = 1
export const STAGE_STARTED = 2
export const STAGE_IN_PROGRESS = 3
export const STAGE_COMPLETED = 4
export const STAGE_DEADLINE_OVERDUE = 5
export const STAGE_BLOCKED_BY_FREELANCER = 6
export const STAGE_DISPUTED = 7
export const STAGE_ARCHIVED = -1

export const JOB_STAGES = {
  [STAGE_NEW]: {
    name: 'New',
    description: 'The new job',
    workflowDescription: 'The new contract has been received for review',
  },
  [STAGE_STARTED]: {
    name: 'Negotiation',
    description: 'Customer and freelancer negotiate the contract terms',
    workflowDescription: 'Customer and freelancer negotiate the contract terms',
  },
  [STAGE_IN_PROGRESS]: {
    name: 'In Progress',
    description: 'Customer has escrowed funds and freelancer is working on the task',
    workflowDescription: 'Customer has escrowed funds and freelancer is working on the task',
  },
  [STAGE_COMPLETED]: {
    name: 'Paid',
    description: 'Task completed and funds paid to freelancer',
    workflowDescription: 'Both parties agreed to complete / close the contract',
  },
  [STAGE_DEADLINE_OVERDUE]: {
    name: 'Refunded',
    description: 'Task incomplete/unsatisfactory and funds returned to customer',
    workflowDescription: 'Both parties have agreed to terminate the contract',
  },
  [STAGE_BLOCKED_BY_FREELANCER]: {
    name: 'In Dispute',
    description: 'Dispute initiated by freelancer - job frozen',
    workflowDescription: 'Both parties have agreed to terminate the contract',
  },
  [STAGE_DISPUTED]: {
    name: 'Resolved',
    description: 'Dispute resolved by third-party arbitration',
    workflowDescription: 'One of the parties has initiated dispute process. Works can not be continued until resolution'
  },
  [STAGE_ARCHIVED]: {
    name: 'Archived',
    description: 'The job is not relevant or a freelancer was selected for it',
  }
}

export type JobStage = typeof STAGE_NEW |
                       typeof STAGE_STARTED |
                       typeof STAGE_IN_PROGRESS |
                       typeof STAGE_COMPLETED |
                       typeof STAGE_DEADLINE_OVERDUE |
                       typeof STAGE_BLOCKED_BY_FREELANCER |
                       typeof STAGE_DISPUTED |
                       typeof STAGE_ARCHIVED

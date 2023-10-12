export enum JobModerationStages {
  PREMODERATION = 1,
  MANUAL = 2,
  PASSED = 3,
  FAILED = 4,
}

export const JobModerationStagesExplanation = {
  [JobModerationStages.PREMODERATION]: null,
  [JobModerationStages.MANUAL]: {
    name: 'Moderation',
    cssClass: 'orange-status',
    description: 'Your Job is on pre-moderation. You will receive a notification within the next 12 hours that your Job has been checked.',
  },
  [JobModerationStages.PASSED]: {
    name: 'Published',
    cssClass: 'blue-status',
    description: null,
  },
  [JobModerationStages.FAILED]: {
    name: 'Declined',
    cssClass: 'red-status',
    // eslint-disable-next-line max-len
    description: 'Our moderation team determined that your Job violated our rules of engagement. If you have any concerns, feel free to contact our support team.',
  },
}

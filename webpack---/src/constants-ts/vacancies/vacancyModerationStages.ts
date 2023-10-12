export enum VacancyModerationStages {
  PREMODERATION = 1,
  MANUAL = 2,
  PASSED = 3,
  FAILED = 4,
}

export const VacancyModerationStagesExplanation = {
  [VacancyModerationStages.PREMODERATION]: null,
  [VacancyModerationStages.MANUAL]: {
    name: 'On moderation',
    cssClass: 'orange-status',
    description: 'Your job listing is currently in moderation. We will email you once an outcome has been reached.',
  },
  [VacancyModerationStages.PASSED]: {
    name: 'Published',
    cssClass: 'blue-status',
    description: null,
  },
  [VacancyModerationStages.FAILED]: {
    name: 'Declined',
    cssClass: 'red-status',
    description: 'Your job listing has been unsuccessful. Please edit your listing and try again, or contact support for assistance.',
  },
}

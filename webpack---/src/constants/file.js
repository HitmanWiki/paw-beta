export const CAT_IMG_ORIGINAL = 1
export const CAT_IMG_100 = 2
export const CAT_IMG_180 = 3
export const CAT_IMG_200 = 4
export const CAT_IMG_360 = 5
export const CAT_CONTRACT = 6
export const CAT_INVOICE = 7
export const CAT_GENERATED_PDF = 9
export const CAT_IMG_CROPPED = 10
export const CAT_IMG_RESIZED = 11

export const CONTRACT_CREATION = 1
export const DECLINE = 3
export const REVIEW = 4

// uploaded by
export const BY_CLIENT = 5
export const BY_SP = 6

export const FILE_STAGES = {
    [CONTRACT_CREATION]: '(on the contract creation)',
    [REVIEW]: '(on the task completion)',
    [DECLINE]: '(on the task decline)',
}
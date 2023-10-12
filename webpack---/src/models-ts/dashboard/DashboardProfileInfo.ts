import cloneDeep from 'lodash/cloneDeep'
import ProfileInfoCategory from '@/constants/ProfileInfoCategory'
import Reputation, { ReputationFromServer } from '@/models-ts/user/Reputation'

const mapCategories = (categories: any, filled = true) => Object.entries(categories)
  .filter(([cat, state]) => state === filled)
  .map(([cat]) => ProfileInfoCategory.getCategory(cat))
  .filter(Boolean)

class DashboardProfileInfo {
  constructor (data: Partial<DashboardProfileInfo>) {
    Object.assign(this, cloneDeep(data))
  }

  static fromServer (data: DashboardProfileInfoFromServer) {
    return new DashboardProfileInfo({
      filled: mapCategories(data.filling),
      unfilled: mapCategories(data.filling, false),
    })
  }
}

export type DashboardProfileInfoFromServer = {
  filling: any
  reputation: ReputationFromServer | Array<any>
}

export default DashboardProfileInfo

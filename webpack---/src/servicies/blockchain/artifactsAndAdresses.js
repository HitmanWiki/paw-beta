let timeWarpContracsRC = null
let sharedArtifactsMap = {}

export async function getTimeWarpContractsRCAsync() {
    if (!timeWarpContracsRC) {
        // eslint-disable-next-line max-len
        timeWarpContracsRC = await
        import ( /* webpackChunkName: 'time-warp-pool' */ 'timewarp-sc-artifacts/artifacts/TimeWarpPool.json')
    }
    return timeWarpContracsRC
}

export async function getERC20AbiAsync(currencyName) {
    if (!sharedArtifactsMap[currencyName]) {
        const artifacts = await
        import (
            /* webpackChunkName: 'erc20-lht-v1' */
            '@chronotech/laborx.sc.artifacts/contracts.v1/ERC20_LHT.json')
        sharedArtifactsMap[currencyName] = artifacts.abi
        return sharedArtifactsMap[currencyName]
    } else {
        return sharedArtifactsMap[currencyName]
    }
}
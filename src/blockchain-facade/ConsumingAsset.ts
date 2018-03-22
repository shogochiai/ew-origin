import Web3Type from '../types/web3'
import { BlockchainProperties } from './BlockchainProperties'
import { Asset, AssetProperties } from './Asset'

export interface ConsumingProperties extends AssetProperties {
    // GeneralInformation

    maxCapacitySet: boolean
    certificatesUsedForWh: number


}

export enum AssetType {
    Wind,
    Solar,
    RunRiverHydro,
    BiomassGas
}

export enum Compliance {
    none,
    IREC,
    EEC,
    TIGR
}


export class ConsumingAsset extends Asset implements ConsumingProperties {

    certificatesUsedForWh: number
    maxCapacitySet: boolean

    static async GET_ASSET_LIST_LENGTH(blockchainProperties: BlockchainProperties) {

        return parseInt(await blockchainProperties.consumingAssetLogicInstance.methods.getAssetListLength().call(), 10)
    }

    static async GET_ALL_ASSETS(blockchainProperties: BlockchainProperties) {

        const assetsPromises = Array(await ConsumingAsset.GET_ASSET_LIST_LENGTH(blockchainProperties))
            .fill(null)
            .map((item, index) => (new ConsumingAsset(index, blockchainProperties)).syncWithBlockchain())

        return Promise.all(assetsPromises)

    }

    static async GET_ALL_ASSET_OWNED_BY(owner: string, blockchainProperties: BlockchainProperties) {
        return (await ConsumingAsset.GET_ALL_ASSETS(blockchainProperties))
            .filter((asset: ConsumingAsset) => asset.owner === owner)
    }


    async syncWithBlockchain(): Promise<ConsumingAsset> {
        if (this.id != null) {
            const structDataPromises = []
            structDataPromises.push(this.blockchainProperties.consumingAssetLogicInstance.methods.getAssetGeneral(this.id).call())
            structDataPromises.push(this.blockchainProperties.consumingAssetLogicInstance.methods.getAssetLocation(this.id).call())

            const demandData = await Promise.all(structDataPromises)

            this.smartMeter = demandData[0]._smartMeter
            this.owner = demandData[0]._owner

            this.operationalSince = parseInt(demandData[0]._operationalSince, 10)
            this.capacityWh = parseInt(demandData[0]._capacityWh, 10)
            this.lastSmartMeterReadWh = parseInt(demandData[0]._lastSmartMeterReadWh, 10)
            this.maxCapacitySet = demandData[0]._maxCapacitySet
            this.active = demandData[0]._active
            this.lastSmartMeterReadFileHash = demandData[0]._lastSmartMeterReadFileHash
            this.certificatesUsedForWh = parseInt(demandData[0]._certificatesUsedForWh, 10)

            // Location
            this.country = this.blockchainProperties.web3.utils.hexToUtf8(demandData[1].country)
            this.region = this.blockchainProperties.web3.utils.hexToUtf8(demandData[1].region)
            this.zip = this.blockchainProperties.web3.utils.hexToUtf8(demandData[1].zip)
            this.city = this.blockchainProperties.web3.utils.hexToUtf8(demandData[1].city)
            this.street = this.blockchainProperties.web3.utils.hexToUtf8(demandData[1].street)
            this.houseNumber = this.blockchainProperties.web3.utils.hexToUtf8(demandData[1].houseNumber)
            this.gpsLatitude = this.blockchainProperties.web3.utils.hexToUtf8(demandData[1].gpsLatitude)
            this.gpsLongitude = this.blockchainProperties.web3.utils.hexToUtf8(demandData[1].gpsLongitude)

            this.initialized = true


        }
        return this
    }

    async getAssetEvents() {

        return (await this.blockchainProperties.consumingAssetLogicInstance.getPastEvents('allEvents', {
            fromBlock: 0,
            toBlock: 'latest',
            topics: [null, this.blockchainProperties.web3.utils.padLeft(this.blockchainProperties.web3.utils.fromDecimal(this.id), 64, '0')]
        }))
    }
}
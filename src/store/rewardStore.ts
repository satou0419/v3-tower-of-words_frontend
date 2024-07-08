export interface RewardItem {
    itemID: number;
    name: string;
    imagePath: string;
    description: string;
    price: number;
}

export interface RewardData {
    adventureRewardID: number;
    adventureRewardCredit: number;
    towerFloorID: number;
    rewardItemOne?: {
        rewardItem: RewardItem;
        rewardItemQuantity: number;
    } | null;
    rewardItemTwo?: {
        rewardItem: RewardItem;
        rewardItemQuantity: number;
    } | null;
}

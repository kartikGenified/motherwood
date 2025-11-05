import KycModule from "@/modules/kyc";
import gameModule from "@/modules/games";


const navigations = [
  ...gameModule,
  ...KycModule
]

export default navigations;
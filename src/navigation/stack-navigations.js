import KycModule from "@/modules/kyc";
import gameModule from "@/modules/games";
import NotificationModule from "@/modules/notification";


const navigations = [
  ...gameModule,
  ...KycModule,
  ...NotificationModule,
]

export default navigations;
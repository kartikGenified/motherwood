import Notification from "./Notification";
import NotificationModal from "./NotificationModal";

const NotificationModule = [
  {
    name: 'Notification',
    component: Notification,
    options: { headerShown: false },
  },
]

export default NotificationModule;
export { NotificationModal };
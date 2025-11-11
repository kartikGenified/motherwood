import Notification from "./Notification";
import NotificationModal from "./NotificationModal";
import NotificationBell from "./NotificationBell";

const NotificationModule = [
  {
    name: 'Notification',
    component: Notification,
    options: { headerShown: false },
  },
]

export default NotificationModule;
export { NotificationModal, NotificationBell };
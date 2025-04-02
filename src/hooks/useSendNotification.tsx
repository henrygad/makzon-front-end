import { useAppDispatch } from "../redux";
import notificationProps from "../types/notification.type";
import { addNotifications } from "../redux/slices/userNotificationSlices";

const useSendNotification = () => {
    const appDispatch = useAppDispatch();

    const handleNotifications = (newNotification: notificationProps) => {
        const createNewNotification = {
            _id: Date.now().toString(),
            ...newNotification
        };
        const Notifications = JSON.parse(localStorage.getItem("notifications") || "[]");
        localStorage.setItem("notifications", JSON.stringify([...Notifications, createNewNotification]));
        appDispatch(addNotifications(createNewNotification));
    };
    
    return handleNotifications;
};

export default useSendNotification;

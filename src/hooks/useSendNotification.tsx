import { useAppSelector } from "../redux";
import notificationProps from "../types/notification.type";
import axios from "axios";
const apiEndPont = import.meta.env.VITE_DOMAIN_NAME_BACKEND;

const useSendNotification = () => {
  const { data: User } = useAppSelector(
    (state) => state.userProfileSlices.userProfile
  );

  const handleNotifications = async (data: notificationProps) => {
    if (data.to === User.userName) return;
    try {
      const url = apiEndPont + "/notification";
      await axios.post(url, data, {
        baseURL: apiEndPont,
        withCredentials: true,
      });
      console.log("send notification");
    } catch (error) {
      console.error(error);
    }
  };

  return handleNotifications;
};

export default useSendNotification;

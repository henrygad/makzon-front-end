import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux";
import Popupnotification from "../components/Popupnotification";
import { Single } from "../components/Displaynotification";
import notificationProps from "../types/notification.type";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: User } = useAppSelector(
    (state) => state.userProfileSlices.userProfile
  );
  const { data: Notifications, popUpNotificationId } = useAppSelector(
    (state) => state.userNotificationSlices
  );
  
  return (
    <>
      {User.login && location.pathname !== "/verify/user" ? (
        <header className="container py-3">
          <Popupnotification
            display={popUpNotificationId === undefined ? false : true}
            children={
              <Single
                notification={
                  Notifications.find(
                    (notis) => notis._id === popUpNotificationId
                  ) as notificationProps
                }
                useDelete={false}
              />
            }
          />
          <nav>
            <ul className="flex gap-4 justify-end items-center pr-2">
              <li>
                <button
                  className="cursor-pointer"
                  onClick={() => navigate("/notification")}
                >
                  Notis ({Notifications.length || null})
                </button>               
              </li>
              <li>
                <button
                  className="cursor-pointer"
                  onClick={() => navigate("/settings")}
                >
                  Settings 
                </button>    
              </li>
            </ul>
          </nav>
        </header>
      ) : null
      }
    </>
  );
};

export default Header;

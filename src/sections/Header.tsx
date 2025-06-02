import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux";
import Popupnotification from "../components/Popupnotification";
import notificationProps from "../types/notification.type";
import Logo from "../components/Logo";
import { Button } from "../components/Button";
import { IoIosNotificationsOutline } from "react-icons/io";
import { IoArrowBackSharp, IoSettingsOutline } from "react-icons/io5";

type props = {
  notificationUpdate: notificationProps | null
  setNotificationUpdate: React.Dispatch<React.SetStateAction<notificationProps | null>>
};

const Header = ({ notificationUpdate, setNotificationUpdate }: props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: User } = useAppSelector(
    (state) => state.userProfileSlices.userProfile
  );

  const { data: Notifications } = useAppSelector(state => state.userNotificationSlices);


  const showMainPageHeaders: Record<string, string> = {
    profile: "Profile",
    feeds: "Feeds",
    saves: "Saves",
    "": "Tending",
  };
  const showInsidePagesHeader: Record<string, string> = {
    createblogpost: "Create post",
    updateprofile: "Update profile",
    settings: "Settings",
    notification: "Notifications",
    security: "Security",
    search: "Search",
    post: "Reading Post",
  };
  const showLogoutPageHeader: Record<string, string> = {
    "": "Tending",
    search: "Search",
    post: "Reading Post",
  };

  return <header className="container">
    {
      User.login ?
        <>
          {/* when login display */}
          <Popupnotification
            notificationUpdate={notificationUpdate}
            setNotificationUpdate={setNotificationUpdate}
          />
          <>
            {showMainPageHeaders[location.pathname.split("/")[1]] ?
              <nav className="flex justify-between items-center gap-8 py-2 mb-2">
                {/* page title */}
                <span>
                  <h2 className="font-text text-xl font-semibold whitespace-pre capitalize">
                    {showMainPageHeaders[location.pathname.split("/")[1]]}
                  </h2>
                </span>
                {/* header navigation */}
                <ul className="flex gap-6 justify-end items-center pr-2">
                  <li>
                    <button
                      className="relative cursor-pointer"
                      onClick={() => navigate("/notification")}
                    >
                      <IoIosNotificationsOutline size={23} />
                      <span
                        className={`flex justify-center items-center text-[9px] font-text font-semibold text-white absolute -top-1 -right-1 
                          ${Notifications.filter(notis => !notis.checked).length ? "px-1 py-0.5" : ""} 
                          bg-red-600 rounded-full z-10`}
                      >{Notifications.filter(notis => !notis.checked).length || null}</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className="cursor-pointer"
                      onClick={() => navigate("/settings")}
                    >
                      <IoSettingsOutline size={19} />
                    </button>
                  </li>
                </ul>
              </nav> :
              showInsidePagesHeader[location.pathname.split("/")[1]] ?
                <nav className="flex items-center gap-4 py-2 mb-2 ">
                  {/* return button */}
                  <button onClick={() => navigate(-1)} className="cursor-pointer">
                    <IoArrowBackSharp size={24} />
                  </button>
                  {/* page title */}
                  <span>
                    <h2 className="font-text text-xl font-semibold whitespace-pre capitalize">
                      {showInsidePagesHeader[location.pathname.split("/")[1]]}
                    </h2>
                  </span>
                </nav> :
                null
            }
          </>
        </> :
        <>
          {showLogoutPageHeader[location.pathname.split("/")[1]] ?
            <menu className="flex justify-between items-center gap-8 py-3 mb-2">
              <span>
                <Logo
                  withText={true}
                  className="h-6 w-6"
                />
              </span>
              <ul className="flex justify-end items-center gap-4">
                <li>
                  <Button
                    className="text-sm py-[1.4px] border border-green-500 shadow hover:shadow-none rounded-md"
                    fieldName={<Link to="/login" >Log in</Link>}
                  />
                </li>
                <li>
                  <Button
                    fieldName={<Link to="/signup" >Sign up</Link>}
                    className="font-sec text-sm border-none shadow-none hover:text-green-500"
                  />
                </li>
              </ul>
            </menu> :
            null
          }
        </>
    }
  </header>;
};

export default Header;

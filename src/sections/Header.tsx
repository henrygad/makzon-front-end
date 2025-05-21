import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux";
import Popupnotification from "../components/Popupnotification";
import notificationProps from "../types/notification.type";
import Logo from "../components/Logo";
import { Button } from "../components/Button";
import { IoIosNotificationsOutline} from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";

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

  const dontShowOnRoutes = [
    "/verify/email",
    "/login",
    "/signup",
    "/forgetpassword",
    "/forgetpassword/",
    "/createblogpost",
    "/profile/update"
  ];

  return (
    <>
      {
        !dontShowOnRoutes.includes(location.pathname.trim()) ?
          <>
            {User.login ? (
              <header className="container py-3">
                <Popupnotification
                  notificationUpdate={notificationUpdate}
                  setNotificationUpdate={setNotificationUpdate}
                />
                <nav>
                  <ul className="flex gap-6 justify-end items-center pr-2">
                    <li>
                      <button
                        className="relative cursor-pointer"
                        onClick={() => navigate("/notification")}
                      >
                        <IoIosNotificationsOutline size={23} /> 
                        <span
                          className="flex justify-center items-center text-xs font-text font-medium text-rose-700 absolute -top-1 -right-1 max-h-4 px-[2px] bg-slate-100 rounded-full z-10"
                        >{Notifications.length || null}</span>
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
                </nav>
              </header>
            ) :
              <header className="container flex justify-between items-center gap-8 py-3">
                <span>
                  <Logo
                    withText={true}
                    className="h-6 w-6"
                  />
                </span>
                <menu>
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
                </menu>
              </header>
            }
          </> :
          null
      }
    </>
  );
};

export default Header;

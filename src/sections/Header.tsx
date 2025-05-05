import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux";
import Popupnotification from "../components/Popupnotification";
import notificationProps from "../types/notification.type";
import Logo from "../components/Logo";
import { Button } from "../components/Button";

type props = {
  notificationUpdate: notificationProps | null  
  setNotificationUpdate: React.Dispatch<React.SetStateAction<notificationProps | null>>
};

const Header = ({ notificationUpdate , setNotificationUpdate}: props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: User } = useAppSelector(
    (state) => state.userProfileSlices.userProfile
  );
 
  const { data: Notifications } = useAppSelector(state => state.userNotificationSlices);

  const dontShowOnRoutes = ["/verify/email", "/login", "/signup", "/forgetpassword", "/forgetpassword/"];
  
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
            ) : <header className="container flex justify-between items-center gap-8 py-3">
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

import userProps from "../types/user.type";
import Displayimage from "./Displayimage";
import useSanitize from "../hooks/useSanitize";
import avatarPlaceholder from "../assets/avaterplaceholder.svg";
import Displayuserloading from "../loaders/Displayuserloading";
import useDateFormat from "../hooks/useDateFormat";
const apiEndPont = import.meta.env.VITE_DOMAIN_NAME_BACKEND;

type Props = {
  loading?: boolean;
  className?: string;
  short: boolean;
  user: userProps | null | undefined;
  onClick?: () => void;
};


const Shortdetail = ({ user, short, className = "flex justify-start items-start gap-0.5", onClick }: Props) => {
  if (!user) {
    return <Displayuserloading className={className} />;
  }
  return (
    <span
      className={` ${className} min-h-[50px] cursor-pointer`}
      onClick={onClick}
    >
      <Displayimage
        url={user.avatar?.trim() ? apiEndPont + "/media/" + user.avatar : ""}
        alt={user.userName}
        useCancle={false}
        className={` ${short ? "h-10 w-10" : "h-12 w-12"} rounded-full object-contain`}
        placeHolder={
          <img
            className={`absolute top-0 bottom-0 right-0 left-0 ${short ? " h-10 w-10" : "h-12 w-12"} rounded-full`}
            src={avatarPlaceholder}
          />
        }
        loadingPlaceHolder={
          <span
            className={`absolute top-0 bottom-0 right-0 left-0 border-slate-200 bg-slate-200 animate-pulse ${short ? "h-10 w-10" : "h-12 w-12"} rounded-full`}
          ></span>
        }
      />

      <span className="flex flex-col">
        {user.name && user.name.givenName ? (
          <span className="block max-w-24 truncate overflow-hidden whitespace-nowrap text-[.9rem] font-sec font-medium -mb-1 ">
            {`${user.name.givenName || ""} ${user.name.familyName || ""}`}
          </span>
        ) : null}
        <span className="block max-w-24 truncate overflow-hidden whitespace-nowrap text-[.8rem] font-sec font-semibold text-slate-400">
          {user.userName}
        </span>
      </span>
    </span>
  );
};

const Displayuserinfor = ({
  user,
  short = true,
  className,
  loading = false,
  onClick = () => null,
}: Props) => {
  const sanitize = useSanitize();
  const handleDateFormat = useDateFormat();

  return <>
    {short ?
      <>
        {/* short user details */}
        <Shortdetail user={user} short={short} onClick={onClick} className={className} />
      </> :
      <div>
        {/* full user details */}
        <Shortdetail user={user} short={short} onClick={onClick} />
        {!loading && user ?
          <>
            {/* bio */}
            {user.country &&
              <span
                className="block font-text text-base mt-4"
                dangerouslySetInnerHTML={sanitize(user.bio || "")}
              />}
            {/* profession */}
            {user.profession &&
              <span className="block text-base font-text text-slate-900 text-start w-full mt-1">
                🧑‍💼 {user.profession}
              </span>}
            <span className="block text-sm text-start text-stone-700 font-text space-y-1 mt-3">
              {/* email */}
              {user.displayEmail &&
                <span className="block">
                  📧 {user.displayEmail}
                </span>}
              {/* phonenumber */}
              <span className="block">
                {user.displayPhoneNumber && user.displayPhoneNumber?.split("-")[1] ? (
                  <span>
                    📞 {user.displayPhoneNumber.split("-")[0]}{" "}
                    {user.displayPhoneNumber.split("-")[1]}
                  </span>
                ) : null}
              </span>
              {/* website link */}
              <span className="flex items-center gap-1">
                {user.website ? (
                  <>
                    🔗
                    <a
                      href={user.website}
                      className="text-blue-700 no-underline cursor-pointer"
                      target="_blank"
                    >
                      {user.website}
                    </a>
                  </>
                ) : null}
              </span>
            </span>
            <span className="block text-xs text-start font-text space-y-1 mt-3">
              {/* sex */}
              {user.sex &&
                <span className="block capitalize">
                  ⚧ {user.sex}
                </span>}
              {/* date of birth */}
              {user.displayDateOfBirth &&
                <span className="block">
                  📅  {handleDateFormat(user.dateOfBirth || "")}
                </span>}
              {/* country */}
              {user.country &&
                <span className="block">
                  🌍 {user.country}
                </span>}
            </span>
          </> :
          <>
            {/* loading full profile details */}
            <div className="animate-pulse">
              <div className="space-y-3 p-2 animate-pulse">
                <div className="min-w-[240px] sm:min-w-[480px] h-4 min- bg-slate-300 rounded-md"></div>
                <div className="h-4 bg-slate-300 rounded-md"></div>
                <div className="h-4 bg-slate-300 rounded-md"></div>
              </div>
            </div>
          </>
        }
      </div >
    }
  </>;
};

export default Displayuserinfor;

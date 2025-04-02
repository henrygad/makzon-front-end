import { GoLink } from "react-icons/go";
import userProps from "../types/user.type";
import Displayimage from "./Displayimage";
import useSanitize from "../hooks/useSanitize";
import avatarPlaceholder from "../assert/avaterplaceholder.svg";

type Props = {
  short: boolean;
  user: userProps;
  onClick?: () => void;
};

const Shortdetail = ({ user, short, onClick }: Props) => {
  return (
    <span className="flex items-start gap-1 cursor-pointer" onClick={onClick}>
      {short ? (
        <Displayimage
          url={user.avatar || ""}
          alt={user.userName}
          useCancle={false}
          className="h-10 w-10 rounded-full object-contain"
          placeHolder={
            <img
              className="absolute top-0 bottom-0 right-0 left-0 h-10 w-10 rounded-full"
              src={avatarPlaceholder}
            />
          }
          loadingPlaceHolder={
            <span className="absolute top-0 bottom-0 right-0 left-0 border-slate-200 bg-slate-200 animate-pulse h-10 w-10 rounded-full"></span>
          }
        />
      ) : (
        <Displayimage
          url={user.avatar || ""}
          alt={user.userName}
          useCancle={false}
          className="h-14 w-14 rounded-full object-contain"
          placeHolder={
            <img
              className="absolute top-0 bottom-0 right-0 left-0 h-14 w-14 rounded-full"
              src={avatarPlaceholder}
            />
          }
          loadingPlaceHolder={
            <span className="absolute top-0 bottom-0 right-0 left-0 border border-slate-200 bg-slate-200 animate-pulse h-14 w-14 rounded-full"></span>
          }
        />
      )}

      <span className="flex flex-col">
        {user.name && user.name.givenName ? (
          <span className="block text-[.9rem] font-sec -mb-1">{`${user.name.givenName} ${user.name.familyName}`}</span>
        ) : null}
        <span className="block text-[.8rem] font-sec text-slate-400 font-semibold">
          {user.userName}
        </span>
      </span>
    </span>
  );
};

const Displayuserinfor = ({
  user,
  short = true,
  onClick = () => null,
}: Props) => {
  const sanitize = useSanitize();
  return (
    <>
      {short ? (
        <Shortdetail user={user} short={short} onClick={onClick} />
      ) : (
        <>
          <div className="w-full">
            <Shortdetail user={user} short={short} onClick={onClick} />
            {/* bio */}
            <span
              className="block font-text text-base mt-4"
              dangerouslySetInnerHTML={sanitize(user.bio || "")}
            ></span>
            <span className="block text-base font-text text-slate-900 text-start w-full mt-1">
              {user.profession}
            </span>
            <span className="block text-base text-start text-stone-700 font-text space-y-0.5 mt-3">
              <span className="block">
                {/* email */}
                {user.displayEmail || ""}
              </span>
              <span className="block">
                {/* phonenumber */}
                {user.displayPhoneNumber ? (
                  <span>
                    {user.displayPhoneNumber.split("-")[0]}{" "}
                    {user.displayPhoneNumber.split("-")[1]}
                  </span>
                ) : null}
              </span>
              <span className="flex items-center gap-1">
                {/* website link */}
                {user.website ? (
                  <>
                    <GoLink size={13} color="blue" />
                    <a
                      href={user.website || ""}
                      className=" text-slate-700 no-underline cursor-pointer"
                      target="_blank"
                    >
                      {user.website || ""}
                    </a>
                  </>
                ) : null}
              </span>
            </span>
            <span className="block text-base text-start font-text mt-3">
              <span className="block capitalize">
                {/* sex */}
                {user.sex || ""}
              </span>
              <span className="block">
                {/* date of birth */}
                {user.displayDateOfBirth ? user.dateOfBirth || "" : null}
              </span>
              <span className="block">
                {/* country */}
                {user.country || ""}
              </span>
            </span>
          </div>
        </>
      )}
    </>
  );
};

export default Displayuserinfor;

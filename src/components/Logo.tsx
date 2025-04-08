import { useNavigate } from "react-router-dom";


const Logo = ({ withText = true, className }: { withText: boolean, className: string }) => {
  const navigete = useNavigate();

  return <span
    className="flex gap-1 items-end"
    onClick={() => navigete("/")}
  >
    <span className={`flex -rotate-45 ${className}`}>
      <span className='w-full h-full border-4 border-slate-100 rounded-full'>
      </span>
      <span className='absolute w-full h-full border-t-4 border-l-4 border-green-500 rounded-full'>
      </span>
    </span>
    {withText ?
      <span className="block font-primary font-bold text-base text-green-500">MAKzon</span> :
      null
    }
  </span>;
};

export default Logo;

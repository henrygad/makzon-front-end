const apiEndPont = import.meta.env.VITE_DOMAIN_NAME_BACKEND;

const Googleloginbtn = ({text}:{text: string}) => {

    return <a
        href={apiEndPont + "/auth/google"}
        className="flex justify-center items-center border px-6 py-2 rounded-md ">
        <img src="" alt="" />
        <span>{text}</span>
    </a>;
};

export default Googleloginbtn;
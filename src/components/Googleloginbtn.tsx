const apiEndPont = import.meta.env.VITE_DOMAIN_NAME_BACKEND;

const Googleloginbtn = () => {

    return <a
        href={apiEndPont + "/auth/google"}
        className="border px-6 py-2 rounded-md ">
        <img src="" alt="" />
        <span>Login With Google</span>
    </a>;
};

export default Googleloginbtn;
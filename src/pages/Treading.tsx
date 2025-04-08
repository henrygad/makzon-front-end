import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import Logo from "../components/Logo";

const Treading = () => {
    return <>
        <header className="container flex justify-between items-center gap-8 py-3 border-b">         
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
        <main className="container">
            {/* slider */}
          Treading
        </main>
        <footer className="w-full flex justify-center">
            <div className="flex justify-center items-center gap-3 text-sm font-sec text-green-600 p-2">
                <button>
                    <Link to={"/privicy"}>
                        Privicy
                    </Link>
                </button>
                <span className="text-slate-800 text-base">|</span>
                <button>
                    <Link to={"/Cookies"}>
                        Cookies
                    </Link>
                </button>
            </div>
        </footer>
    </>;
};

export default Treading;

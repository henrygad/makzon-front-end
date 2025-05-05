
import Logo from "../components/Logo";
import Verifyemail from "../sections/Verifyemail";

const Verification = () => {

    return (
        <>
            <header className="flex flex-col justify-between items-center py-10 gap-4">
                <Logo withText={true} className="h-6 w-6" />
                <h2 className="font-text text-2xl font-medium">
                    Verify Email
                </h2>
            </header>
            <main className="container">
                <Verifyemail />      
            </main>           
        </>
    );
};

export default Verification;

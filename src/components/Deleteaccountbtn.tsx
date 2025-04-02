import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Deleteaccountbtn = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handDeleteaccount = async () => {
        if (loading) return;

        try {
            setLoading(true);

            const url = "http://localhost:3000/api/delete";
            const res = await axios(url);
            const body = await res.data;
            console.log(body);

            navigate("/login");
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return <button
        className=" font-text text-sm text-white p-2 bg-red-700 shadow-sm border rounded-md"
        onClick={handDeleteaccount}
    >
        {!loading ? "Delete" : "loading"}
    </button>;
};

export default Deleteaccountbtn;

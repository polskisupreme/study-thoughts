import { FcGoogle } from "react-icons/fc";
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from "../../utils/firebase";
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect } from "react";

export default function Login() {

    //poruszanie 
    const route = useRouter();

    //user i login 
    const [user, loading] = useAuthState(auth);

    //Logowanie za pomoca googla 
    const googleProvider = new GoogleAuthProvider();
    const GoogleLogin = async () => {
        try {

            const result = await signInWithPopup(auth, googleProvider);
            route.push("/");

        } catch (error) {
                console.log(error);
        }
    };

    useEffect(() => {
        if(user){
            route.push('/');
        }else {
            console.log("login");
        }
    }, [user]);

    return(
        <div className="shadow-xl mt-32 p-10 text-stone-800 rounded-lg">
            <h2 className="text-2xl font-bold">Dołącz dziś</h2>
            <div className="py-4">
                <h3 className="py-4 font-medium">zalguj się wybierając jedną z opcji</h3>
                <button onClick={GoogleLogin} className="text-white bg-teal-600 w-full font-medium rounded-lg flex align-middle p-4 gap-3">
                    <FcGoogle className="text-2xl" />
                    Zaloguj się za pomocą google
                    </button>

            </div>
        </div>
    );
}

import Link from "next/link";
import { auth } from '../utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function Nav() {

    //odczyt user, status zalogowania
    const [user, loading] = useAuthState(auth);
    console.log(user)


    return (
       <nav className="flex justify-between items-center py-10">
            <Link href="/">
                <button className="text-lg font-medium">Study Thoughts</button>
            </Link>
            <ul className="flex items-center gap-10">
                {!user && (
                <Link href={'/auth/login'}>
                <a className="py-2 px-4 text-sm bg-emerald-800 text-white rounded-lg font-medium ml-8">
                    Join Now
                </a>
                </Link>
                )}
                {user && (
                    <div className="flex iteams-center gap-6">
                        <Link href="/post">
                            <button className="py-2 px-4 font-medium bg-emerald-800 text-white rounded-lg text-sm">Post</button>
                        </Link>
                        <Link href="/dashboard">
                            <img className="w-12 rounded-full cursor-pointer" src={user.photoURL}></img>
                        </Link>
                    </div>
                )}
            </ul>
       </nav>
    );
}
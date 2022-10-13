import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore";
import Message from "../components/message";
import { BsTrash2Fill } from 'react-icons/bs';
import { AiFillEdit } from 'react-icons/ai';
import Link from "next/link";

export default function Dashboard() {

    const route = useRouter();
    const [user, loading] = useAuthState(auth);
    const [posts, setPosts] = useState([]);

    //sprawdzanie czy user jest zalogowany
    const getData = async () => {
        if(loading) return;
        if(!user) return route.push('/auth/login');
        const collectionRef = collection(db, 'posts');

        //zwracanie wiadomosci ktore naleza do konkretnego user
        const q = query(collectionRef, where('user', '==', user.uid));
        const unsubscribe = onSnapshot(q, (snapshot => {
            setPosts(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})));
        }));
        return unsubscribe;
    };

    //usuwanie posta
    const deletePost = async(id) => {
        const docRef = doc(db, 'posts', id);
        await deleteDoc(docRef);
    };

    //pobieranie informacji o user
    useEffect (() => {

        getData();

    }, [user, loading]);

    return(

       <div>
        <h1>Twoje posty</h1>
        <div> {posts.map(post => {
            return(
            <Message {...post} key={post.id}>
                <div className="flex gap-6">
                    <button onClick={() => deletePost(post.id)} className="text-lime-600 flex items-center justify-center gap-2 py-4 text-sm">
                        <BsTrash2Fill className="text-2xl" />Usuń</button>
                    <Link href={{pathname: "/post", query: post}}>
                        <button className="text-emerald-800 flex items-center justify-center gap-2 py-4 text-sm">
                            <AiFillEdit className="text-2xl" />Edytuj</button>
                    </Link>
                </div>

            </Message>);
        })}
        </div>
        <button className="font-medium text-white bg-emerald-800 py-2 px-4 my-8 rounded-lg" onClick={() => auth.signOut()}>Wyloguj</button>
       </div> 

    );
}
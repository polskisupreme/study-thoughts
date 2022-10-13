import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";

export default function Post() {

    //stany formularza
    const [post, setPost] = useState({ description: "" });
    const [user, loading] = useAuthState(auth);
    const route = useRouter();
    const routeData = route.query;

    //funkcja odpowiadajaca potwierdzaniu posta
    const submitPost = async (e) => {
        e.preventDefault();
        
        //sprawdzanie wiadomosci
    if (!post.description) {
        toast.error('Pole wiadomości jest puste 😢', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1500,
        });

        return;
    }
    if (post.description.length > 300) {
        toast.error('Pole wiadomości jest za długie 😢', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1500,
        });

        return;
    }

    if(post?.hasOwnProperty('id')) {
        const docRef = doc(db, 'posts', post.id);
        const updatedPost = {...post, timestamp: serverTimestamp()};
        await updateDoc(docRef, updatedPost);
        return route.push('/');
    }else {
        //tworzenie nowego postu
        const collectionRef = collection(db, "posts");
        await addDoc(collectionRef, {
            ...post,
            timestamp: serverTimestamp(),
            user: user.uid,
            avatar: user.photoURL,
            username: user.displayName,
        });
        setPost({description: ""});
        toast.success('Twój post został opublikowany  🥳', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1500,
        });
        return route.push("/");
        }
    };

    //sprawdzanie user
    const checkUser = async () => {
        if(loading) return;
        if(!user) route.push("/auth/login");
        if(routeData.id){
            setPost({description: routeData.description, id: routeData.id});
        }
    };

    useEffect(() => {
        checkUser();
    }, [user, loading])

    return(
        <div className="my-20 p-12 shadow-lg rounded-lg max-w-md mx-auto">
            <form onSubmit={submitPost}>
                <h1 className="text-2xl font-bold">
                    {post.hasOwnProperty('id') ? 'Edytuj swój post' : 'Stwórz swój nowy post'}
                </h1>
                <div className="py-2">
                    <h3 className="text-lg font-medium py-medium">Wiadomość</h3>
                    <textarea
                    value={post.description}
                    onChange={(e) => setPost({...post, description: e.target.value})}
                    className="bg-teal-600 h-48 w-full text-white rounded-lg p-2 text-sm"></textarea>
                    <p className={`text-emerald-800 font-medium text-sm ${post.description.length > 300 ? 'text-red-600' : ""}`}>{post.description.length}/300</p>
                </div>
                <button type="submit" className="w-full bg-emerald-800 text-white font-bold p-2 my-4 rounded-lg text-sm">Opublikuj</button>
            </form>
        </div>
    );
}

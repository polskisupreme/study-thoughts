import Message from "../components/message";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import { toast } from "react-toastify";
import { arrayUnion, doc, onSnapshot, Timestamp, updateDoc } from "firebase/firestore";

export default function Details() {

    const router = useRouter();
    const routeData = router.query;
    const [message, setMessage] = useState('');
    const [allMessage, setAllMessages] = useState([]);

    //potwierdzenie wiadomosci/komentarza
    const submitMessage = async() => {
        //sprawdzanie czy user jest zalogowany
        if(!auth.currentUser) return router.push('/auth/login');

        if(!message) {
            toast.error("Twój komentarz jest pusty 😱. Uzupełnij go 😄", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1500,
            });
            return;
        }
        if (message.length > 300) {
            toast.error('Pole wiadomości jest za długie 😢', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1500,
            });
            return;
        }
        const docRef = doc(db, "posts", routeData.id);
        await updateDoc(docRef, {
            comments: arrayUnion({
                message,
                avatar: auth.currentUser.photoURL,
                userName: auth.currentUser.displayName,
                time: Timestamp.now(),
            }),
        });
        setMessage("");
    };

    //wyswietlanie komentarzy
    const getComments = async () => {
        const docRef = doc(db, "posts", routeData.id);
        const unsubscribe = onSnapshot(docRef, (snapshot) => {
            setAllMessages(snapshot.data()?.comments);
        });
        return unsubscribe;
    };
    
    useEffect(() => {
        if(!router.isReady) return;
        getComments();
    }, [router.isReady]);

    return(
        <div>
            <Message {...routeData}>
                
            </Message>
            <div className="my-3">
                <div className="flex">
                    <input onChange={(e) => setMessage(e.target.value)}
                    type="text"
                    value={message}
                    placeholder="Wyślij wiadomość 👈"
                    className="bg-teal-600 w-full p-3 text-white text-sm rounded-md rounded-r-none" />
                    <button onClick={submitMessage} className="bg-emerald-800 text-white py-2 px-4 rounded-md rounded-l-none text-sm">Wyślij</button>
                </div>
                <div className="py-6">
                    <h2 className="font-bold"> Komentarze</h2>
                    {allMessage?.map(message => (
                        <div className="bg-white shadow-lg p-4 my-4 border-4 border-emerald-800 rounded-md" key={message.time}>
                            <div className="flex items-center gap-4 mb-6">
                               <img className="rounded-full w-12" src={message.avatar} alt=""/> 
                               <h2>{message.userName}</h2>
                            </div>
                            <h2>{message.message}</h2>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
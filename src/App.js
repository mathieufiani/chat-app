import logo from './logo.svg';
import React, {useEffect, useState} from "react";
import './App.css';

import firebase from "firebase/compat/app";
import 'firebase/compat/auth'
import 'firebase/compat/firestore';
import {useAuthState} from "react-firebase-hooks/auth";
import {useCollectionData} from "react-firebase-hooks/firestore";
// Initialize Firebase

const app = firebase.initializeApp({
    apiKey: "AIzaSyDHT3A7GdIabEM8_hlZTlpxHk0OdUt1G-A",
    authDomain: "chat-app-67300.firebaseapp.com",
    projectId: "chat-app-67300",
    storageBucket: "chat-app-67300.appspot.com",
    messagingSenderId: "384107569716",
    appId: "1:384107569716:web:dc485962569bbd47f5a061"
});

const auth = firebase.auth();
const db = app.firestore();

const App = () => {
    const user = useAuthState(auth);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        db.collection('messages').onSnapshot(snapshot => {
            setMessages(snapshot.docs.map(doc => doc.data()))
        })
    }, []);
    return (
        <div className="App">
            <header className="App-header">

            </header>
            <section>
                {user ? <ChatRoom/> : <SignIn/>}
            </section>
        </div>
    );
}
const SignOut = () => {
    return auth.currentUser && (
        <button onClick={() => auth.signOut()}></button>
    )
}


const SignIn = () => {
    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider);
    }
    return (
        <button onClick={signInWithGoogle}>Sign in with Google</button>
    )
}
const ChatRoom = () => {
    const messagesRef = db.collection('messages');
    const query = messagesRef.orderBy('createdAt').limit(25)
    const [messages] = useCollectionData(query, {idField: 'id'});
    const [formValue, setFormValue] = useState('');
    const sendMessage = async (e) =>{
        e.preventDefault();
        const {uid, photoURL} = auth.currentUser;
        await messagesRef.add({
            text: formValue,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid, photoURL
        });
        setFormValue('');
        console.log(formValue )
    }
    return (
        <div className={'chatRoom'}>
            {messages && messages.map((msg, index) => <ChatMessage key={index} message={msg}/>)}
            <form onSubmit={sendMessage}>
                <input value={formValue} onChange={e => setFormValue(e.target.value)}/>
                <button type={"submit"}>🕊</button>
            </form>
        </div>
    )
}

const ChatMessage = (props) => {
    const {text, uid, photoURL} = props.message;
    const messageclass = uid === auth.currentUser.uid ? 'sent' : 'received';
    return (
        <div className={`message ${messageclass}`}>
            <img src={photoURL}/>
            <p>{text}</p>
        </div>
    )
}


export default App;

import React, { useEffect, useRef } from 'react'
import arr from '../arr.svg'
import { io } from 'socket.io-client'
import { useState ,useContext} from 'react'
import {UserContext} from '../context/UserContext'
import fallback from '../profile.png' 
import { db } from '../config/firebase'

import { addDoc,doc, collection, getDoc,setDoc,query, orderBy, getDocs, onSnapshot,serverTimestamp } from 'firebase/firestore'
const socket = io.connect(process.env.REACT_APP_BACKEND);
function Chat() {
const [userData, setUserdata] = useState(null);
const [messages,setMessages]=useState([])
  const { user } = useContext(UserContext);
  const [ time,setTime]=useState('')
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp")); // use Firestore timestamp if possible

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
    });

    return () => unsubscribe(); // cleanup
  }, []);

  
  
  useEffect(()=>{
    if (!user?.uid) return;
    
    
    const users = async ()=> {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        
        setUserdata(docSnap.data()); // ✅ data as object
      } else {
        console.log("No such document!");
        return null;
      }
    }
    
    users()
    
    
    
    
  },[user])
  console.log("Profile pic URL:", userData?.pfp);
  
  
  const [incoming, setIncoming]=useState()
  const [allMess, setallMess]=useState([])
  const msgIdRef= useRef(1)
  const handleSendmessage= async ()=>{
    if (!incoming.trim()) return; // ignore empty messages
    
    const newMsg = {
      id: msgIdRef.current,
      text: incoming,
      fromSelf:true
    }
    
    // 1. Emit message to server
    socket.emit("send_message", { message: incoming });
    
    // 2. Show the message on sender side immediately
    setallMess((prev) => [...prev, newMsg]);
    
    // 3. Increment ID and clear input
    msgIdRef.current += 1;
    setIncoming('');
    const messagesCollection = collection(db, "messages");
    
    const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
  
    const timeHHMM = `${hours}:${minutes}`;
    setTime(timeHHMM) 
    
    const payload = {
      senderpfp: user.photoURL,
      text: incoming,
      timestamp: serverTimestamp(),
      uid: user.uid
    };
  await addDoc(messagesCollection, payload);
    
  }
  useEffect(() => {
    
    const handleReceiveMessage = (d) => {
      const newMsg = {
        id: msgIdRef.current,
        text: d.message,
        fromSelf: false
      }
      msgIdRef.current += 1
      setallMess((prev) => [...prev, newMsg])
    }

    socket.on("receive_message", handleReceiveMessage)

    // cleanup listener on component unmount
    return () => {
      socket.off("receive_message", handleReceiveMessage)
    }
  }, [])

  return (
    <div className="p-10 h-screen">
  <div className="bg-main2 p-2 rounded-2xl flex flex-col h-full">
    {/* Scrollable message list */}
    <div className="flex-1 overflow-y-auto">
      <ul className="list-none space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex mb-2 ${msg.uid === user.uid ? "justify-end" : "justify-start"}`}
          >
            <div className={`p-2 rounded-lg max-w-xs ${msg.uid === user.uid ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
              <img src={msg.senderpfp} className="w-6 h-6 rounded-full mr-2 inline-block" />
              <span>{msg.text}</span>
              <footer className='text-xs mt-5'>{time}</footer>
            </div>
          </div>
        ))}
      </ul>
    </div>

    {/* Input area */}
    <div className="pt-2">
      <div className='flex'>
        <input
          type="text"
          onChange={(e) => setIncoming(e.target.value)}
          className='text-main2 p-2 w-full h-10 rounded-xl'
        />
        <button onClick={handleSendmessage} className='ml-2 bg-white rounded-3xl w-10'>
          <img src={arr} className='m-auto' alt="" />
        </button>
      </div>
    </div>
  </div>
</div>

  )
}

export default Chat
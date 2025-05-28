import React, { useContext, useEffect, useState } from 'react'
import { authen , googleProvider } from '../config/firebase'
import { signInWithPopup, signInWithRedirect } from 'firebase/auth'
import { useNavigate } from 'react-router-dom';
import {UserContext} from '../context/UserContext'
import { db } from '../config/firebase'
import { addDoc, collection, getDocs,doc, setDoc, onSnapshot } from 'firebase/firestore'
import '../auth.css'
import logo from '../logo.png'
function Auth() {
  const { setUser,user }= useContext(UserContext)
    const navigate = useNavigate();
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // const createUser=async()=>{
    //   await addDoc(userCollectionRef,{email:,name:,pfp:,uid:})
    // }
    const [databa, setDataba]=useState([])
  function AuthListener({ user }) {
  const [databa, setDataba] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const datab = snapshot.docs.map((doc) => doc.data());
      setDataba(datab);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const addUserIfNotExists = async () => {
      if (!user?.uid) return;

      const exists = databa.find(d => d.uid === user.uid);
      if (!exists) {
        const docRef = doc(db, "users", user.uid);
        const payload = {
          email: user.email,
          name: user.displayName,
          pfp: user.photoURL,
          uid: user.uid
        };
        await setDoc(docRef, payload);
      }
    };
    addUserIfNotExists();
  }, [databa, user]);
  
  navigate('/home');
  return null;
}

    const signinwithG= async ()=>{
      try{
        if (isMobile) {
          await signInWithRedirect(authen, googleProvider);
        } else {
          await signInWithPopup(authen, googleProvider);
        }
        const user=authen.currentUser;
        setUser(user)       

 
        
          
        
        
        
        
      }catch(err){
        console.error(err)
      }
      
    }

    return (
      <div className='  '  >
            <img src={logo} className='h-28'  alt="" srcset="" />
      <div className='grid lg:grid-cols-2 sm:grid-cols-1'>
        <div className=''>
          <div className=' mt-24 flex justify-center text-main4'>
            <h1 className='text-5xl font-bold'>Your New <span className='text-main2'>Favorite</span> Place <br />to Talk.
            <br /> <span className=' text-base text-main3'>Fast, Secure, and Effortless Messaging.</span></h1>
          </div>
          


        </div>
        <div>
          <div className='flex  justify-center'>

          <div className="flex  min-h-full flex-1 flex-col justify-center px-12 py-12 lg:px-36 sm:px-1 ">
            <div className='border  rounded-3xl backdrop-blur-3xl  py-10 '>

        <div className="sm:mx-auto  sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src={logo}
            className="mx-auto h-20 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-main3">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action="#" method="POST" className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-main3">
                Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md bg-while border px-3 py-1.5 text-base text-main3 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-main3">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block border w-full rounded-md bg-white px-3 py-1.5 text-base text-main3 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-main2 px-3 py-1.5 text-sm/6 font-semibold text-main3 shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-5 text-center text-sm/6 text-gray-500">
            OR
            
          </p>
          <button onClick={signinwithG}
      className="flex mt-4 items-center justify-center w-full max-w-sm px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-100 transition"
    >
      {user && <AuthListener user={user}/>}
      <img
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt="Google logo"
        className="w-5 h-5 mr-2"
      />
      <span className="text-sm font-medium text-gray-700">Sign in with Google</span>
    </button>
        </div>
            </div>
      </div>
          </div>
        </div>

      </div>
      
    
    </div>
  )
}

export default Auth
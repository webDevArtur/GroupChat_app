import { BrowserRouter } from "react-router-dom";
import AppRouter from "./AppRouter";
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import {createContext} from "react";

const firebaseConfig = {
    apiKey: "AIzaSyAW4NCjKCXccFfIIAqCfSlExPxo_fNyKhY",
    authDomain: "chat-4af43.firebaseapp.com",
    projectId: "chat-4af43",
    storageBucket: "chat-4af43.appspot.com",
    messagingSenderId: "242178072423",
    appId: "1:242178072423:web:e273a281359176cbf6d9c2",
    measurementId: "G-9LFDBXZY35"
};

export const Context = createContext<any>(null);

const firebase = initializeApp(firebaseConfig);
const firestore = getFirestore(firebase);
const auth = getAuth(firebase);


function App() {

  return (
      <Context.Provider value={{firebase, firestore, auth}}>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </Context.Provider>
  )
}

export default App

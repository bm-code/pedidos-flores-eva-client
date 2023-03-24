import Header from "./components/Header";
import Login from "./components/Login";
import { useState, useEffect } from "react";
import axios from "axios";
import { initializeApp } from "firebase/app";

function App() {
  // Import the functions you need from the SDKs you need
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBCvie-VuSbE2NDWxrdyidcanVmNzWRoNc",
    authDomain: "pedidos-dd593.firebaseapp.com",
    projectId: "pedidos-dd593",
    storageBucket: "pedidos-dd593.appspot.com",
    messagingSenderId: "753351769892",
    appId: "1:753351769892:web:0c920d0f06c3f13d68fdb1"
  };

  // Initialize Firebase
  // eslint-disable-next-line
  const app = initializeApp(firebaseConfig);

  const subscriptions = async () => {

    const register = await navigator.serviceWorker.register('./worker.js', {
      scope: '/'
    })
    console.log('New service worker');

    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.PUBLIC_KEY
    })

    await axios.post('https://pedidos-server.up.railway.app/subscriptions',
      subscription,
      {
        headers: {
          'Content-Type': 'application/json',
          'options': firebaseConfig
        }
      })
    console.log('Suscrito');
  }

  useEffect(() => {
    subscriptions();
  }, [])


  const [user, setUser] = useState({
    name: sessionStorage.getItem('name'),
    username: sessionStorage.getItem('username'),
    email: sessionStorage.getItem('email')
  });

  return (
    <div className="container py-5">
      {user.name !== null ? <Header /> : <Login login={user} setLogin={setUser} />}
    </div>
  )
}

export default App;
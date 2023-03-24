import Header from "./components/Header";
import Login from "./components/Login";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {

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
          'Content-Type': 'application/json'
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
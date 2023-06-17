import Header from "./components/Header";
import Login from "./components/Login";
import axios from "axios";
import { initializeApp } from "firebase/app";
import { useEffect, useState } from "react";
import ShopSelector from "./components/ShopSelector";

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

  const [shop, setShop] = useState('')

  useEffect(() => {
    setShop(localStorage.getItem('shop'))
  }, [])

  // Initialize Firebase
  // eslint-disable-next-line
  const app = initializeApp(firebaseConfig);

  const subscriptions = async () => {

    const register = await navigator.serviceWorker.register('./worker.js', {
      scope: '/'
    })
    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.PUBLIC_KEY,
      applicationLocalKey: process.env.PUBLIC_KEY
    })

    await axios.post('https://flores-eva-server.onrender.com/subscriptions',
      subscription,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      })
    console.log('Suscrito');
  }

  useEffect(() => {
    subscriptions();
  }, [])

  const [user, setUser] = useState({})

  useEffect(() => {
    setUser({
      name: localStorage.getItem('name'),
      username: localStorage.getItem('username'),
      email: localStorage.getItem('email')
    })
  }, [])

  const shopSelected = localStorage.getItem('shop');
  const [active, setActive] = useState(false)

  const changeShop = event => {
    localStorage.removeItem('shop');
    localStorage.setItem('shop', event.target.value);
    setTimeout(() => {
      window.location.reload();
    }, 500)
  }

  return (
    <div className="container py-5">
      {user.name && <div className="row col-12 text-center">
        <h2 className="mt-5">Hola, {user.name}. Estás en la tienda del {shop}. <span onClick={() => setActive(!active)} className="btn btn-link">Cambiar</span></h2>

        {active &&
          <select onChange={changeShop} className="form-select" aria-label="Seleccionar opción">
            <option defaultValue=''>Seleccionar tienda</option>
            <option value="barrio">Barrio</option>
            <option value="centro">Centro</option>
          </select>
        }
      </div>}
      {user.name !== null ? shop ? <Header /> : <ShopSelector /> : <Login login={user} setLogin={setUser} />}
    </div>
  )
}

export default App;
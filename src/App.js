import Header from "./components/Header";
import Login from "./components/Login";
import { useState } from "react";

function App() {

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
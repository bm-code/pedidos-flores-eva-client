import Agenda from "./components/Agenda";
import { useState, useEffect } from "react";
import Header from "./components/Header";

function App() {
  useEffect(() => {
    let isMounted = true;
    fetch('http://localhost:5500/api/orders')
      .then(res => res.json())
      .then(data => {
        if (isMounted) setPedidos(data)
      })
    return () => { isMounted = false };
  }, [])

  const [pedidosActual, setPedidos] = useState([]);


  if (pedidosActual === []) {
    return <div class="spinner-grow" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  } else {
    return (
      <div className="container py-5">
        <Header />
        <div className="row">
          {pedidosActual !== [] ? <Agenda pedidos={pedidosActual} setPedidos={setPedidos} /> : <div class="spinner-grow" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>}
        </div>
      </div>
    );
  }
}

export default App;
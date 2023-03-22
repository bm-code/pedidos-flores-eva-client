import React from 'react';
import { useState } from 'react';
import axios from 'axios';

export default function Login({ login, setLogin }) {
  const initialState = {
    username: '',
    password: ''
  }
  // const [login, setLogin] = useState({
  //   name: null,
  //   username: null,
  //   email: null
  // });
  const [user, setUser] = useState(initialState);
  const [form, setForm] = useState(initialState);

  function handleInput(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function submit(event) {
    setUser(form);
    event.preventDefault();

    // Realizamos el GET a la base de datos
    axios.get('https://pedidos-server.up.railway.app/api/login', {
      params: {
        username: user.username,
        password: user.password
      }
    }
    ).then(response => {
      if (response.data !== '' && response.data.name !== null) {
        setLogin({
          name: response.data.name,
          username: response.data.username,
          email: response.data.email
        })
        sessionStorage.setItem('name', login.name)
        sessionStorage.setItem('username', login.username)
        sessionStorage.setItem('email', login.email)
      } else {
        console.log('error en el login');
      }
    })
      .catch(err => {
        console.log("Error: ", err);
      });
  }

  return (
    <>
      <div className="login-page p-3 d-flex justify-content-center align-items-center flex-column h-100">
        <h2 className="mb-3">Iniciar sesión</h2>
        <form onSubmit={submit}>
          <input name='username' onChange={handleInput} type="text" className="form-control mb-3" id="username" placeholder="Tu nombre de usuario" value={form.username} />
          <input name='password' onChange={handleInput} type="password" className="form-control mb-3" id="password" placeholder="Tu contraseña" value={form.password} />
          <button type='submit' className="btn btn-primary">Iniciar sesión</button>
        </form>
      </div>
    </>
  )
}

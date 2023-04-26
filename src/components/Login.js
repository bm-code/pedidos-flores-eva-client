import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import logo from '../assets/logo.svg'

export default function Login({ login, setLogin }) {

  const initialState = {
    username: '',
    password: ''
  }

  const [datos, setDatos] = useState(initialState)
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState(false);

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    let newDatos = { ...datos, [name]: value }
    setDatos(newDatos);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (datos.username === '' || datos.password === '') {
      console.log('No enviar');
    } else {
      await axios.post('https://flores-eva-server.onrender.com/api/login', datos)
        .then(function (response) {
          if (response.status === 401) {
            setLoginError(true);
          } else {
            setLoading(false);
            setLogin({
              name: response.data.name,
              username: response.data.username,
              email: response.data.email
            });
            sessionStorage.setItem('name', JSON.stringify(login.name))
            sessionStorage.setItem('username', JSON.stringify(login.username))
            sessionStorage.setItem('email', JSON.stringify(login.email))
          }
        })
        .catch(function (error) {
          console.log(error);
          setLoginError(true);
        });
    }
  }

  return (
    <>
      <div className="login-page p-3 d-flex justify-content-center align-items-center flex-column h-100">
        <img className='mb-3' src={logo} alt="Logo de Flores Eva" />
        <h2 className="mb-3">Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
          <input required name='username' onChange={handleInputChange} type="text" className="form-control mb-3" id="username" placeholder="Tu nombre de usuario" value={datos.username} />
          <input required name='password' onChange={handleInputChange} type="password" className="form-control mb-3" id="password" placeholder="Tu contraseña" value={datos.password} />

          {loginError ?
            <div className="alert alert-danger" role="alert">
              Usuario o contraseña erróneos.
            </div>
            : null}

          <button type='submit' className="btn btn-primary">Iniciar sesión</button>
        </form>
        {loading &&
          <div className="spinner-grow mt-5" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>}
      </div>
    </>
  )
}

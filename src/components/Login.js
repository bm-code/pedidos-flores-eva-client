import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import logo from '../assets/logo.svg'

export default function Login({ login, setLogin }) {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState(false);

  const handleUsernameChange = event => {
    setUsername(event.target.value);
  }
  const handlePasswordChange = event => {
    setPassword(event.target.value);
  }

  const handleSubmit = async event => {
    setLoading(true);
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:5500/api/login', {
        username,
        password,
      });
      setLoginError(false);
      setLoading(false)
      localStorage.setItem('username', response.data.username);
      localStorage.setItem('name', response.data.name);
      localStorage.setItem('email', response.data.email);
      setTimeout(() => {
        window.location.reload();
      }, 1000)
    } catch (error) {
      console.log(error);
      setLoginError(true);
      setLoading(false)
    }
  }


  return (
    <>
      <div className="login-page p-3 d-flex justify-content-center align-items-center flex-column h-100">
        <img className='mb-3' src={logo} alt="Logo de Flores Eva" />
        <h2 className="mb-3">Iniciar sesión</h2>
        {/* <form onSubmit={handleSubmit}>
          <input required name='username' onChange={handleInputChange} type="text" className="form-control mb-3" id="username" placeholder="Tu nombre de usuario" value={datos.username} />
          <input required name='password' onChange={handleInputChange} type="password" className="form-control mb-3" id="password" placeholder="Tu contraseña" value={datos.password} />

          {loginError ?
            <div className="alert alert-danger" role="alert">
              Usuario o contraseña erróneos.
            </div>
            : null}

          <button type='submit' className="btn btn-primary">Iniciar sesión</button>
        </form> */}

        <form onSubmit={handleSubmit}>
          <input required name='username' onChange={handleUsernameChange} type="text" className="form-control mb-3" id="username" placeholder="Tu nombre de usuario" value={username} />
          <input required name='password' onChange={handlePasswordChange} type="password" className="form-control mb-3" id="password" placeholder="Tu contraseña" value={password} />
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

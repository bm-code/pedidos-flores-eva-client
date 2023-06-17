import React from 'react';
import Formulario from "./Formulario";
import Agenda from "./Agenda"
import { useState } from 'react';
import {
    BrowserRouter as Router,
    NavLink,
    Route,
    Routes
} from "react-router-dom";
import AgendaCoronas from './AgendaCoronas';
import Plantas from './Plantas';
import './Header.css'
import ShopSelector from './ShopSelector';

export default function Header() {
    const [pedidosActual, setPedidos] = useState([]);
    const location = window.location.pathname;


    return (
        <>
            <Router>
                <header className="row">
                    <nav className="navbar fixed-top navbar-light bg-light" id='navbarDropdownMenuLink' role="button" data-bs-toggle="dropdown" aria-expanded="false">

                        <div className="container">
                            <ul className="nav nav-pills col-12 col-sm-8 justify-content-center justify-content-sm-start">
                                <li className="nav-item">
                                    <NavLink to='/pedidos' className="pedidos-link nav-link" >Pedidos</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to='/coronas' className="coronas-link nav-link">Coronas</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to='/plantas' className="coronas-link nav-link">Plantas</NavLink>
                                </li>

                            </ul>
                            <button style={{ height: "fit-content" }} type="button" className="btn btn-primary col-4 d-none d-md-block" data-toggle="modal" data-target="#registerOrderModal">
                                {location === '/pedidos' &&
                                    ' Registrar nuevo pedido'}
                                {location === '/coronas' &&
                                    ' Registrar nueva corona'}
                                {location === '/plantas' &&
                                    ' Registrar nuevo encargo de plantas'}
                            </button>
                            <button type="button" className="btn btn-primary d-md-none col-3 fixed-button" data-toggle="modal" data-target="#registerOrderModal">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
                                </svg>
                            </button>
                        </div>

                    </nav>
                    <div className="modal fade" id="registerOrderModal" tabIndex="-1" role="dialog" aria-labelledby="registerOrderModalLabel" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="registerOrderModalLabel">Registrar nuevo pedido</h5>
                                    <button type="button" className="btn close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <Formulario setPedidos={setPedidos} pedidosActual={pedidosActual} />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <Routes>
                    <Route exact activeClassName="active" path="/home" element={<ShopSelector />} />

                    <Route exact activeClassName="active-route" path="/pedidos" element={<Agenda pedidos={pedidosActual} setPedidos={setPedidos} title='Pedidos' orderType='pedido' />} />
                    <Route exact activeClassName="active-route" path="/coronas" element={<AgendaCoronas pedidos={pedidosActual} setPedidos={setPedidos} title='Coronas' orderType='corona' />} />
                    <Route exact activeClassName="active-route" path="/plantas" element={<Plantas pedidos={pedidosActual} setPedidos={setPedidos} title='Plantas' orderType='plantas' />} />
                </Routes>
            </Router>
        </>
    )
}

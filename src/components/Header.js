import React from 'react';
import Formulario from "./Formulario";
import { useState } from 'react';


export default function Header() {
    const [pedidosActual, setPedidos] = useState([]);

    return (
        <>
            <header className="row">
                <ul className="nav nav-tabs mb-4 col-12 col-sm-10 justify-content-center justify-content-sm-start">
                    <li className="nav-item">
                        <button className="nav-link active" >Pedidos</button>
                    </li>
                    <li className="nav-item">
                        <button className="nav-link">Funerarios</button>
                    </li>
                </ul>
                <button type="button" className="btn btn-primary col-2 d-none d-md-block" data-toggle="modal" data-target="#registerOrderModal">
                    Registrar nuevo pedido
                </button>
                <button type="button" className="btn btn-primary d-md-none col-3 fixed-button" data-toggle="modal" data-target="#registerOrderModal">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
                    </svg>
                </button>
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

        </>
    )
}

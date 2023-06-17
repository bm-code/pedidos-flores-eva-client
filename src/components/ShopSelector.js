import React from 'react'
import { useState } from 'react'
import barrio from '../assets/barrio.jpeg'
import centro from '../assets/centro.jpeg'
import './ShopSelector.css'

export default function ShopSelector() {

    const [selectedBarrio, setSelectedBarrio] = useState(false);
    const [selectedCentro, setSelectedCentro] = useState(false);
    const [active, setActive] = useState(false);
    const [shop, setShop] = useState('')

    const selectShop = event => {
        localStorage.setItem('shop', event.currentTarget.id)
        setShop(event.currentTarget.id);
        event.currentTarget.id === 'barrio' ? setSelectedBarrio(true) : setSelectedBarrio(false);
        event.currentTarget.id === 'centro' ? setSelectedCentro(true) : setSelectedCentro(false);
        localStorage.getItem('shop') ? setActive(true) : setActive(false)
    }

    const goToOrderList = () => {
        if (shop !== '') window.location.href = '/pedidos';
    }

    return (
        <>
            <h2 className='text-center'>Selecciona la tienda a la que asignar los pedidos</h2>

            <div className="container d-flex justify-content-center mt-5 mb-3">
                <div onClick={selectShop} id="barrio" className={selectedBarrio ? 'selected card mx-3' : 'card mx-3'} style={{ width: '18rem', zIndex: '999', cursor: 'pointer' }}>
                    <img src={barrio} className="card-img-top" alt="..." />
                    <div className="card-body">
                        <p className="card-text">Tienda Barrio</p>
                    </div>
                </div>
                <div onClick={selectShop} id="centro" className={selectedCentro ? 'selected card mx-3' : 'card mx-3'} style={{ width: '18rem', zIndex: '999', cursor: 'pointer' }}>
                    <img src={centro} className="card-img-top" alt="..." />
                    <div className="card-body">
                        <p className="card-text">Tienda Centro</p>
                    </div>
                </div>
            </div>
            <div className="container d-flex justify-content-center">
                {active &&
                    <button onClick={goToOrderList} type="button" className="btn btn-primary">Aceptar</button>
                }
                {!active &&
                    <button disabled type="button" className="btn btn-primary">Aceptar</button>
                }
            </div>

        </>
    )
}

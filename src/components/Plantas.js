import React from 'react'
import Agenda from './Agenda'

export default function Plantas({ pedidos, setPedidos, title, orderType, shop }) {
    return (
        <>
            <Agenda pedidos={pedidos} setPedidos={setPedidos} title={title} orderType={orderType} shop={shop} />
        </>
    )
}

import React from 'react'
import Agenda from './Agenda'

export default function AgendaCoronas({ pedidos, setPedidos, title, orderType }) {
    return (
        <>
            <Agenda pedidos={pedidos} setPedidos={setPedidos} title={title} orderType={orderType} />
        </>
    )
}

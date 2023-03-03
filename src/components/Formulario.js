import { useState } from "react";
import axios from 'axios';

export default function Formulario({ setPedidos }) {

    const initialState = {
        orderType: '',
        createDate: '',
        deliveryDate: '',
        receiverName: '',
        address: '',
        phone: '',
        product: '',
        clientName: '',
        clientPhone: '',
        comment: '',
        completed: false,
    }
    const [form, setForm] = useState(initialState);

    function handleInput(event) {
        event.target.value ? setForm({ ...form, [event.target.name]: event.target.value }) : setForm({ ...form, [event.target.name]: event.target.id })
    }

    function registrarPedido(event) {
        event.preventDefault();

        if (form.name !== '' && form.phone !== '' && form.address !== '') {
            form.createDate = new Date().toLocaleString() + ""
            form.deliveryDate = form.deliveryDate.toLocaleString() + ""
            setForm(initialState);
            console.log(form);
            setPedidos(pedidosActual => [...pedidosActual, form]);

            // Realizamos el POST a la base de datos
            axios.post('http://localhost:5500/api/orders', form)
                .then(response => {
                    console.log(response);
                })
                .catch(err => {
                    console.log(err);
                });
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } else {
            alert('Rellena todos los datos')
        }
    }

    return (
        // <div className="col-12 col-md-4 p-3 bg-light rounded">
        <div className="col-12 bg-light rounded">
            {/* <h2 className="mb-3">Registrar nuevo pedido</h2> */}
            <form onSubmit={registrarPedido}>

                <div className="form-check">
                    <input onChange={handleInput} className="form-check-input" type="radio" name="orderType" id="pedido" value='pedido' />
                    <label className="form-check-label" htmlFor="pedido">
                        Pedido normal
                    </label>
                </div>
                <div className="form-check">
                    <input onChange={handleInput} className="form-check-input" type="radio" name="orderType" id="corona" value='corona' />
                    <label className="form-check-label" htmlFor="corona" >
                        Corona
                    </label>
                </div >

                <input type="date" className="form-control mb-3" name='deliveryDate' value={form.deliveryDate} placeholder="Fecha de entrega" onChange={handleInput} />

                <input type="text" className="form-control mb-3" name='receiverName' value={form.receiverName} placeholder="Nombre del destinatario" onChange={handleInput} />

                <input type="text" className="form-control mb-3" name='address' value={form.address} placeholder="Dirección de entrega" onChange={handleInput} />

                <input type="number" className="form-control mb-3" name='phone' value={form.phone} placeholder="Introduce el teléfono" onChange={handleInput} />

                <input type="text" className="form-control mb-3" name='product' value={form.product} placeholder="Producto" onChange={handleInput} />

                <input type="text" className="form-control mb-3" name='clientName' value={form.clientName} placeholder="Nombre del cliente" onChange={handleInput} />

                <input type="number" className="form-control mb-3" name='clientPhone' value={form.clientPhone} placeholder="Teléfono del cliente" onChange={handleInput} />

                <textarea onChange={handleInput} className="form-control mb-3" name="comment" value={form.comment} placeholder="Comentarios del pedido" cols="30" rows="3"></textarea>

                <button type="submit" className="btn btn-success">Registrar pedido</button>
            </form >
        </div >
    )
}
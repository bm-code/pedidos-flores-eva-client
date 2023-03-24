import { useState } from "react";
import axios from 'axios';
import { useLocation } from "react-router-dom";

export default function Formulario({ setPedidos }) {
    const location = useLocation().pathname;
    let currentOrderType;
    if (location === '/') {
        currentOrderType = 'pedido'
    } else if (location === '/coronas') {
        currentOrderType = 'corona'
    } else {
        currentOrderType = 'plantas'
    }

    const initialState = {
        orderType: currentOrderType,
        createDate: '',
        deliveryDate: '',
        receiverName: '',
        customerType: '',
        address: '',
        phone: '',
        product: '',
        productDetails: '',
        clientName: '',
        clientPhone: '',
        comment: '',
        completed: false,
        paid: false
    }
    const [form, setForm] = useState(initialState);

    function handleInput(event) {
        event.target.value ? setForm({ ...form, [event.target.name]: event.target.value }) : setForm({ ...form, [event.target.name]: event.target.id })
    }

    function registrarPedido(event) {
        event.preventDefault();

        if (form.deliveryDate !== '') {
            form.orderType = currentOrderType;
            form.createDate = new Date().toLocaleString() + ""
            form.deliveryDate = form.deliveryDate.toLocaleString() + ""
            setForm(initialState);
            console.log(form);
            setPedidos(pedidosActual => [...pedidosActual, form]);

            // Realizamos el POST a la base de datos
            axios.post('https://pedidos-server.up.railway.app/api/orders', form)
                .then(response => {
                    console.log(response);
                })
                .catch(err => {
                    console.log(err);
                });
            // setTimeout(() => {
            //     window.location.reload();
            // }, 200);

            axios.post('https://pedidos-server.up.railway.app/new-order', JSON.stringify({
                message: `${form.orderType} creado para ${form.receiverName}`
            })
                ,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
        } else {
            alert('La fecha de entrega es obligatoria')
        }
    }

    if (currentOrderType === 'plantas') {
        return (
            <div className="col-12 bg-light rounded">
                {/* <h2 className="mb-3">Registrar nuevo pedido</h2> */}
                <form onSubmit={registrarPedido}>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="orderType" id="plantas" value='plantas' checked readOnly />
                        <label style={{ fontSize: '18px' }} className="form-check-label" htmlFor="plantas" >
                            Encargo de plantas
                        </label>
                    </div >

                    <input type="date" className="form-control mb-3" name='deliveryDate' value={form.deliveryDate} placeholder="Fecha de entrega" onChange={handleInput} />

                    <input type="text" className="form-control mb-3" name='product' value={form.product} placeholder="Tipo de planta" onChange={handleInput} />

                    <input type="number" className="form-control mb-3" name='productDetails' value={form.productDetails} placeholder="Cantidad" onChange={handleInput} />

                    <input type="text" className="form-control mb-3" name='clientName' value={form.clientName} placeholder="Nombre del cliente" onChange={handleInput} />

                    <input type="number" className="form-control mb-3" name='clientPhone' value={form.clientPhone} placeholder="Teléfono del cliente" onChange={handleInput} />

                    <div className="form-check">
                        <input onChange={handleInput} className="form-check-input" type="radio" name="paid" id="pedido-no-pagado" value={false} />
                        <label className="form-check-label" htmlFor="pedido-no-pagado">
                            No pagado
                        </label>
                    </div>
                    <div className="form-check">
                        <input onChange={handleInput} className="form-check-input" type="radio" name="paid" id="pedido-pagado" value={true} />
                        <label className="form-check-label" htmlFor="pedido-pagado" >
                            Pagado
                        </label>
                    </div>

                    <textarea onChange={handleInput} className="form-control mb-3" name="comment" value={form.comment} placeholder="Comentarios del pedido" cols="30" rows="3"></textarea>

                    <button type="submit" className="btn btn-success">Registrar pedido</button>
                </form >
            </div >
        )
    } else if (currentOrderType === 'pedido') {
        return (
            <div className="col-12 bg-light rounded">
                {/* <h2 className="mb-3">Registrar nuevo pedido</h2> */}
                <form onSubmit={registrarPedido}>

                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="orderType" id="pedido" value='pedido' checked readOnly />
                        <label style={{ fontSize: '18px' }} className="form-check-label" htmlFor="pedido">
                            Pedido normal
                        </label>
                    </div>

                    <input type="date" className="form-control mb-3" name='deliveryDate' value={form.deliveryDate} placeholder="Fecha de entrega" onChange={handleInput} />

                    <input type="text" className="form-control mb-3" name='receiverName' value={form.receiverName} placeholder="Nombre del destinatario" onChange={handleInput} />

                    <input type="text" className="form-control mb-3" name='address' value={form.address} placeholder="Dirección de entrega" onChange={handleInput} />

                    <input type="number" className="form-control mb-3" name='phone' value={form.phone} placeholder="Teléfono del destinatario" onChange={handleInput} />

                    <input type="text" className="form-control mb-3" name='product' value={form.product} placeholder="Producto" onChange={handleInput} />

                    <input type="text" className="form-control mb-3" name='clientName' value={form.clientName} placeholder="Nombre del cliente" onChange={handleInput} />

                    <input type="number" className="form-control mb-3" name='clientPhone' value={form.clientPhone} placeholder="Teléfono del cliente" onChange={handleInput} />

                    <div className="form-check">
                        <input onChange={handleInput} className="form-check-input" type="radio" name="paid" id="pedido-no-pagado" value={false} />
                        <label className="form-check-label" htmlFor="pedido-no-pagado">
                            No pagado
                        </label>
                    </div>
                    <div className="form-check">
                        <input onChange={handleInput} className="form-check-input" type="radio" name="paid" id="pedido-pagado" value={true} />
                        <label className="form-check-label" htmlFor="pedido-pagado" >
                            Pagado
                        </label>
                    </div >

                    <textarea onChange={handleInput} className="form-control mb-3" name="comment" value={form.comment} placeholder="Comentarios del pedido" cols="30" rows="3"></textarea>

                    <button type="submit" className="btn btn-success">Registrar pedido</button>
                </form >
            </div >
        )
    }


    else {
        return (
            // <div className="col-12 col-md-4 p-3 bg-light rounded">
            <div className="col-12 bg-light rounded">
                {/* <h2 className="mb-3">Registrar nuevo pedido</h2> */}
                <form onSubmit={registrarPedido}>

                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="orderType" id="corona" value='corona' checked readOnly />
                        <label style={{ fontSize: '18px' }} className="form-check-label" htmlFor="corona" >
                            Corona
                        </label>
                    </div >

                    <input type="date" className="form-control mb-3" name='deliveryDate' value={form.deliveryDate} placeholder="Fecha de entrega" onChange={handleInput} />

                    <input type="text" className="form-control mb-3" name='receiverName' value={form.receiverName} placeholder="Nombre del difunto" onChange={handleInput} />

                    <input type="text" className="form-control mb-3" name='customerType' value={form.customerType} placeholder="Encarga particular/tanatorio" onChange={handleInput} />

                    <input type="text" className="form-control mb-3" name='address' value={form.address} placeholder="Nombre del tanatorio" onChange={handleInput} />

                    <input type="number" className="form-control mb-3" name='phone' value={form.phone} placeholder="Teléfono de contacto en el tanatorio" onChange={handleInput} />

                    <input type="text" className="form-control mb-3" name='product' value={form.product} placeholder="Producto" onChange={handleInput} />

                    <input type="text" className="form-control mb-3" name='productDetails' value={form.productDetails} placeholder="Detalles del producto (Mensaje en cinta)" onChange={handleInput} />

                    <input type="text" className="form-control mb-3" name='clientName' value={form.clientName} placeholder="Nombre del cliente" onChange={handleInput} />

                    <input type="number" className="form-control mb-3" name='clientPhone' value={form.clientPhone} placeholder="Teléfono del cliente" onChange={handleInput} />

                    <div className="form-check">
                        <input onChange={handleInput} className="form-check-input" type="radio" name="paid" id="pedido-no-pagado" value={false} />
                        <label className="form-check-label" htmlFor="pedido-no-pagado">
                            No pagado
                        </label>
                    </div>
                    <div className="form-check">
                        <input onChange={handleInput} className="form-check-input" type="radio" name="paid" id="pedido-pagado" value={true} />
                        <label className="form-check-label" htmlFor="pedido-pagado" >
                            Pagado
                        </label>
                    </div >

                    <textarea onChange={handleInput} className="form-control mb-3" name="comment" value={form.comment} placeholder="Comentarios del pedido" cols="30" rows="3"></textarea>

                    <button type="submit" className="btn btn-success">Registrar pedido</button>
                </form >
            </div >
        )
    }
}
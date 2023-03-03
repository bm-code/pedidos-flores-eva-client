import Search from "./Search";
import { useState, useEffect } from "react";
import axios from "axios";


export default function Agenda({ pedidos, setPedidos, title, orderType }) {

    // Toggle complete
    const toggleCompleted = function (id) {
        const newPedidos = [...pedidos];
        const index = newPedidos.findIndex(element => element._id === id);
        newPedidos[index].completed = !newPedidos[index].completed;

        setPedidos(newPedidos);
        // Realizamos el POST a la base de datos
        axios.post('http://localhost:5500/api/actualizar', newPedidos[index])
            .then(response => {
                console.log(response);
            })
            .catch(err => {
                console.log(err);
            });
    }

    // Formatear fecha
    const formatDateToUser = (date) => {
        const separatedDate = date.split('-');
        const year = separatedDate[0];
        const month = separatedDate[1];
        const day = separatedDate[2].slice(0, 2);
        const formattedDate = `${day}-${month}-${year}`
        return formattedDate;
    }

    const formatDateToSystem = (date) => {
        const replace = date.replaceAll('/', '-')
        const separatedDate = replace.split('-');
        const year = separatedDate[0];
        const month = separatedDate[1]
        const day = separatedDate[2]
        const formattedDate = `${year}-${month}-${day}`
        return formattedDate;
    }

    // Mostrar pedidos completados
    const [showCompleted, setShowCompleted] = useState(false);

    // Buscador
    const [term, setTerm] = useState('');
    const searchingTerm = (term) => {
        return function (name) {
            return name.clientName.toLowerCase().includes(term) || !term;
        }
    }

    // Formatear Nº pedido
    const [showFullOrderNumber, setShowFullOrderNumber] = useState(false)
    const formatOrderNumber = (id) => {
        if (id) {
            return showFullOrderNumber ? id : id.substring(18);
        }
    }

    // Edidtar pedido
    const [selected, setSelected] = useState('');

    const selectedOrder = pedidos.findIndex(element => element._id === selected);
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
        delete: false
    }
    const [form, setForm] = useState(initialState);

    function setOrderDetails() {
        const success = document.querySelector('.alert');
        setForm({
            orderType: pedidos[selectedOrder]?.orderType,
            createDate: formatDateToSystem(pedidos[selectedOrder]?.createDate.substring(0, 9)),
            deliveryDate: formatDateToSystem(pedidos[selectedOrder]?.deliveryDate).substring(0, 10),
            receiverName: pedidos[selectedOrder]?.receiverName,
            address: pedidos[selectedOrder]?.address,
            phone: pedidos[selectedOrder]?.phone,
            product: pedidos[selectedOrder]?.product,
            clientName: pedidos[selectedOrder]?.clientName,
            clientPhone: pedidos[selectedOrder]?.clientPhone,
            comment: pedidos[selectedOrder]?.comment,
            completed: pedidos[selectedOrder]?.completed,
            delete: pedidos[selectedOrder]?.delete
        });
        success.classList.add('d-none')
    }

    function handleInput(event) {
        setForm({ ...form, [event.target.name]: event.target.value });
    }

    function editarPedido(event) {
        const success = document.querySelector('.alert');
        event.preventDefault();
        // Realizamos el POST a la base de datos
        const newPedidos = [...pedidos];
        const id = pedidos[selectedOrder]._id;
        const index = newPedidos.findIndex(element => element._id === id);
        form.createDate = new Date().toLocaleString() + ""
        newPedidos[index]._id = id
        newPedidos[index].orderType = form.orderType;
        // newPedidos[index].createDate = form.createDate;
        newPedidos[index].deliveryDate = form.deliveryDate;
        newPedidos[index].receiverName = form.receiverName;
        newPedidos[index].address = form.address;
        newPedidos[index].phone = form.phone;
        newPedidos[index].product = form.product;
        newPedidos[index].clientName = form.clientName;
        newPedidos[index].clientPhone = form.clientPhone;
        newPedidos[index].comment = form.comment;
        newPedidos[index].completed = form.completed;
        newPedidos[index].delete = form.delete;
        if (newPedidos[index].deliveryDate) {
            setPedidos(newPedidos)
            axios.post('http://localhost:5500/api/editar', newPedidos[index])
                .then(response => {
                    console.log(response);
                })
                .catch(err => {
                    console.log(err);
                });
            success.classList.replace('d-none', 'alert-success');
        } else {
            alert('Debes seleccionar la fecha de entrega');
        }
    }

    const deleteOrder = (event) => {
        event.preventDefault();
        const newPedidos = [...pedidos];
        const id = pedidos[selectedOrder]._id;
        const index = newPedidos.findIndex(element => element._id === id);
        newPedidos[index]._id = id;

        const confirm = window.confirm(`¿Seguro que quieres eliminar el pedido nº ${formatOrderNumber(newPedidos[index]._id)}? Esta acción es irreversible.`);

        if (confirm) {
            newPedidos[index].delete = true;
            setPedidos(newPedidos);
            // Realizamos el POST a la base de datos
            axios.post('http://localhost:5500/api/borrar', newPedidos[index])
                .then(response => {
                    console.log(response);
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }

    const printOrder = (id) => {
        const printable = document.getElementById(`${id}print`).innerHTML;
        const page = document.body.innerHTML;
        document.body.innerHTML = printable;
        document.querySelectorAll('.dropdown-menu').forEach(element => {
            element.style.display = 'none';
        });
        window.print();
        document.body.innerHTML = page;
        document.querySelectorAll('.dropdown-menu').forEach(element => {
            element.style.display = 'auto';
        });
    }

    useEffect(() => {
        let isMounted = true;
        fetch('http://localhost:5500/api/orders')
            .then(res => res.json())
            .then(data => {
                if (isMounted) setPedidos(data)
            })
        return () => { isMounted = false };
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    if (pedidos.length === 0) {
        return <div className="spinner-grow" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    } else {
        return (
            <>
                {/* modal editar pedido */}
                <div className="modal fade" id="editOrderModal" tabIndex="-1" aria-labelledby="editOrderModal" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="editOrderModal">Editar pedido</h5>
                                <button type="button" className="btn close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={editarPedido}>
                                    <input type="date" className="form-control mb-3" name='deliveryDate' value={form.deliveryDate} placeholder="Fecha de entrega" onChange={handleInput} />

                                    <input type="text" className="form-control mb-3" name='receiverName' value={form.receiverName} placeholder="Nombre del destinatario" onChange={handleInput} />

                                    <input type="text" className="form-control mb-3" name='address' value={form.address} placeholder="Dirección de entrega" onChange={handleInput} />

                                    <input type="number" className="form-control mb-3" name='phone' value={form.phone} placeholder="Introduce el teléfono" onChange={handleInput} />

                                    <input type="text" className="form-control mb-3" name='product' value={form.product} placeholder="Producto" onChange={handleInput} />

                                    <input type="text" className="form-control mb-3" name='clientName' value={form.clientName} placeholder="Nombre del cliente" onChange={handleInput} />

                                    <input type="number" className="form-control mb-3" name='clientPhone' value={form.clientPhone} placeholder="Teléfono del cliente" onChange={handleInput} />

                                    <textarea onChange={handleInput} className="form-control mb-3" name="comment" value={form.comment} placeholder="Comentarios del pedido" cols="30" rows="10"></textarea>

                                    <div className="alert d-none" role="alert">
                                        ¡Pedido editado correctamente!
                                    </div>
                                    <button aria-label="Close" type="submit" className="btn btn-success close">Editar pedido</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                {/* modal editar pedido */}
                <div className="row col-12 m-auto" style={{ 'height': 'fit-content' }}>
                    <h2 className="mb-3">{title} pendientes</h2>
                    <Search term={term} setTerm={setTerm} />
                    {
                        pedidos.filter(pedido => !pedido.delete).filter(searchingTerm(term)).filter(pedido => pedido.completed === false).filter(pedido => pedido.orderType === orderType).map(({ orderType, deliveryDate, receiverName, phone, address, comment, product, clientName, clientPhone, completed, _id }, index) => {
                            return <ul id={_id + 'print'} key={_id} className="list-group col-xl-4 col-lg-4 col-md-6 mb-3 p-0 p-md-1 p-lg-2">
                                <li className="list-group-item active">
                                    <b style={{ cursor: "pointer" }} onClick={() => setShowFullOrderNumber(!showFullOrderNumber)}>Pedido Nº</b> {_id ? formatOrderNumber(_id) : ''}


                                    {/* Menu button */}
                                    <div style={{ display: 'inline', marginLeft: '10px' }} className="dropdown">
                                        <button onClick={() => setSelected(_id)} className={`text-white dropdown-toggle btn btn-link`} type="button" data-toggle="dropdown" aria-expanded="false"></button>
                                        <div className="dropdown-menu" >
                                            <button onClick={setOrderDetails} className="dropdown-item" data-toggle="modal" data-target="#editOrderModal">Editar pedido</button>
                                            <button onClick={() => printOrder(_id)} className="dropdown-item" >Imprimir pedido</button>
                                            <button onClick={deleteOrder} className="dropdown-item text-danger" >Borrar pedido</button>
                                        </div>
                                    </div>
                                    {/* ...Menu button */}


                                </li>
                                <li className="list-group-item"><b>Tipo de pedido:</b> {orderType}</li>
                                <li className="list-group-item"><b>Fecha de entrega:</b> {formatDateToUser(deliveryDate)}</li>
                                <li className="list-group-item"><b>Nombre del destinatario:</b> {receiverName}</li>
                                <li className="list-group-item"><b>Dirección de entrega:</b> {address}</li>
                                <li className="list-group-item"><b>Teléfono del destinatario:</b> {phone}</li>
                                <li className="list-group-item"><b>Producto:</b> {product}</li>
                                <li className="list-group-item"><b>Nombre del cliente:</b> {clientName}</li>
                                <li className="list-group-item"><b>Teléfono del cliente:</b> {clientPhone}</li>
                                <li className="list-group-item"><b>Comentarios o notas:</b> {comment}</li>
                                <li className="list-group-item"><b>Estado del pedido: </b>{completed ? 'COMPLETADO' : 'NO COMPLETADO'}</li>
                                <button className="btn btn-success" id={_id} onClick={event => toggleCompleted(event.target.id)}>Marcar como completado</button>
                            </ul>
                        })
                    }


                    <h2 className="mb-3">Pedidos completados</h2>
                    <button className="btn btn-link mb-3" onClick={() => setShowCompleted(!showCompleted)}>{showCompleted ? 'Ocultar pedidos completados' : 'Mostrar pedidos completados'}</button>
                    {
                        pedidos.filter(pedido => !pedido.delete).filter(searchingTerm(term)).filter(pedido => pedido.completed === true).filter(pedido => pedido.orderType === orderType).map(({ orderType, deliveryDate, receiverName, phone, address, comment, product, clientName, clientPhone, completed, _id }, index) => {
                            return <div className="col-12">
                                {
                                    showCompleted ? <ul id={_id + 'print'} key={_id} className="list-group col-xl-4 col-lg-4 col-md-6 mb-3 p-0 p-md-1 p-lg-2">
                                        <li className="list-group-item active">
                                            <b style={{ cursor: "pointer" }} onClick={() => setShowFullOrderNumber(!showFullOrderNumber)}>Pedido Nº</b> {_id ? formatOrderNumber(_id) : ''}


                                            {/* Menu button */}
                                            <div style={{ display: 'inline', marginLeft: '10px' }} className="dropdown">
                                                <button onClick={() => setSelected(_id)} className={`text-white dropdown-toggle btn btn-link`} type="button" data-toggle="dropdown" aria-expanded="false"></button>
                                                <div className="dropdown-menu" >
                                                    <button onClick={setOrderDetails} className="dropdown-item" data-toggle="modal" data-target="#editOrderModal">Editar pedido</button>
                                                    <button onClick={() => printOrder(_id)} className="dropdown-item" >Imprimir pedido</button>
                                                    <button onClick={deleteOrder} className="dropdown-item text-danger" >Borrar pedido</button>
                                                </div>
                                            </div>
                                            {/* ...Menu button */}


                                        </li>
                                        <li className="list-group-item"><b>Tipo de pedido:</b> {orderType}</li>
                                        <li className="list-group-item"><b>Fecha de entrega:</b> {formatDateToUser(deliveryDate)}</li>
                                        <li className="list-group-item"><b>Nombre del destinatario:</b> {receiverName}</li>
                                        <li className="list-group-item"><b>Dirección de entrega:</b> {address}</li>
                                        <li className="list-group-item"><b>Teléfono del destinatario:</b> {phone}</li>
                                        <li className="list-group-item"><b>Producto:</b> {product}</li>
                                        <li className="list-group-item"><b>Nombre del cliente:</b> {clientName}</li>
                                        <li className="list-group-item"><b>Teléfono del cliente:</b> {clientPhone}</li>
                                        <li className="list-group-item"><b>Comentarios o notas:</b> {comment}</li>
                                        <li className="list-group-item"><b>Estado del pedido: </b>{completed ? 'COMPLETADO' : 'NO COMPLETADO'}</li>
                                        <button className="btn btn-danger" id={_id} onClick={event => toggleCompleted(event.target.id)}>Desmarcar como completado</button>
                                    </ul> : ''
                                }
                            </div>
                        })
                    }
                </div>
            </>
        )
    }
}
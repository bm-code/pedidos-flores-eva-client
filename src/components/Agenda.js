import Search from "./Search";
import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function Agenda({ pedidos, setPedidos, title, orderType, shop }) {

    const location = useLocation().pathname;
    let currentOrderType;
    if (location === '/pedidos') {
        currentOrderType = 'pedido'
    } else if (location === '/coronas') {
        currentOrderType = 'corona'
    } else {
        currentOrderType = 'plantas'
    }

    const user = localStorage.getItem('name');

    // Toggle complete
    const toggleCompleted = function (id) {
        const newPedidos = [...pedidos];
        const index = newPedidos.findIndex(element => element._id === id);
        newPedidos[index].completed = !newPedidos[index].completed;

        setPedidos(newPedidos);
        // Realizamos el POST a la base de datos
        axios.post('https://flores-eva-server.onrender.com/api/actualizar', newPedidos[index])
            .then(response => {
                console.log(response);
            })
            .catch(err => {
                console.log(err);
            });
    }

    // Formatear fecha
    const formatDateToUser = (date) => {
        const separatedDate = date ? date?.split('-') : (new Date().toLocaleString + "");
        // const separatedDate = date?.split('-');
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
        delete: false,
        shop: '',
        paid: false
    }
    const [form, setForm] = useState(initialState);

    function setOrderDetails() {
        const success = document.querySelector('.alert');
        setForm({
            orderType: pedidos[selectedOrder]?.orderType,
            createDate: formatDateToSystem(pedidos[selectedOrder]?.createDate.substring(0, 9)),
            deliveryDate: formatDateToSystem(pedidos[selectedOrder]?.deliveryDate).substring(0, 10),
            receiverName: pedidos[selectedOrder]?.receiverName,
            customerType: pedidos[selectedOrder]?.customerType,
            address: pedidos[selectedOrder]?.address,
            phone: pedidos[selectedOrder]?.phone,
            product: pedidos[selectedOrder]?.product,
            productDetails: pedidos[selectedOrder]?.productDetails,
            clientName: pedidos[selectedOrder]?.clientName,
            clientPhone: pedidos[selectedOrder]?.clientPhone,
            comment: pedidos[selectedOrder]?.comment,
            completed: pedidos[selectedOrder]?.completed,
            delete: pedidos[selectedOrder]?.delete,
            shop: pedidos[selectedOrder]?.shop,
            paid: pedidos[selectedOrder]?.paid
        });
        success.classList.add('d-none')
    }

    function handleInput(event) {
        event.target.value ? setForm({ ...form, [event.target.name]: event.target.value }) : setForm({ ...form, [event.target.name]: event.target.id })
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
        newPedidos[index].customerType = form.customerType;
        newPedidos[index].address = form.address;
        newPedidos[index].phone = form.phone;
        newPedidos[index].product = form.product;
        newPedidos[index].productDetails = form.productDetails;
        newPedidos[index].clientName = form.clientName;
        newPedidos[index].clientPhone = form.clientPhone;
        newPedidos[index].comment = form.comment;
        newPedidos[index].completed = form.completed;
        newPedidos[index].delete = form.delete;
        newPedidos[index].shop = form.shop;
        newPedidos[index].paid = form.paid;
        if (newPedidos[index].deliveryDate) {
            setPedidos(newPedidos)
            axios.post('https://flores-eva-server.onrender.com/api/editar', newPedidos[index])
                .then(response => {
                    console.log(response);
                })
                .catch(err => {
                    console.log(err);
                });
            success.classList.replace('d-none', 'alert-success');
            setTimeout(() => {
                window.location.reload()
            }, 500);
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
            axios.post('https://flores-eva-server.onrender.com/api/borrar', newPedidos[index])
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
        fetch('https://flores-eva-server.onrender.com/api/orders')
            .then(res => res.json())
            .then(data => {
                if (isMounted) {
                    setPedidos(data)
                }
            })
        return () => { isMounted = false };
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // const [sortedByCreateDate, setSortedByCreateDate] = useState(false)
    const [sortedByDeliveryDate, setSortedByDeliveryDate] = useState(false)
    const [sortedByReceiverName, setSortedByReceiverName] = useState(false)

    const sortByDeliveryDateAsc = (arr) => {
        setPedidos(pedidos)
        setSortedByDeliveryDate(true)
        // setSortedByCreateDate(false)
        setSortedByReceiverName(false)
        console.log(sortedByDeliveryDate);
        return setPedidos(arr.slice().sort(function (a, b) {
            if (a.deliveryDate === '' || b.deliveryDate === '') {
                a.deliveryDate = 0;
                b.deliveryDate = 0;
            }
            return a?.deliveryDate < b?.deliveryDate ? -1 : 1;
        }));
    }

    const sortByReceiverName = (arr) => {
        setSortedByDeliveryDate(false)
        // setSortedByCreateDate(false)
        setSortedByReceiverName(true)
        setPedidos(pedidos)
        return setPedidos(arr.slice().sort((a, b) => {
            if (a.receiverName.toLowerCase === '' || b.receiverName.toLowerCase === '') {
                a.receiverName = 'aaa';
                b.receiverName = 'aaa';
            }
            return a?.receiverName.toLowerCase() < b?.receiverName.toLowerCase() ? -1 : 1;
        }));
    }


    if (pedidos.length === 0) {
        return <div className="spinner-grow mt-5" role="status">
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
                                    <div className="form-check">
                                        <input onChange={handleInput} className="form-check-input" type="radio" name="orderType" id="edit-pedido"
                                            value={currentOrderType}
                                            checked readOnly />
                                        <label className="form-check-label" htmlFor="edit-pedido">
                                            {currentOrderType === 'pedido' &&
                                                'Pedido normal'}
                                            {currentOrderType === 'corona' &&
                                                'Corona'}
                                            {currentOrderType === 'plantas' &&
                                                'Encargo de plantas'}
                                        </label>
                                    </div>

                                    <input type="date" className="form-control mb-3" name='deliveryDate' value={form.deliveryDate} placeholder="Fecha de entrega" onChange={handleInput} />

                                    {form.orderType === 'corona' &&
                                        <input type="text" className="form-control mb-3" name='receiverName' value={form.receiverName} placeholder="Nombre del difunto" onChange={handleInput} />
                                    }{form.orderType === 'pedido' &&
                                        <input type="text" className="form-control mb-3" name='receiverName' value={form.receiverName} placeholder="Nombre del destinatario" onChange={handleInput} />}

                                    {form.orderType === 'corona' ? <input type="text" className="form-control mb-3" name='customerType' value={form.customerType} placeholder="Encarga particular/tanatorio" onChange={handleInput} /> : null}

                                    {form.orderType === 'corona' &&
                                        <input type="text" className="form-control mb-3" name='address' value={form.address} placeholder="Nombre del tanatorio" onChange={handleInput} />
                                    }{form.orderType === 'pedido' &&
                                        <input type="text" className="form-control mb-3" name='address' value={form.address} placeholder="Dirección de entrega" onChange={handleInput} />}

                                    {form.orderType === 'corona' &&
                                        <input type="tel" pattern="[0-9]{9}" className="form-control mb-3" name='phone' value={form.phone} placeholder="Teléfono de contacto en el tanatorio" onChange={handleInput} />
                                    }{form.orderType === 'pedido' &&
                                        <input type="tel" pattern="[0-9]{9}" className="form-control mb-3" name='phone' value={form.phone} placeholder="Teléfono del destinatario" onChange={handleInput} />
                                    }

                                    <input type="text" className="form-control mb-3" name='product' value={form.product} placeholder={form.orderType === 'plantas' ? 'Tipo de planta' : 'Producto'} onChange={handleInput} />

                                    {form.orderType === 'corona' &&
                                        <input type="text" className="form-control mb-3" name='productDetails' value={form.productDetails} placeholder="Detalles del producto (Mensaje en cinta)" onChange={handleInput} />
                                    }{form.orderType === 'plantas' &&
                                        <input type="number" className="form-control mb-3" name='productDetails' value={form.productDetails} placeholder="Cantidad" onChange={handleInput} />
                                    }

                                    <input type="text" className="form-control mb-3" name='clientName' value={form.clientName} placeholder="Nombre del cliente" onChange={handleInput} />

                                    <input type="tel" pattern="[0-9]{9}" className="form-control mb-3" name='clientPhone' value={form.clientPhone} placeholder="Teléfono del cliente" onChange={handleInput} />

                                    <div className="form-check">
                                        <input onChange={handleInput} className="form-check-input" type="radio" name="paid" id="edit-pedido-no-pagado" value={false} />
                                        <label className="form-check-label" htmlFor="edit-pedido-no-pagado">
                                            No pagado
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input onChange={handleInput} className="form-check-input" type="radio" name="paid" id="edit-pedido-pagado" value={true} />
                                        <label className="form-check-label" htmlFor="edit-pedido-pagado" >
                                            Pagado
                                        </label>
                                    </div >

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

                <div className="row col-12 m-auto mt-5" style={{ 'height': 'fit-content' }}>
                    <h2 className="mb-3">{title} pendientes</h2>
                    <Search term={term} setTerm={setTerm} />
                    <div className="btn-group mt-1" role="group" aria-label="Sort buttons">
                        <button type="button" className={sortedByDeliveryDate ? "btn btn-info active text-white border" : "btn btn-light border"} onClick={() => sortByDeliveryDateAsc(pedidos)}>Ordernar por Fecha de entrega</button>

                        {/* <button type="button" className={sortedByCreateDate ? "btn btn-info active text-white" : "btn btn-light"} onClick={sortByCreatedDateAsc}>Fecha de creación</button> */}

                        <button type="button" className={sortedByReceiverName ? "btn btn-info active text-white border" : "btn btn-light border"} onClick={() => sortByReceiverName(pedidos)}>Ordenar por Nombre destinatario</button>

                    </div>
                    {
                        pedidos.filter(pedido => !pedido.delete).filter(searchingTerm(term)).filter(pedido => pedido.completed === false).filter(pedido => pedido?.orderType === orderType).map(({ orderType, deliveryDate, createDate, receiverName, customerType, phone, address, comment, product, productDetails, clientName, clientPhone, completed, paid, shop, _id }, index) => {
                            return <ul id={_id + 'print'} key={_id} className="list-group col-xl-4 col-lg-4 col-md-6 mb-3 p-0 p-md-1 p-lg-2">
                                <li className="list-group-item list-group-item-info d-flex justify-content-between align-items-center">
                                    <div>
                                        <p className="m-0"><b style={{ cursor: "pointer" }} onClick={() => setShowFullOrderNumber(!showFullOrderNumber)}>Pedido Nº</b> {_id ? formatOrderNumber(_id) : ''}</p>
                                        <p className="m-0"><b>Creado:</b> {createDate.split(',')[0]}</p>
                                        <p className="m-0"><b>Registrado por:</b> {user}</p>
                                    </div>

                                    {/* Menu button */}
                                    <div style={{ display: 'inline', marginLeft: '10px' }} className="dropdown">
                                        <button onClick={() => setSelected(_id)} className={`text-dark dropdown-toggle btn btn-link`} type="button" data-toggle="dropdown" aria-expanded="false"></button>
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

                                {(orderType === 'corona' || orderType === 'pedido') &&
                                    <li className="list-group-item"><b>{orderType === 'corona' ? 'Nombre del difunto:' : 'Nombre del destinatario'}</b> {receiverName}</li>}

                                {(orderType === 'corona' || orderType === 'pedido') &&
                                    <li className="list-group-item"><b>{orderType === 'corona' ? 'Nombre del tanatorio' : 'Dirección de entrega:'}</b> {address}</li>}

                                {orderType === 'corona' ? <li className="list-group-item"><b>Encarga: </b>{customerType}</li> : null}

                                {(orderType === 'corona' || orderType === 'pedido') &&
                                    <li className="list-group-item"><b>{orderType === 'corona' ? 'Contacto tanatorio:' : 'Teléfono del destinatario:'}</b> {phone}</li>}

                                <li className="list-group-item"><b>{orderType === 'plantas' ? 'Tipo de planta' : 'Producto:'}</b> {product}</li>

                                {orderType === 'corona' || orderType === 'plantas' ? <li className="list-group-item"><b>{orderType === 'corona' ? 'Detalles del producto:' : 'Cantidad'}</b> {productDetails}</li> : null}

                                <li className="list-group-item"><b>Nombre del cliente:</b> {clientName}</li>
                                <li className="list-group-item"><b>Teléfono del cliente:</b> {clientPhone}</li>
                                <li className="list-group-item"><b>Comentarios o notas:</b> {comment}</li>
                                <li className="list-group-item"><b>Tienda: </b>{shop}</li>
                                <li className="list-group-item"><b>Pedido pagado: </b>{paid ? 'Sí' : 'No'}</li>
                                <li className="list-group-item"><b>Estado del pedido: </b>{completed ? 'COMPLETADO' : 'NO COMPLETADO'}</li>
                                <button className="btn btn-success" id={_id} onClick={event => toggleCompleted(event.target.id)}>Marcar como completado</button>
                            </ul>
                        })
                    }


                    <h2 className="mb-3">{title} completados</h2>
                    <button className="btn btn-link mb-3" onClick={() => setShowCompleted(!showCompleted)}>{showCompleted ? 'Ocultar pedidos completados' : 'Mostrar pedidos completados'}</button>
                    <div className="row col-12 m-auto mt-5" style={{ 'height': 'fit-content' }}>
                        {
                            pedidos.filter(pedido => !pedido.delete).filter(searchingTerm(term)).filter(pedido => pedido.completed === true).filter(pedido => pedido?.orderType === orderType).map(({ orderType, deliveryDate, customerType, productDetails, paid, receiverName, phone, address, comment, product, clientName, clientPhone, completed, _id }, index) => {
                                return showCompleted ? <ul id={_id + 'print'} key={_id} className="list-group col-xl-4 col-lg-4 col-md-6 mb-3 p-0 p-md-1 p-lg-2">
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

                                    {(orderType === 'corona' || orderType === 'pedido') &&
                                        <li className="list-group-item"><b>{orderType === 'corona' ? 'Nombre del difunto:' : 'Nombre del destinatario'}</b> {receiverName}</li>}

                                    {(orderType === 'corona' || orderType === 'pedido') &&
                                        <li className="list-group-item"><b>{orderType === 'corona' ? 'Nombre del tanatorio' : 'Dirección de entrega:'}</b> {address}</li>}

                                    {orderType === 'corona' ? <li className="list-group-item"><b>Encarga: </b>{customerType}</li> : null}

                                    {(orderType === 'corona' || orderType === 'pedido') &&
                                        <li className="list-group-item"><b>{orderType === 'corona' ? 'Contacto tanatorio:' : 'Teléfono del destinatario:'}</b> {phone}</li>}

                                    <li className="list-group-item"><b>{orderType === 'plantas' ? 'Tipo de planta' : 'Producto:'}</b> {product}</li>

                                    {orderType === 'corona' || orderType === 'plantas' ? <li className="list-group-item"><b>{orderType === 'corona' ? 'Detalles del producto:' : 'Cantidad'}</b> {productDetails}</li> : null}

                                    <li className="list-group-item"><b>Nombre del cliente:</b> {clientName}</li>
                                    <li className="list-group-item"><b>Teléfono del cliente:</b> {clientPhone}</li>
                                    <li className="list-group-item"><b>Comentarios o notas:</b> {comment}</li>
                                    <li className="list-group-item"><b>Pedido pagado: </b>{paid ? 'Sí' : 'No'}</li><li className="list-group-item"><b>Estado del pedido: </b>{completed ? 'COMPLETADO' : 'NO COMPLETADO'}</li>
                                    <button className="btn btn-danger" id={_id} onClick={event => toggleCompleted(event.target.id)}>Marcar como NO completado</button>
                                </ul> : null

                            })
                        }
                    </div>
                </div>
            </>
        )
    }
}

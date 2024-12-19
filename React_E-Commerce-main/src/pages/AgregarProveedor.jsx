import API_URL from "../config";
import React, { useRef, useEffect, useState } from "react";
import { Sidebar, Navbar } from "../components";
import toast from "react-hot-toast";

export const AgregarProveedor = () => {

    const Name = useRef(null);
    const Phone = useRef(null);
    const ProductId = useRef(null);
    const Cost = useRef(null);
    const Email = useRef(null);
    const LastPurchaseDate = useRef(null);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${API_URL}/productos`);
                if (!response.ok) throw new Error("Error al cargar productos");
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Error al cargar los productos:", error);
                toast.error("No se pudieron cargar los productos");
            }
        };

        fetchProducts();
    }, []);

    const crearProveedor = (e) => {
        e.preventDefault();

        const proveedorData = {
            Name: Name.current?.value,
            Phone: Phone.current?.value,
            ProductId: ProductId.current?.value,
            Cost: Cost.current?.value,
            Email: Email.current?.value,
            LastPurchaseDate: LastPurchaseDate.current?.value,
        };

        fetch(`${API_URL}/proveedores`)
            .then((response) => {
                if (!response.ok) {
                    toast.error("Error verificando el email");
                    throw new Error("Error al verificar el email");
                }
                return response.json();
            })
            .then((data) => {
                const emailExistente = data.some((proveedor) => proveedor.Email === proveedorData.Email);

                if (emailExistente) {
                    toast.error("Email ya usado");
                    throw new Error("Email ya usado");
                }

                fetch(`${API_URL}/proveedores`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(proveedorData),
                })
                    .then((response) => {
                        if (response.status === 200) {
                            toast.success("Proveedor creado");
                        } else {
                            toast.error("Creación no realizada");
                            throw new Error("Creación fallida");
                        }
                    })
                    .catch((err) => {
                        console.error("Error en la creación:", err);
                        toast.error("Ocurrió un error en la creación");
                    });
            })
            .catch((err) => {
                console.error("Error general:", err);
            });
    };

    return (
        <div>
            <Navbar />
            <Sidebar />
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div className="content-container flex-grow-1 ms-sm-5 mt-4">
                    <div className="container mt-5">
                        <h2>Agregar Proveedor</h2>
                        <form onSubmit={crearProveedor}>
                            <div className="row">
                                <div className="col-12 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="nombre" className="form-label">Nombre del Proveedor</label>
                                        <input type="text" className="form-control" id="nombre" ref={Name} required />
                                    </div>
                                </div>

                                <div className="col-12 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="telefono" className="form-label">Telefono</label>
                                        <input type="number" className="form-control" id="telefono" ref={Phone} required />
                                    </div>
                                </div>

                                <div className="col-12 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="producto" className="form-label">Producto</label>
                                        <select className="form-control" id="producto" ref={ProductId} required multiple>
                                            <option value="">Seleccione un Producto</option>
                                            {products.map((p) => (
                                                <option key={p.ProductId} value={p.ProductId}>
                                                    {p.Name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="col-12 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="costo" className="form-label">Costo</label>
                                        <input type="number" className="form-control" id="costo" ref={Cost} required />
                                    </div>
                                </div>

                                <div className="col-12 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input type="email" className="form-control" id="email" ref={Email} required />
                                    </div>
                                </div>

                                <div className="col-12 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="lastPurchaseDate" className="form-label">Fecha de la ultima compra</label>
                                        <input type="date" className="form-control" id="lastPurchaseDate" ref={LastPurchaseDate} />
                                    </div>
                                </div>

                                <div className="col-12">
                                    <button className="my-2 mx-auto btn btn-dark" type="submit">
                                        Crear
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default AgregarProveedor;
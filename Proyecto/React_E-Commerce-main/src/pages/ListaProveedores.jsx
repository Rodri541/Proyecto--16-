import "../css/dashboard.css";
import "../css/listaProductos.css";
import "../css/navbar.css";
import React, { useEffect, useState } from "react";
import { Sidebar, Navbar } from "../components";
import API_URL from "../config";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import EliminarProveedor from "./EliminarProveedor";

export const ListaProveedores = () => {
    const navigate = useNavigate();
    const [proveedores, setProveedores] = useState([]);
    const [filteredProveedores, setFilteredProveedores] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [expandedProveedor, setExpandedProveedor] = useState(null);

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString("es-UY", options);
    };

    useEffect(() => {
        const getProveedores = async () => {
            setLoading(true);

            try {
                const responseProveedores = await axios.get(`${API_URL}/proveedores`);
                const proveedoresData = responseProveedores.data;

                const responseProducts = await axios.get(`${API_URL}/productos`);
                const productsData = responseProducts.data;

                const proveedoresConProductos = proveedoresData.map(proveedor => ({
                    ...proveedor,
                    productos: productsData.filter(producto => producto.SupplierId === proveedor.SupplierId),
                }));

                setProveedores(proveedoresConProductos);
                setFilteredProveedores(proveedoresConProductos);
            } catch (error) {
                console.error("Error encontrando información del proveedor", error);
                toast.error("Hubo un error al cargar los datos.");
            } finally {
                setLoading(false);
            }
        };

        getProveedores();
    }, []);

    useEffect(() => {
        const filtered = proveedores.filter(proveedor =>
            proveedor.Name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProveedores(filtered);
    }, [searchTerm, proveedores]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    if (loading) {
        return <p>Cargando...</p>;
    }

    return (
        <div>
            <Navbar />
            <Sidebar />
            <div className="d-flex justify-content-center mb-4">
                <div className="input-group w-50">
                    <span className="input-group-text bg-white border-end-0 rounded-start">
                        <i className="fa-solid fa-magnifying-glass text-muted"></i>
                    </span>
                    <input
                        type="text"
                        className="form-control border-start-0 rounded-end"
                        placeholder="Buscar proveedor"
                        aria-label="Buscar proveedor"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
            </div>
            <div className="provider-table" style={{ marginLeft: "210px", marginTop: "20px", width: "86%" }}>
                <table className="table table-striped table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Nombre</th>
                            <th>Teléfono</th>
                            <th>Productos</th>
                            <th>Costo</th>
                            <th>Email</th>
                            <th>Última Compra</th>
                            <th>Modificar</th>
                            <th>Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProveedores.map((proveedor) => (
                            <React.Fragment key={proveedor.SupplierId}>
                                <tr>
                                    <td>{proveedor.Name}</td>
                                    <td>{proveedor.Phone}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-info"
                                            onClick={() =>
                                                setExpandedProveedor(
                                                    expandedProveedor === proveedor.SupplierId ? null : proveedor.SupplierId
                                                )
                                            }
                                        >
                                            {expandedProveedor === proveedor.SupplierId ? "Ocultar" : "Ver"}
                                        </button>
                                    </td>
                                    <td>{`$${proveedor.Cost}`}</td>
                                    <td>{proveedor.Email}</td>
                                    <td>{formatDate(proveedor.LastPurchaseDate)}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => navigate(`/EditarProveedor/${proveedor.SupplierId}`)}
                                        >
                                            <i className="fa-solid fa-pen"></i>
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => EliminarProveedor(proveedor.SupplierId, setProveedores)}
                                        >
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                                {expandedProveedor === proveedor.SupplierId && (
                                    <tr>
                                        <td colSpan="8" style={{ paddingLeft: "20px", backgroundColor: "#f9f9f9" }}>
                                            <h5>Productos de {proveedor.Name}</h5>
                                            {proveedor.productos.length > 0 ? (
                                                <table className="table table-sm table-bordered mt-2">
                                                    <thead className="table-light">
                                                        <tr>
                                                            <th>Nombre</th>
                                                            <th>Precio</th>
                                                            <th>Cantidad</th>
                                                            <th>Descripción</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {proveedor.productos.map((producto) => (
                                                            <tr key={producto.ProductId}>
                                                                <td>{producto.Name}</td>
                                                                <td>{`$${producto.Price}`}</td>
                                                                <td>{producto.Quantity}</td>
                                                                <td>{producto.Description}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <p>No hay productos asociados con este proveedor.</p>
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListaProveedores;

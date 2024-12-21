import React, { useEffect, useState } from "react";
import { Sidebar, Navbar } from "../components";
import API_URL from "../config";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import EliminarProveedor from './EliminarProveedor';

export const ListaProveedores = () => {
    const navigate = useNavigate();
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expandedProveedor, setExpandedProveedor] = useState(null); // Controla qué proveedor está expandido

    useEffect(() => {
        const getProveedores = async () => {
            setLoading(true);

            try {
                const responseProveedores = await axios.get(`${API_URL}/proveedores`);
                const proveedoresData = responseProveedores.data;

                const responseProducts = await axios.get(`${API_URL}/productos`);
                const productsData = responseProducts.data;

                // Agregar productos a cada proveedor
                const proveedoresConProductos = proveedoresData.map(proveedor => ({
                    ...proveedor,
                    productos: productsData.filter(producto => producto.SupplierId === proveedor.SupplierId),
                }));

                setProveedores(proveedoresConProductos);
            } catch (error) {
                console.error("Error encontrando información del proveedor", error);
                toast.error("Hubo un error al cargar los datos.");
            } finally {
                setLoading(false);
            }
        };

        getProveedores();
    }, []);

    if (loading) {
        return <p>Cargando...</p>;
    }

    return (
        <div>
            <Navbar />
            <Sidebar />
            <div className="product-table" style={{ marginLeft: "210px", overflow: "hidden", marginTop: "20px", width: "86%" }}>
                <table style={{ tableLayout: "fixed", width: "100%" }}>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Telefono</th>
                            <th>Productos</th>
                            <th>Costo</th>
                            <th>Email</th>
                            <th>Fecha de última compra</th>
                            <th>Modificar</th>
                            <th>Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {proveedores.map((proveedor) => (
                            <React.Fragment key={proveedor.SupplierId}>
                                <tr>
                                    <td>{proveedor.Name}</td>
                                    <td>{proveedor.Phone}</td>
                                    <td>
                                        <button
                                            onClick={() =>
                                                setExpandedProveedor(
                                                    expandedProveedor === proveedor.SupplierId ? null : proveedor.SupplierId
                                                )
                                            }
                                        >
                                            {expandedProveedor === proveedor.SupplierId ? "Ocultar productos" : "Ver productos"}
                                        </button>
                                    </td>
                                    <td>{`$${proveedor.Cost}`}</td>
                                    <td>{proveedor.Email}</td>
                                    <td>{proveedor.LastPurchaseDate}</td>
                                    <td>
                                        <button onClick={() => navigate(`/EditarProveedor/${proveedor.SupplierId}`)}>
                                            Modificar
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            className="bg-black text-white"
                                            onClick={() => EliminarProveedor(proveedor.SupplierId, setProveedores)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                                {expandedProveedor === proveedor.SupplierId && (
                                    <tr>
                                        <td colSpan="8" style={{ paddingLeft: "20px", backgroundColor: "#f9f9f9" }}>
                                            <h4>Productos de {proveedor.Name}</h4>
                                            {proveedor.productos.length > 0 ? (
                                                <table style={{ width: "100%" }}>
                                                    <thead>
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

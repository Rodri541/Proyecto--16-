import "../css/dashboard.css";
import "../css/listaProductos.css";
import "../css/navbar.css";
import EditarProduct from "./EditarProduct.jsx";
import React, { useEffect, useState } from "react";
import { Sidebar, Navbar } from "../components";
import API_URL from "../config";
import axios from "axios";
import toast from "react-hot-toast";
import EliminarProduct from "./EliminarProduct.jsx";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";

export const ListaProducts = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);

    const itemsPerPage = 5; // Número de elementos por página
    const offset = currentPage * itemsPerPage;
    const currentItems = products.slice(offset, offset + itemsPerPage);
    const pageCount = Math.ceil(products.length / itemsPerPage);

    useEffect(() => {
        const getProduct = async () => {
            setLoading(true);

            try {
                const responseProducts = await axios.get(`${API_URL}/productos`);
                const productsData = responseProducts.data;

                const responseCategories = await axios.get(`${API_URL}/categorias`);
                const categoriesData = responseCategories.data;

                const productsWithCategories = productsData.map((product) => {
                    const category = categoriesData.find(
                        (cat) => cat.CategoryId === product.CategoryId
                    );
                    return {
                        ...product,
                        categoryName: category ? category.Name : "Sin categoría",
                    };
                });

                setProducts(productsWithCategories);
                setCategories(categoriesData);
            } catch (error) {
                console.error("Error encontrando información del producto", error);
                toast.error("Error al cargar los productos.");
            } finally {
                setLoading(false);
            }
        };

        getProduct();
    }, []);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    if (loading) {
        return <p>Cargando...</p>;
    }

    return (
        <div>
            <Navbar />
            <Sidebar />
            <div className="product-table" style={{ marginLeft: "210px", marginTop: "20px", width: "86%" }}>
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Altura (cm)</th>
                            <th>Categoría</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>¿A la venta?</th>
                            <th>Modificar</th>
                            <th>Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((item) => (
                            <tr key={item.ProductId}>
                                <td>{item.Name}</td>
                                <td>{item.Height != null ? item.Height : "-"}</td>
                                <td>{item.categoryName}</td>
                                <td>{`$${item.Price}`}</td>
                                <td>{item.Quantity}</td>
                                <td>
                                    {item.ALaVenta ? (
                                        <span style={{ color: "green" }}>✔️</span>
                                    ) : (
                                        <span style={{ color: "red" }}>❌</span>
                                    )}
                                </td>
                                <td>
                                    <button onClick={() => navigate(`/EditarProduct/${item.ProductId}`)}>
                                        Modificar
                                    </button>
                                </td>
                                <td>
                                    <button className="dark"
                                        onClick={() => EliminarProduct(item.ProductId, setProducts)}>
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <ReactPaginate
                    previousLabel={"Anterior"}
                    nextLabel={"Siguiente"}
                    breakLabel={"..."}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination"}
                    pageClassName={"page-item"}
                    pageLinkClassName={"page-link"}
                    previousClassName={"page-item"}
                    previousLinkClassName={"page-link"}
                    nextClassName={"page-item"}
                    nextLinkClassName={"page-link"}
                    activeClassName={"active"}
                />
            </div>
        </div>
    );
};

export default ListaProducts;
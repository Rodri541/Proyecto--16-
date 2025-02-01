import React, { useState, useEffect } from "react";
import { Navbar, Sidebar } from "../components";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import API_URL from "../config";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

const Estadisticas = () => {
    ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

    const [mostSoldProducts, setMostSoldProducts] = useState([]);
    const [leastSoldProducts, setLeastSoldProducts] = useState([]);
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchTopProducts = async () => {
            try {
                const mostSoldResponse = await axios.get(`${API_URL}/topProductosVendidos`);

                const leastSoldResponse = await axios.get(`${API_URL}/topProductosMenosVendidos`);

                setMostSoldProducts(mostSoldResponse.data);
                setLeastSoldProducts(leastSoldResponse.data);
            } catch (error) {
                console.error("Error al obtener los productos más y menos vendidos:", error);
            }
        };

        const fetchProductsSoldByMonth = async () => {
            try {
                const response = await axios.get(`${API_URL}/productosVendidos`);
                const data = response.data;

                const labels = data.map(item => item.Month);
                const values = data.map(item => item.TotalProductsSold);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Productos vendidos',
                            data: values,
                            backgroundColor: 'rgba(54, 162, 235, 0.6)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1,
                        },
                    ],
                });
            } catch (error) {
                console.error("Error al obtener datos de ventas:", error);
            }
        };

        fetchTopProducts();
        fetchProductsSoldByMonth();
    }, []);

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Ventas Totales por Mes' },
        },
    };

    const ProductList = ({ title, products }) => (
        <div className="col-md-6 mt-4">
            <h5 className="text-primary">{title}</h5>
            <ul className="list-group">
                {products.map(product => (
                    <li
                        key={product.ProductId}
                        className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{product.Name}</strong> - ${product.Price.toFixed(2)}
                        </div>
                        <span className="badge bg-success rounded-pill">{product.soldCount} vendidos</span>
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <>
            <Navbar />
            <Sidebar />
            <div className="container">
                <div className="row">
                    <ProductList
                        title={<span style={{ color: 'black' }}>Productos más vendidos</span>}
                        products={mostSoldProducts}
                    />
                    <ProductList
                        title={<span style={{ color: 'black' }}>Productos menos vendidos</span>}
                        products={leastSoldProducts}
                    />
                </div>
                <div className="mt-5 text-center">
                    <h2>Estadísticas de Ventas</h2>
                    {chartData ? (
                        <Bar data={chartData} options={options} />
                    ) : (
                        <p>Cargando datos...</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default Estadisticas;
import React, { useEffect, useState } from "react";
import { Navbar, Sidebar } from "../components";
import API_URL from "../config";
import axios from "axios";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner.jsx";
import DeleteChange from "./DeleteChange.jsx";

const ChangeStock = () => {
    const params = useParams();
    const { ProductoId } = params;
    const [cambios, setChange] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            try {
                const responseCh = await axios.get(`${API_URL}/cambiosDeStock/${ProductoId}`);
                console.log("Datos obtenidos:", responseCh.data);
                setChange(Array.isArray(responseCh.data) ? responseCh.data : []);
            } catch (error) {
                console.error("Error al obtener los datos:", error);
                setChange([]);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [ProductoId]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredCambios = Array.isArray(cambios)
        ? cambios.filter(cambio =>
            cambio.Razon?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    if (loading) {
        return <Spinner />;
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
                        placeholder="Buscar por razón"
                        aria-label="Buscar cambio"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
            </div>
            <div className="provider-table-container" style={{ margin: "0 auto", width: "90%" }}>
                <div className="d-flex justify-content-center">
                    <div className="table-responsive" style={{ width: "100%" }}>
                        <table className="table table-striped table-hover" style={{ width: "100%" }}>
                            <thead className="table-dark">
                                <tr>
                                    <th>Fecha de Cambio</th>
                                    <th>Cantidad Anterior</th>
                                    <th>Cantidad Nueva</th>
                                    <th>Razón</th>
                                    <th>Borrar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCambios.map((cambio) => (
                                    <tr key={`${cambio.ProductId}-${cambio.FechaDeCambio}`}>
                                        <td>{new Date(cambio.FechaDeCambio).toLocaleDateString()}</td>
                                        <td>{cambio.CantidadAnterior}</td>
                                        <td>{cambio.CantidadNueva}</td>
                                        <td>{cambio.Razon}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => DeleteChange(cambio.CambioDeStockId, setChange, ProductoId)}>
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangeStock;

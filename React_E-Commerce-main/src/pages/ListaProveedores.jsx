import React, { useEffect, useState } from "react";
import { Sidebar, Navbar } from "../components";
import API_URL from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EliminarProveedor from './EliminarProveedor';

export const ListaProveedores = () => {
    const navigate = useNavigate();
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      const getProveedores = async () => {
        setLoading(true);
  
        try {
          const responseProveedores = await axios.get(`${API_URL}/proveedores`);
          const proveedoresData = responseProveedores.data;
     
          const proveedoresConProductos = await Promise.all(proveedoresData.map(async (proveedor) => {
            
            const responseProductSupplier = await axios.get(`${API_URL}/proveedores/${proveedor.SupplierId}/productos`);
            const productSupplierData = responseProductSupplier.data;
            
            const productNames = productSupplierData.map(product => product.Name).join(', '); 
  
            
            return {
              ...proveedor,
              ProductNames: productNames || "Sin productos"
            };
          }));
  
          setProveedores(proveedoresConProductos);
  
        } catch (error) {
          console.error("Error al obtener los proveedores o productos:", error);
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
          <table style={{ tableLayout: "fixed" }}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Telefono</th>
                <th>Productos</th>
                <th>Costo</th>
                <th>Email</th>
                <th>Fecha de ultima compra</th>
                <th>Modificar</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {proveedores.map((item) => (
                <tr key={item.SupplierId}>
                  <td>{item.Name}</td>
                  <td>{item.Phone}</td>
                  <td>{item.ProductNames}</td> 
                  <td>{`$${item.Cost}`}</td>
                  <td>{item.Email}</td>
                  <td>{item.LastPurchaseDate}</td>
                  <td>
                    <button onClick={() => {
                      navigate(`/EditarProveedor/${item.SupplierId}`);
                    }}>
                      Modificar
                    </button>
                  </td>
                  <td>
                    <button
                      className="bg-black text-white"
                      onClick={() => {
                        EliminarProveedor(item.SupplierId, setProveedores);
                      }}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  

export default ListaProveedores;

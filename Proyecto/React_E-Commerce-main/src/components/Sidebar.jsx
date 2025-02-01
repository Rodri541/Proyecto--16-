<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../css/sidebar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaList, FaPlus, FaTruck, FaUserPlus, FaFileAlt, FaChartBar, FaUser } from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();
  const isDashboardPage = location.pathname === "/dashboard";


  const [collapsed, setCollapsed] = useState(!isDashboardPage);


  useEffect(() => {
    if (isDashboardPage) {
      setCollapsed(false);
    } else {
      setCollapsed(true);
    }
  }, [location, isDashboardPage]);


  const handleButtonClick = (link) => {
    if (!isDashboardPage) {
      setCollapsed(true);
    }
    setTimeout(() => {
      window.location.href = link;
    }, 50);
  };
=======
import React from "react";
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import "../css/sidebar.css"
import "bootstrap/dist/css/bootstrap.min.css";
import { FaList, FaPlus, FaTruck, FaUserPlus, FaFileAlt, FaChartBar } from "react-icons/fa";
>>>>>>> 750a6b834aff33e60be8577a970be584c48f02b3

  return (
    <div className="d-flex flex-column min-vh-50">
<<<<<<< HEAD
=======
      {/* Header and Dashboard Buttons */}
      <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1">
        <h2 className="mb-4">Bienvenido al Dashboard</h2>
        <div className="d-flex flex-wrap justify-content-center gap-4">
          <NavLink to="/ListaProducts" className="btn btn-primary d-flex flex-column align-items-center p-4 shadow">
            <FaList size={50} className="mb-2" />
            <span>Lista de productos</span>
          </NavLink>
          <NavLink to="/AgregarProduct" className="btn btn-success d-flex flex-column align-items-center p-4 shadow">
            <FaPlus size={50} className="mb-2" />
            <span>Agregar producto</span>
          </NavLink>
          <NavLink to="/ListaProveedores" className="btn btn-warning d-flex flex-column align-items-center p-4 shadow">
            <FaTruck size={50} className="mb-2" />
            <span>Lista de proveedores</span>
          </NavLink>
          <NavLink to="/AgregarProveedor" className="btn btn-danger d-flex flex-column align-items-center p-4 shadow">
            <FaUserPlus size={50} className="mb-2" />
            <span>Agregar proveedor</span>
          </NavLink>
          <NavLink to="/Orders" className="btn btn-dark d-flex flex-column align-items-center p-4 shadow">
            <FaFileAlt size={50} className="mb-2" />
            <span>Lista de ordenes</span>
          </NavLink>
          <NavLink to="/Estadisticas" className="btn btn-info d-flex flex-column align-items-center p-4 shadow">
            <FaChartBar size={50} className="mb-2" />
            <span>Estadisticas</span>
          </NavLink>
        </div>
      </div>
>>>>>>> 750a6b834aff33e60be8577a970be584c48f02b3

      {!collapsed && isDashboardPage && (
        <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1">
          <h2 className="dashboard-title mb-4">Bienvenido al Dashboard</h2>
        </div>
      )}


      <div
        className={`dashboard-buttons d-flex flex-wrap justify-content-center gap-4 ${collapsed ? 'collapsed' : ''}`}>
        <button
          className="btn btn-primary d-flex flex-column align-items-center p-4 shadow"
          onClick={() => handleButtonClick("/listaProductos")}>
          <FaList size={50} className="mb-2" />
          <span>Lista de productos</span>
        </button>
        <button
          className="btn btn-success d-flex flex-column align-items-center p-4 shadow"
          onClick={() => handleButtonClick("/agregarProducto")}>
          <FaPlus size={50} className="mb-2" />
          <span>Agregar producto</span>
        </button>
        <button
          className="btn btn-warning d-flex flex-column align-items-center p-4 shadow"
          onClick={() => handleButtonClick("/listaProveedores")}>
          <FaTruck size={50} className="mb-2" />
          <span>Lista de proveedores</span>
        </button>
        <button
          className="btn btn-danger d-flex flex-column align-items-center p-4 shadow"
          onClick={() => handleButtonClick("/agregarProveedor")}>
          <FaUserPlus size={50} className="mb-2" />
          <span>Agregar proveedor</span>
        </button>
        <button
          className="btn btn-dark d-flex flex-column align-items-center p-4 shadow"
          onClick={() => handleButtonClick("/ordenes")}>
          <FaFileAlt size={50} className="mb-2" />
          <span>Lista de órdenes</span>
        </button>
        <button
          className="btn btn-info d-flex flex-column align-items-center p-4 shadow"
          onClick={() => handleButtonClick("/estadisticas")}>
          <FaChartBar size={50} className="mb-2" />
          <span>Estadísticas</span>
        </button>
        <button
          className="btn btn-secondary d-flex flex-column align-items-center p-4 shadow"
          onClick={() => handleButtonClick("/usuarios")}>
          <FaUser size={50} className="mb-2" />
          <span>Lista de usuarios</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

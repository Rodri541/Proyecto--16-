import React from "react";
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import "../css/sidebar.css"
import "bootstrap/dist/css/bootstrap.min.css";
import { FaList, FaPlus, FaTruck, FaUserPlus, FaFileAlt, FaChartBar } from "react-icons/fa";

const Dashboard = () => {
  return (
    <div className="d-flex flex-column min-vh-50">
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

      {/* Content Area */}
      <div className="bg-white p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
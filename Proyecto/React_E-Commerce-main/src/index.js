import React from "react";
import ReactDOM from "react-dom/client";
import "../node_modules/font-awesome/css/font-awesome.min.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

import {
  Home,
  Product,
  Products,
  AboutPage,
  ContactPage,
  Cart,
  Login,
  Register,
  Checkout,
  PageNotFound,
  Dashboard,
  ListaProducts,
  AgregarProduct,
  EditarProduct,
  ListaProveedores,
  AgregarProveedor,
  EditarProveedor,
  Orders,
  ProductDetails,
  Estadisticas,
} from "./pages";
import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "react-hot-toast";

<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
/>


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ScrollToTop>
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Products />} />
          <Route path="/productos/:id" element={<Product />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cart" element={<Cart />} />


          {/* LOGIN */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="*" element={<PageNotFound />} />
          <Route path="/productos/*" element={<PageNotFound />} />

          {/* RUTAS PROTEGIDAS SOLO PARA ADMIN */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/listaproducts" element={
            <ProtectedRoute>
              <ListaProducts/>
            </ProtectedRoute>
          }
          />

          <Route path="/listaproveedores" element={
            <ProtectedRoute>
              <ListaProveedores />
            </ProtectedRoute>
          }
          />
            
          <Route path="/agregarproveedor" element={
            <ProtectedRoute>
              <AgregarProveedor />
            </ProtectedRoute>
          } />


          <Route path="/orders" element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />


          <Route path="/estadisticas" element={
            <ProtectedRoute>
              <Estadisticas />
            </ProtectedRoute>
          } />

          <Route path="/ProductDetailDash/:productId" element={
            <ProtectedRoute>
              < ProductDetails />
            </ProtectedRoute>
          } />

          <Route path="/editarproveedor/:proveedorId" element={
            <ProtectedRoute>
              <EditarProveedor />
            </ProtectedRoute>
          } />


          <Route path="/editarproduct/:productId" element={
            <ProtectedRoute>
              <EditarProduct />
            </ProtectedRoute>
          } />

          <Route path="/agregarproduct" element={
            <ProtectedRoute>
              <AgregarProduct />
            </ProtectedRoute>
          } />

        </Routes>
      </Provider>
    </ScrollToTop>
    <Toaster />
  </BrowserRouter>
);

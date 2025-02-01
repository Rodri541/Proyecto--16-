import React from "react";
import ReactDOM from "react-dom/client";
import "../node_modules/font-awesome/css/font-awesome.min.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Spinner from "./components/Spinner";
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
<<<<<<< HEAD
  ProductsList,
  AddProduct,
  PutProduct,
  SuppliersList,
  PutSupplier,
  Orders,
  ProductDetails,
  Statistics,
  AddSupplier,
  Users
=======
  ListaProducts,
  AgregarProduct,
  EditarProduct,
  ListaProveedores,
  AgregarProveedor,
  EditarProveedor,
  Orders,
  ProductDetails,
  Estadisticas,
>>>>>>> 750a6b834aff33e60be8577a970be584c48f02b3
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
<<<<<<< HEAD
          <Route path="/sobreNosotros" element={<AboutPage />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/carrito" element={<Cart />} />

          <Route path="/spinner" element={<Spinner />} />
=======
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cart" element={<Cart />} />

>>>>>>> 750a6b834aff33e60be8577a970be584c48f02b3

          {/* LOGIN */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

<<<<<<< HEAD
          <Route path="/registro" element={<Register />} />
=======
          <Route path="/register" element={<Register />} />
>>>>>>> 750a6b834aff33e60be8577a970be584c48f02b3
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

<<<<<<< HEAD
          <Route path="/listaProductos" element={
            <ProtectedRoute>
              <ProductsList/>
=======
          <Route path="/listaproducts" element={
            <ProtectedRoute>
              <ListaProducts/>
>>>>>>> 750a6b834aff33e60be8577a970be584c48f02b3
            </ProtectedRoute>
          }
          />

<<<<<<< HEAD
          <Route path="/listaProveedores" element={
            <ProtectedRoute>
              <SuppliersList />
=======
          <Route path="/listaproveedores" element={
            <ProtectedRoute>
              <ListaProveedores />
>>>>>>> 750a6b834aff33e60be8577a970be584c48f02b3
            </ProtectedRoute>
          }
          />
            
<<<<<<< HEAD
          <Route path="/agregarProveedor" element={
            <ProtectedRoute>
              <AddSupplier />
=======
          <Route path="/agregarproveedor" element={
            <ProtectedRoute>
              <AgregarProveedor />
>>>>>>> 750a6b834aff33e60be8577a970be584c48f02b3
            </ProtectedRoute>
          } />


<<<<<<< HEAD
          <Route path="/ordenes" element={
=======
          <Route path="/orders" element={
>>>>>>> 750a6b834aff33e60be8577a970be584c48f02b3
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />


          <Route path="/estadisticas" element={
            <ProtectedRoute>
<<<<<<< HEAD
              <Statistics />
            </ProtectedRoute>
          } />

          <Route path="/productoDetalleDashboard/:productId" element={
=======
              <Estadisticas />
            </ProtectedRoute>
          } />

          <Route path="/ProductDetailDash/:productId" element={
>>>>>>> 750a6b834aff33e60be8577a970be584c48f02b3
            <ProtectedRoute>
              < ProductDetails />
            </ProtectedRoute>
          } />

<<<<<<< HEAD
          <Route path="/editarProveedor/:proveedorId" element={
            <ProtectedRoute>
              <PutSupplier />
=======
          <Route path="/editarproveedor/:proveedorId" element={
            <ProtectedRoute>
              <EditarProveedor />
>>>>>>> 750a6b834aff33e60be8577a970be584c48f02b3
            </ProtectedRoute>
          } />


<<<<<<< HEAD
          <Route path="/editarProducto/:productId" element={
            <ProtectedRoute>
              <PutProduct />
            </ProtectedRoute>
          } />

          <Route path="/agregarProducto" element={
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          } />
           <Route path="/usuarios" element={
            <ProtectedRoute>
              <Users />
=======
          <Route path="/editarproduct/:productId" element={
            <ProtectedRoute>
              <EditarProduct />
            </ProtectedRoute>
          } />

          <Route path="/agregarproduct" element={
            <ProtectedRoute>
              <AgregarProduct />
>>>>>>> 750a6b834aff33e60be8577a970be584c48f02b3
            </ProtectedRoute>
          } />

        </Routes>
      </Provider>
    </ScrollToTop>
    <Toaster />
  </BrowserRouter>
);

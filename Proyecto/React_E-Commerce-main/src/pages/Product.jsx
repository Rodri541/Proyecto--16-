import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useParams } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import axios from "axios";
import API_URL from "../config";
import toast from "react-hot-toast";

import "../css/productDetailPage.css";
import { Footer, Navbar } from "../components";

const Product = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState({});
  const [category, setCategory] = useState({});
  const [similarProducts, setSimilarProducts] = useState([]);
  const [groupedProducts, setGroupedProducts] = useState({});
  const [selectedSize, setSelectedSize] = useState("");
  const [colors, setColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  const addProduct = (product, color) => {
    const productWithColor = { ...product, color };
    dispatch(addCart(productWithColor));
    toast.success("Añadido al carrito");
  };

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      setLoadingSimilar(true);

      try {
<<<<<<< HEAD
        const productRes = await axios.get(`${API_URL}/productos/${id}`);
        const productData = productRes.data;
        setProduct(productData);
=======
        const response = await axios.get(`${API_URL}/productos/${id}`);

        setProduct(response.data);
>>>>>>> 750a6b834aff33e60be8577a970be584c48f02b3

        const categoryRes = await axios.get(
          `${API_URL}/categorias/${productData.CategoryId}`
        );
        setCategory(categoryRes.data);

        const relatedRes = await axios.get(
          `${API_URL}/productos/nombre/${productData.Name}`
        );
        const groupedBySize = relatedRes.data.reduce((acc, item) => {
          const sizeKey = `${item.Base}x${item.Height}`;
          if (!acc[sizeKey]) acc[sizeKey] = [];
          acc[sizeKey].push(item);
          return acc;
        }, {});
        setGroupedProducts(groupedBySize);

        const response2 = await axios.get(
          `${API_URL}/productos/categorias/${productData.CategoryId}`
        );
        const uniqueProducts = response2.data.reduce((acc, product) => {
          if (!acc.some((item) => item.Name === product.Name)) {
            acc.push(product);
          }
          return acc;
        }, []);
        setSimilarProducts(uniqueProducts);

        const initialSize = Object.keys(groupedBySize)[0];
        setSelectedSize(initialSize);
        setColors(groupedBySize[initialSize]);
        setSelectedColor(groupedBySize[initialSize][0]?.Color || "");
      } catch (err) {
        console.error("Error fetching product data", err);
      } finally {
        setLoading(false);
        setLoadingSimilar(false);
      }
    };

    fetchProductData();
  }, [id]);

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    const productsForSize = groupedProducts[size];
    setColors(productsForSize);
    setSelectedColor(productsForSize[0].Color);
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const Loading = () => (
    <div className="container my-5 py-4 text-center">
      <Skeleton height={300} width={300} />
      <Skeleton height={30} width={200} className="mt-3" />
    </div>
  );

<<<<<<< HEAD
  const ProductDetail = () => {
    const selectedProduct =
      groupedProducts[selectedSize]?.find(
        (item) => item.Color === selectedColor
      ) || product;

    return (
      <div className="container my-5 py-4">
        <div className="row align-items-center">
          <div className="col-lg-6 text-center">
            <img
              className="img-fluid rounded shadow-sm"
              src={selectedProduct.ImageUrl}
              alt={selectedProduct.Name}/>
          </div>
          <div className="col-lg-6">
            <h4 className="text-muted mb-2">{category.Name}</h4>
            <h1 className="display-6 fw-bold mb-3">{selectedProduct.Name}</h1>
            <h2 className="text-success fw-bold mb-4">
              ${selectedProduct.Price}
            </h2>
            <p className="text-secondary">{selectedProduct.Description}</p>

            {Object.keys(groupedProducts).length > 1 && (
              <div className="mb-3">
                <label htmlFor="sizeSelect" className="form-label">
                  Medidas disponibles:
                </label>
                <select
                  id="sizeSelect"
                  value={selectedSize}
                  onChange={(e) => handleSizeChange(e.target.value)}
                  className="form-select">
                  {Object.keys(groupedProducts).map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {product.Color != null && (
              <div className="mb-4">
                <label htmlFor="colorSelect" className="form-label">
                  Colores disponibles:
                </label>
                <select
                  id="colorSelect"
                  value={selectedColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="form-select"
                >
                  {colors.map((color) => (
                    <option key={color.ColorId} value={color.Color}>
                      {color.Color}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              className="btn btn-primary me-3"
              onClick={() => addProduct(selectedProduct, selectedColor)}>
              Agregar al carrito
            </button>
            <Link to="/carrito" className="btn btn-outline-secondary">
              Ir al carrito
            </Link>
            <p className="text-secondary mt-3">
              Stock restante: {selectedProduct.Quantity}
            </p>
=======
  const ShowProduct = () => (
    <div className="container my-5 py-4">
      <div className="row align-items-center">
        <div className="col-lg-6 text-center">
          <img className="img-fluid rounded shadow-sm"
            src={product.ImageUrl}
            alt={product.Name} />
        </div>
        <div className="col-lg-6">
          <h4 className="text-muted mb-2">{category.Name}</h4>
          <h1 className="display-6 fw-bold mb-3">{product.Name}</h1>
         
          <h2 className="text-success fw-bold mb-4">${product.Price}</h2>
          <p className="text-secondary">{product.Description}</p>

          {relatedProducts.length > 1 && (
            <div className="mb-3">
              <label htmlFor="sizeSelect" className="form-label">
                Medidas disponibles:
              </label>
              <select
                id="sizeSelect"
                value={id}
                onChange={handleSelectChange}
                className="form-select">
                {relatedProducts.map((item) => (
                  <option key={item.ProductId} value={item.ProductId}>
                    {item.Base} x {item.Height} cm - ${item.Price}
                  </option>
                ))}
              </select>
            </div>
          )}

          {colors.length > 0 && (
            <div className="mb-4">
              <label htmlFor="colorSelect" className="form-label">
                Colores disponibles:
              </label>
              <select
                id="colorSelect"
                value={selectedColor}
                onChange={handleColorChange}
                className="form-select">
                {colors.map((color) => (
                  <option key={color.ColorId} value={color.Name}>
                    {color.Name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            className="btn btn-primary me-3"
            onClick={() => {
              toast.success("Añadido al carrito");
              addProduct(product, selectedColor);
            }}>
            Agregar al carrito
          </button>
          <Link to="/cart" className="btn btn-outline-secondary">
            Ir al carrito
          </Link>
          <div className="mt-3">
            <p className="text-secondary">Stock restante: {product.Quantity}</p>
>>>>>>> 750a6b834aff33e60be8577a970be584c48f02b3
          </div>
        </div>
      </div>
    );
  };

  const ShowSimilarProduct = () => (
    <div className="d-flex">
      {similarProducts.map((item) => (
        <div key={item.ProductId} className="mx-2 text-center">
          <img
            src={item.ImageUrl}
            alt={item.Name}
            height={150}
            className="rounded"
            style={{ objectFit: "contain" }}
          />
          <h6 className="mt-2">{item.Name}</h6>
          <Link
            to={`/productos/${item.ProductId}`}
            className="btn btn-sm btn-primary mt-2"
          >
            Ver detalle
          </Link>
        </div>
      ))}
    </div>
  );

  return (
    <div className="productDetail">
      <Navbar />
      <div className="container">
        <div className="row">{loading ? <Loading /> : <ProductDetail />}</div>
        <div className="row my-5">
          <h3 className="text-center mb-4">También te podría interesar</h3>
          <div className="d-none d-md-block">
            <Marquee pauseOnHover speed={50} className="shadow-sm">
              {loadingSimilar ? <Loading /> : <ShowSimilarProduct />}
            </Marquee>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Product;

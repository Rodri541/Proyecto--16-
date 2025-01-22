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
  const [product, setProduct] = useState([]);
  const [category, setCategory] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [colors, setColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const dispatch = useDispatch();

  const addProduct = (product, color) => {
    const productWithColor = { ...product, color };
    dispatch(addCart(productWithColor));
  };

  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      setLoading2(true);

      try {
        const response = await axios.get(`${API_URL}/productos/${id}`);

        setProduct(response.data);

        const responseCat = await axios.get(
          `${API_URL}/categorias/${response.data.CategoryId}`
        );
        setCategory(responseCat.data);

        const relatedResponse = await axios.get(
          `${API_URL}/productos/nombre/${response.data.Name}`
        );
        setRelatedProducts(relatedResponse.data);

        const response2 = await axios.get(
          `${API_URL}/productos/categorias/${response.data.CategoryId}`
        );
        const uniqueProducts = response2.data.reduce((acc, product) => {
          if (!acc.some((item) => item.Name === product.Name)) {
            acc.push(product);
          }
          return acc;
        }, []);
        setSimilarProducts(uniqueProducts);

        const colorsResponse = await axios.get(
          `${API_URL}/productos/${id}/colores`
        );
        setColors(colorsResponse.data);
        if (colorsResponse.data.length > 0) {
          setSelectedColor(colorsResponse.data[0].Name);
        }
      } catch (error) {
        console.error("Error encontrando información del producto", error);
      } finally {
        setLoading(false);
        setLoading2(false);
      }
    };

    getProduct();
  }, [id]);

  const handleColorChange = (e) => {
    setSelectedColor(e.target.value);
  };

  const handleSelectChange = (e) => {
    window.location.href = `/productos/${e.target.value}`;
  };

  const Loading = () => (
    <div className="container my-5 py-4 text-center">
      <Skeleton height={300} width={300} />
      <Skeleton height={30} width={200} className="mt-3" />
    </div>
  );

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
          </div>
        </div>
      </div>
    </div>
  );

  const Loading2 = () => (
    <div className="my-4 py-4 text-center">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} height={200} width={150} className="mx-2" />
      ))}
    </div>
  );

  const ShowSimilarProduct = () => (
    <div className="py-4">
      <div className="d-flex flex-wrap justify-content-center">
        {similarProducts.map((item) => (
          <div key={item.ProductId} className="card mx-2 mb-3 shadow-sm">
            <img
              className="card-img-top p-3"
              src={item.ImageUrl}
              alt={item.Name}
              height={150}
              style={{ objectFit: "contain" }}
            />
            <div className="card-body text-center">
              <h5 className="card-title text-truncate">{item.Name}</h5>
              <Link
                to={`/productos/${item.ProductId}`}
                className="btn btn-sm btn-primary mt-2"
              >
                Ver detalle
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="productDetail">
      <Navbar />
      <div className="container">
        <div className="row">{loading ? <Loading /> : <ShowProduct />}</div>
        <div className="row my-5">
          <h3 className="text-center mb-4">También te podría interesar</h3>
          <div className="d-none d-md-block">
            <Marquee pauseOnHover={true} speed={50} className="shadow-sm">
              {loading2 ? <Loading2 /> : <ShowSimilarProduct />}
            </Marquee>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Product;

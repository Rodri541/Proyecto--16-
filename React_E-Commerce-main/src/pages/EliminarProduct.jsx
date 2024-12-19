import API_URL from "../config";
import toast from "react-hot-toast";

const EliminarProduct = async (productId, setProducts) => {

    fetch(`${API_URL}/productos/${productId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            if (response.status === 200) {
                toast.success("Producto borrado");
                setProducts((prevProducts) =>
                    prevProducts.filter((product) => product.ProductId !== productId)
                );
                return response.json();
            } else {
                toast.error("No se borro correctamente");
                throw new Error(`Error al intentar borrar el producto con ID: ${productId}`);
            }
        })
        .catch((err) => {
            console.error("Error al borrar:", err);
        });

}

export default EliminarProduct;
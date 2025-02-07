import API_URL from "../config";
import toast from "react-hot-toast";

const DeleteProduct = async (productId, setProducts, setFilter) => {
    const isConfirmed = window.confirm("¿Estás seguro de que deseas eliminar este producto?");

    if (isConfirmed) {
        try {
            const response = await fetch(`${API_URL}/productos/${productId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            
            let data;
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            } else {
                data = { message: await response.text() };
            }

            if (response.status === 400) {
                toast.error("No se puede eliminar, el producto está asociado a una orden");
                throw new Error(`Error al intentar borrar el producto`);
            }

            if (response.status === 500) {
                toast.error("No se puede eliminar, el producto tiene un cambio de stock manual");
                throw new Error(`Error al intentar borrar el producto`);
            }

            if (response.ok) {
                toast.success("Producto borrado");

                setProducts(prevProducts => prevProducts.filter(product => product.ProductId !== productId));
                setFilter(prevFilter => prevFilter.filter(product => product.ProductId !== productId));

            } else {
                toast.error(data.message || "No se borró correctamente");
                throw new Error(`Error al intentar borrar el producto con ID: ${productId}`);
            }
        } catch (err) {
            toast.error(err.message || "No se borró correctamente");
            console.error("Error al borrar:", err);
            //toast.error("Error al intentar borrar el producto");
        }
    } else {
        toast.error("Eliminación del producto cancelada");
    }
};

export default DeleteProduct;

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
            try {
                data = await response.json();
            } catch (jsonError) {
                data = { message: "Error desconocido del servidor" };
            }

            if (response.ok) {
                toast.success("Producto borrado");

                setProducts(prevProducts => prevProducts.filter(product => product.ProductId !== productId));
                setFilter(prevFilter => prevFilter.filter(product => product.ProductId !== productId));

            } else {
                console.error("Error al borrar:", data);
                toast.error(data.message || "No se pudo eliminar el producto");
                throw new Error(`Error al intentar borrar el producto con ID: ${productId}`);
            }
        } catch (err) {
            console.error("Error en la petición:", err);
            toast.error("Error inesperado al borrar el producto");
        }
    } else {
        toast.error("Eliminación del producto cancelada");
    }
};

export default DeleteProduct;


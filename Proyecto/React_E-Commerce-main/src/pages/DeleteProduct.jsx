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
            
            const data = await response.json();
            console.log(response);
            console.log(data);
            if(response.response === 400){
                toast.error("No se puede eliminar, el producto está asociado a una orden");
            }

            if (response.ok) {
                toast.success("Producto borrado");

                setProducts(prevProducts => prevProducts.filter(product => product.ProductId !== productId));
                setFilter(prevFilter => prevFilter.filter(product => product.ProductId !== productId));

            } else {
                //console.log(data.message)
                //toast.error("No se borró correctamente");
                toast.error(data.message)
                throw new Error(`Error al intentar borrar el producto con ID: ${productId}`);
            }
        } catch (err) {
            console.error("Error al borrar:", err);
            //toast.error("");
        }
    } else {
        toast.error("Eliminación del producto cancelada");
    }
};

export default DeleteProduct;


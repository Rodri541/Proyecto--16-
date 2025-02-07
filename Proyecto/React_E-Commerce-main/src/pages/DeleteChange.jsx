import API_URL from "../config";
import toast from "react-hot-toast";

const DeleteChange = async (CambioDeStockId, setChange, ProductoId) => {
    const isConfirmed = window.confirm("¿Estás seguro de que deseas eliminar este cambio de stock?");

    if (isConfirmed) {
        try {
            const response = await fetch(`${API_URL}/cambiosDeStock/${CambioDeStockId}`, {
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

            if (response.ok) {
                toast.success("Cambio borrado");

                const responseCh = await fetch(`${API_URL}/cambiosDeStock/${ProductoId}`);
                const updatedChanges = await responseCh.json();

                setChange(Array.isArray(updatedChanges) ? updatedChanges : []);
            } else {
                toast.error(data.message || "No se borró correctamente");
                throw new Error(`Error al intentar borrar el cambio`);
            }
        } catch (err) {
            toast.error(err.message || "No se borró correctamente");
            console.error("Error al borrar:", err);
        }
    } else {
        toast.error("Eliminación del cambio cancelada");
    }
};

export default DeleteChange;

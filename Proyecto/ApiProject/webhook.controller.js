const { updateProductStock } = require("./products.controllers.js");

const ACCESS_TOKEN = "APP_USR-2813772825895965-112617-112db10aa30998457e1886b1f8cf6787-2114869553";

// Función para manejar las notificaciones del webhook
const handleWebhook = async (req, res) => {
  const { id, topic } = req.query;

  if (topic === "payment") {
    try {
      const { default: fetch } = await import("node-fetch");

      // Consultar los detalles del pago en MercadoPago
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error al obtener los detalles del pago: ${response.statusText}`);
      }

      const paymentData = await response.json();
      const { status, metadata } = paymentData;

      if (status === "approved") {
        // Procesar cada producto en la metadata
        const items = metadata.items; // Asegúrate de incluir los `items` en el metadata al crear la preferencia
        for (const item of items) {
          const updateResult = await updateProductStock(item.id, item.quantity); // Llama a la función desde el controlador de productos
          if (!updateResult.success) {
            console.error(`Error al actualizar el stock: ${updateResult.error}`);
          } else {
            console.log(
              `Stock actualizado para el producto ${item.id}. Nuevo stock: ${updateResult.newStock}`
            );
          }
        }

        return res.status(200).send("Notificación procesada y stock actualizado");
      } else {
        console.log(`Pago no aprobado. Estado: ${status}`);
        return res.status(200).send("Pago no aprobado");
      }
    } catch (error) {
      console.error("Error al procesar el webhook:", error.message);
      return res.status(500).send("Error al procesar la notificación");
    }
  } else {
    return res.status(400).send("Evento no soportado");
  }
};

module.exports = { handleWebhook };
const { updateProductStock } = require("./products.controllers.js");

const ACCESS_TOKEN = "APP_USR-2813772825895965-112617-112db10aa30998457e1886b1f8cf6787-2114869553";

// Función para manejar las notificaciones del webhook
const handleWebhook = async (req, res) => {
  const { id, topic } = req.query;

  console.log(id)

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
      const { status, additional_info } = paymentData;

      console.log(status)
      if (status === "approved") {
        console.log("Pago aprobado. Procesando actualización de stock...");

        // Obtener los productos de la información adicional
        const items = additional_info?.items || [];
        if (items.length === 0) {
          console.error("No se encontraron productos en la transacción.");
          return res.status(400).send("No se encontraron productos en la transacción.");
        }

        // Procesar cada producto
        for (const item of items) {
          const productId = item.id;
          const quantity = item.quantity;

          if (!productId || !quantity) {
            console.error(`Datos incompletos para el producto: ${JSON.stringify(item)}`);
            return res.status(400).send("Datos incompletos para los productos.");
          }

          const updateResult = await updateProductStock(productId, quantity); // Llama a la función desde el controlador de productos
          if (!updateResult.success) {
            console.error(`Error al actualizar el stock para el producto ${productId}: ${updateResult.error}`);
            return res.status(500).send(`Error al actualizar el stock para el producto ${productId}.`);
          }

          console.log(`Stock actualizado para el producto ${productId}. Nuevo stock: ${updateResult.newStock}`);
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
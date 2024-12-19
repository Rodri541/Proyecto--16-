const { updateProductStock } = require("./products.controllers.js");

const ACCESS_TOKEN = "APP_USR-2813772825895965-112617-112db10aa30998457e1886b1f8cf6787-2114869553";

const handleWebhook = async (req, res) => {
  try {
    console.log("Cuerpo del webhook recibido:", req.body);

    const paymentId = req.body.data?.id;
    if (!paymentId) {
      console.error("ID del pago no proporcionado en el cuerpo del webhook.");
      return res.status(400).json({ error: "ID del pago no proporcionado." });
    }

    console.log("ID del pago recibido:", paymentId);

    // Importación dinámica de fetch
    const { default: fetch } = await import("node-fetch");

    const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    });

    if (!paymentResponse.ok) {
      const errorMessage = await paymentResponse.text();
      console.error(`Error al obtener detalles del pago: ${paymentResponse.status} - ${errorMessage}`);
      return res.status(paymentResponse.status).json({ error: `Error al procesar el webhook: ${errorMessage}` });
    }

    const paymentDetails = await paymentResponse.json();
    console.log("Detalles del pago:", paymentDetails);

    const items = paymentDetails.additional_info?.items;
    if (!items || items.length === 0) {
      console.error("No se encontraron productos en la transacción.");
      return res.status(400).json({ error: "No se encontraron productos en la transacción." });
    }

    for (const item of items) {
      const productId = item.id;
      const quantity = item.quantity;

      if (!productId) {
        console.error(`No se pudo determinar un identificador para el producto: ${JSON.stringify(item)}`);
        return res.status(400).json({ error: "Falta un identificador para el producto." });
      }

      if (!quantity || quantity <= 0) {
        console.error(`Cantidad inválida para el producto ${productId}: ${quantity}`);
        return res.status(400).json({ error: `Cantidad inválida para el producto ${productId}.` });
      }

      const result = await updateProductStock(productId, quantity);
      if (!result.success) {
        console.error(`Error al actualizar el stock para el producto ${productId} : ${result.error}`);
        return res.status(400).json({ error: result.error });
      }

      console.log(`Stock actualizado para producto ${productId}: nuevo stock = ${result.newStock}`);
    }

    res.status(200).send("Stock actualizado correctamente.");
  } catch (error) {
    console.error("Error en el webhook:", error.message);
    res.status(500).json({ error: "Error al procesar el webhook." });
  }
};

module.exports = { handleWebhook };

const ACCESS_TOKEN = "APP_USR-2813772825895965-112617-112db10aa30998457e1886b1f8cf6787-2114869553";

const createPreference = async (req, res) => {
  const { items } = req.body;

  const preference = {
    items: items.map((item) => ({
      id: item.ProductId,
      title: item.title,
      quantity: Number(item.quantity),
      unit_price: item.unit_price,
      currency_id: "UYU",
    })),
    back_urls: {
      success: "https://apiprueba-ekhkb4ebchfqhubg.canadacentral-01.azurewebsites.net/webhook", 
    },
    auto_return: "approved", 
    binary_mode: true, 
  };

  try {
    // Importación dinámica de fetch
    const { default: fetch } = await import("node-fetch");

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify(preference),
    });

    if (!response.ok) {
      throw new Error(`Error en la creación de preferencia: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data);
    return res.status(200).json({
      id: data.id,
      init_point: data.init_point,
    });
  } catch (error) {
    console.error("Error al crear la preferencia:", error.message);
    return res.status(500).json({ error: "Error al procesar el pago" });
  }
};

module.exports = { createPreference };

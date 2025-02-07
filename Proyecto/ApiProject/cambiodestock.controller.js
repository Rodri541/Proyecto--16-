const { getConnection } = require("./connection.js");
const sql = require("mssql");

const getCambiosDeStockPorProducto = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input("id", sql.Int, req.params.ProductId)
            .query("SELECT * FROM CambioDeStock WHERE ProductId = @id");
        res.json(result.recordset);
    } catch (e) {
        return res.json({ message: e.message });
    }
};

const deleteCambio = async (req, res) => {
    try {
        const pool = await getConnection();
        const CambioDeStockId = parseInt(req.params.id, 10);
        
        const result = await pool
            .request()
            .input("id", sql.Int, CambioDeStockId)
            .query("DELETE FROM CambioDeStock WHERE CambioDeStockId = @id");

        if (!result.rowsAffected || result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "CambioDeStock no encontrado" });
        }

        res.json({ message: "CambioDeStock borrado exitosamente" });
    } catch (e) {
        console.error("Error al eliminar el cambio de stock:", e);
        return res.status(500).json({ message: "Error interno del servidor", error: e.message });
    }
};

module.exports = {
    getCambiosDeStockPorProducto,
    deleteCambio
  };
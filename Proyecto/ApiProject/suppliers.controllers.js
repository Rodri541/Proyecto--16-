const sql = require('mssql');
const { getConnection } = require('./connection');

module.exports = {
  getSuppliers: async (req, res) => {
    try {
      const pool = await getConnection();

      const result = await pool.request().query("SELECT * FROM Suppliers");

      res.json(result.recordset);
    } catch (e) {
      return res.json({ message: e.message });
    }
  },

  getSupplier: async (req, res) => {
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .input("id", sql.Int, req.params.id)
        .query("SELECT * FROM Suppliers where SupplierId = @id");

      console.log(result);

      if (result.rowsAffected[0] == 0) {
        return res.status(404).json({ message: "Supplier not found" });
      }

      res.json(result.recordset[0]);
    } catch (e) {
      return res.json({ message: e.message });
    }
  },

  postSupplier: async (req, res) => {
    try {
      const pool = await getConnection();

      // Crear el proveedor
      const result = await pool
        .request()
        .input("name", sql.NVarChar(100), req.body.Name)
        .input("phone", sql.NVarChar(15), req.body.Phone)
        .input("cost", sql.Decimal(18, 2), req.body.Cost)
        .input("email", sql.NVarChar(100), req.body.Email)
        .input("lastPurchaseDate", sql.Date, req.body.LastPurchaseDate)
        .query(
          "INSERT INTO Suppliers (Name, Phone, Cost, Email, LastPurchaseDate) OUTPUT INSERTED.SupplierId VALUES (@name, @phone, @cost, @Email, @lastPurchaseDate)"
        );

      const supplierId = result.recordset[0].SupplierId;

      // Insertar productos en la tabla intermedia ProductSupplier
      if (req.body.ProductIds && req.body.ProductIds.length > 0) {
        const productQueries = req.body.ProductIds.map(productId =>
          pool
            .request()
            .input("supplierId", sql.Int, supplierId)
            .input("productId", sql.Int, productId)
            .query("INSERT INTO ProductSupplier (SupplierId, ProductId) VALUES (@supplierId, @productId)")
        );
        // Ejecutamos todas las inserciones de los productos en paralelo
        await Promise.all(productQueries);
      }

      res.json({
        SupplierId: supplierId,
        Name: req.body.Name,
        Phone: req.body.Phone,
        Cost: req.body.Cost,
        Email: req.body.Email,
        LastPurchaseDate: req.body.LastPurchaseDate,
        ProductIds: req.body.ProductIds,
      });
    } catch (e) {
      return res.json({ message: e.message });
    }
  },

  putSupplier: async (req, res) => {
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .input("id", sql.Int, req.params.id)
        .input("name", sql.NVarChar(100), req.body.Name)
        .input("phone", sql.NVarChar(15), req.body.Phone)
        .input("productId", sql.Int, req.body.ProductId)
        .input("cost", sql.Decimal(18, 2), req.body.Cost)
        .input("email", sql.NVarChar(100), req.body.Email)
        .input("lastPurchaseDate", sql.Date, req.body.LastPurchaseDate)
        .query(
          "UPDATE Suppliers SET Name = @name, Phone = @phone, ProductId = @productId, Cost = @cost, Email = @email, LastPurchaseDate = @lastPurchaseDate WHERE SupplierId = @id"
        );

      if (result.rowsAffected[0] == 0) {
        return res.status(404).json({ message: "Supplier not found" });
      }

      res.json({
        SupplierId: req.params.id,
        Name: req.body.Name,
        Phone: req.body.Phone,
        ProductId: req.body.ProductId,
        Cost: req.body.Cost,
        Email: req.body.Email,
        LastPurchaseDate: req.body.LastPurchaseDate,
      });
    } catch (e) {
      return res.json({ message: e.message });
    }
  },

  deleteSupplier: async (req, res) => {
    try {
      const pool = await getConnection();

      // Verificar si el proveedor tiene productos asignados
      const result = await pool
        .request()
        .input("id", sql.Int, req.params.id)
        .query(`
          SELECT COUNT(*) AS ProductCount
          FROM ProductSupplier
          WHERE SupplierId = @id
        `);

      // Si el proveedor tiene productos asignados, no permitir la eliminación
      if (result.recordset[0].ProductCount > 0) {
        return res.status(400).json({
          message: "No se puede eliminar el proveedor porque tiene productos asignados."
        });
      }

      // Si el proveedor no tiene productos asignados, proceder con la eliminación
      const deleteResult = await pool
        .request()
        .input("id", sql.Int, req.params.id)
        .query("DELETE FROM Suppliers WHERE SupplierId = @id");

      if (deleteResult.rowsAffected[0] == 0) {
        return res.status(404).json({ message: "Supplier not found" });
      }

      res.json({ message: "Supplier deleted successfully" });
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  },

  getProductSupplier: async (req, res) => {
    try {
      const pool = await getConnection();

      // Solo necesitamos SupplierId para obtener los productos asociados a un proveedor
      const result = await pool
        .request()
        .input("SupplierId", sql.Int, req.params.id)
        .query(`
          SELECT p.Name
          FROM Products p
          INNER JOIN ProductSupplier ps ON p.ProductId = ps.ProductId
          WHERE ps.SupplierId = @SupplierId
        `);

      // Retorna los nombres de los productos asociados a ese proveedor
      res.json(result.recordset);
    } catch (e) {
      console.error("Error al obtener los productos del proveedor", e);
      return res.status(500).json({ message: e.message });
    }
  }
};

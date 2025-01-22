const { BlobServiceClient } = require('@azure/storage-blob');
const fs = require('fs');
const path = require('path');
const { getConnection } = require("./connection.js");
const sql = require("mssql");

const getProducts = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM Products");
    res.json(result.recordset);
  } catch (e) {
    return res.json({ message: e.message });
  }
};

const getProductsPerCategory = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, req.params.idCategory)
      .query("SELECT * FROM Products WHERE CategoryId = @id");
    res.json(result.recordset);
  } catch (e) {
    return res.json({ message: e.message });
  }
};

const getProductsPerName = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("name", sql.VarChar, req.params.NameProduct)
      .query("SELECT * FROM Products WHERE Name = @name");
    res.json(result.recordset);
  } catch (e) {
    return res.json({ message: e.message });
  }
};

const getProductsColors = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("ProductId", sql.Int, req.params.id)
      .query(`
        SELECT c.ColorId, c.Name
        FROM ProductColor pc
        INNER JOIN Colors c ON pc.ColorId = c.ColorId
        WHERE pc.ProductId = @ProductId
      `);
    res.json(result.recordset);
  } catch (e) {
    return res.json({ message: e.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, req.params.id)
      .query("SELECT * FROM Products where ProductId = @id");

    if (result.rowsAffected[0] == 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(result.recordset[0]);
  } catch (e) {
    return res.json({ message: e.message });
  }
};

const AZURE_STORAGE_CONNECTION_STRING = 'DefaultEndpointsProtocol=https;AccountName=lacandelaalmacenamiento;AccountKey=yLrwbIGPnfkqZVHUevFj+Qvr4lzXXg91QzanZekpSUu1PYmnAIOnQ29XMpVm+z103IlWaesaKyoR+ASt5eb/uw==;EndpointSuffix=core.windows.net';

const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerName = 'contenedor';

const uploadImageToAzureBlob = async (file) => {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobName = `product-${Date.now()}-${file.originalname}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  const uploadBlobResponse = await blockBlobClient.uploadFile(file.path);
  console.log(`Subido a ${blobName} exitosamente`, uploadBlobResponse);

  return blockBlobClient.url;
};

const postProduct = async (req, res) => {
  try {
    if (req.file) {
      const imageUrl = await uploadImageToAzureBlob(req.file);

      const pool = await getConnection();
      const result = await pool
        .request()
        .input("name", sql.NVarChar(100), req.body.Name)
        .input("price", sql.Decimal(18, 2), req.body.Price)
        .input("cost", sql.Decimal(18, 2), req.body.Cost)
        .input("description", sql.NVarChar(255), req.body.Description)
        .input("quantity", sql.Int, req.body.Quantity)
        .input("categoryId", sql.Int, req.body.CategoryId)
        .input("imageUrl", sql.VarChar(255), imageUrl)
        .input("creationDate", sql.DateTime, new Date())
        .input("rate", sql.Decimal(3, 2), req.body.Rate)
        .input("base", sql.Decimal(10, 2), req.body.Base)
        .input("height", sql.Decimal(10, 2), req.body.Height)
        .input("weight", sql.Decimal(10, 2), req.body.Weight)
        .input("volume", sql.Decimal(10, 2), req.body.Volume)
        .input("package", sql.Int, req.body.Package)
        .input("aLaVenta", sql.Bit, req.body.ALaVenta)
        .input("supplierId", sql.Int, req.body.SupplierId)
        .query(`
                    INSERT INTO Products 
                    (Name, Price, Cost, Description, Quantity, CategoryId, ImageUrl, CreationDate, Rate, Base, Height, Weight, Volume, Package, ALaVenta, SupplierId) 
                    VALUES 
                    (@name, @price, @cost, @description, @quantity, @categoryId, @imageUrl, @creationDate, @rate, @base, @height, @weight, @volume, @package, @aLaVenta, @supplierId); 
                    SELECT SCOPE_IDENTITY() AS Id
                `);

      res.json({
        Id: result.recordset[0].Id,
        Name: req.body.Name,
        Price: req.body.Price,
        Cost: req.body.Cost,
        Description: req.body.Description,
        Quantity: req.body.Quantity,
        CategoryId: req.body.CategoryId,
        ImageUrl: imageUrl,
        CreationDate: req.body.CreationDate,
        Base: req.body.Base || null,
        Height: req.body.Height || null,
        Weight: req.body.Weight || null,
        Volume: req.body.Volume || null,
        Package: req.body.Package || null,
        ALaVenta: req.body.ALaVenta,
        SupplierId: req.body.SupplierId,
      });
    } else {
      res.status(400).json({ message: 'No se ha recibido una imagen' });
    }
  } catch (e) {
    return res.json({ message: e.message });
  }
};

const putProduct = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, req.params.id)
      .input("name", sql.NVarChar(100), req.body.Name)
      .input("price", sql.Decimal(18, 2), req.body.Price)
      .input("description", sql.NVarChar(255), req.body.Description)
      .input("quantity", sql.Int, req.body.Quantity)
      .input("alaventa", sql.Bit, req.body.ALaVenta)
      .input("supplierId", sql.Int, req.body.SupplierId)
      .query(
        "UPDATE Products SET Name = @name, Price = @price, Description = @description, Quantity = @quantity, ALaVenta = @alaventa, SupplierId = @supplierId WHERE ProductId = @id"
      );

    if (result.rowsAffected[0] == 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      ProductId: req.params.id,
      Name: req.body.Name,
      Price: req.body.Price,
      Description: req.body.Description,
      Quantity: req.body.Quantity,
      ALaVenta: req.body.ALaVenta,
      SupplierId: req.body.SupplierId,
    });
  } catch (e) {
    return res.json({ message: e.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, req.params.id)
      .query("DELETE FROM Products WHERE ProductId = @id");

    if (result.rowsAffected[0] == 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted" });
  } catch (e) {
    return res.json({ message: e.message });
  }
};

const getTop10ProductsMostSold = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`SELECT TOP 10 
    ProductId, 
    Name, 
    Price, 
    soldCount
  FROM Products
  ORDER BY soldCount DESC, ProductId ASC
  `);
    res.json(result.recordset);
  } catch (e) {
    return res.json({ message: e.message })
  }
}

const getTop10ProductsLeastSold = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`SELECT TOP 10 
    ProductId, 
    Name, 
    Price, 
    soldCount
FROM Products
ORDER BY soldCount ASC, ProductId ASC
  `);
    res.json(result.recordset);
  } catch (e) {
    return res.json({ message: e.message })
  }
}

const updateProductStock = async (productId, quantity) => {
  try {
    if (quantity <= 0) {
      return { success: false, error: "La cantidad debe ser mayor que 0." };
    }

    const pool = await getConnection();
    const transaction = pool.transaction();
    await transaction.begin();

    const result = await transaction
      .request()
      .input("productId", sql.Int, productId)
      .query("SELECT Quantity, soldCount FROM Products WHERE ProductId = @productId");

    if (result.recordset.length === 0) {
      await transaction.rollback();
      return { success: false, error: `Producto con ID ${productId} no encontrado.` };
    }

    const currentStock = result.recordset[0].Quantity;
    const currentSoldCount = result.recordset[0].soldCount;

    if (currentStock < quantity) {
      await transaction.rollback();
      return { success: false, error: `Stock insuficiente para el producto ${productId}. Stock disponible: ${currentStock}` };
    }

    const updatedStock = currentStock - quantity;
    const updatedSoldCount = currentSoldCount + quantity;

    await transaction
      .request()
      .input("productId", sql.Int, productId)
      .input("quantity", sql.Int, updatedStock)
      .input("soldCount", sql.Int, updatedSoldCount)
      .query("UPDATE Products SET Quantity = @quantity, SoldCount = @soldCount WHERE ProductId = @productId");

    await transaction.commit();

    return { success: true, newStock: updatedStock, newSoldCount: updatedSoldCount };
  } catch (error) {
    console.error(`Error al actualizar el stock para el producto ${productId}:`, error.message);
    return { success: false, error: "Error al actualizar el stock." };
  }
};

module.exports = {
  getProducts,
  getProductsPerCategory,
  getProductsPerName,
  getProductsColors,
  getProduct,
  postProduct,
  putProduct,
  deleteProduct,
  updateProductStock,
  getTop10ProductsMostSold,
  getTop10ProductsLeastSold
};
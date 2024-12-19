const { Router } = require('express');
const {
  getSuppliers,
  getSupplier,
  postSupplier,
  putSupplier,
  deleteSupplier,
  getProductSupplier,
} = require('./suppliers.controllers.js');

const router = Router();

//#region proveedores
router.get("/proveedores", getSuppliers);

router.get("/proveedores/:id", getSupplier);

router.post("/proveedores", postSupplier);

router.put("/proveedores/:id", putSupplier);

router.delete("/proveedores/:id", deleteSupplier);
//#endregion

router.get("/proveedores/:id/productos", getProductSupplier);

module.exports = router;

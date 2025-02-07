const { Router } = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const {
    getCambiosDeStockPorProducto,
    deleteCambio,
} = require('./cambiodestock.controller.js');

const router = Router();

//#region Productos
router.get("/cambiosDeStock/:ProductId", getCambiosDeStockPorProducto);

router.delete("/cambiosDeStock/:id", deleteCambio);
//#endregion

module.exports = router;
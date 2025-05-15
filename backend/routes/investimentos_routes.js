// routes/btcRoutes.js
const express = require("express");
const router = express.Router();
const btcController = require("../controllers/btcController");

router.get("/", btcController.getAll);
router.post("/", btcController.addCompra);
router.delete("/:id", btcController.deleteCompra);

module.exports = router;

const validateWarehouseId = (req, res, next) => {
    console.log("pasa por middleware")

    const warehouseId = req.query.warehouseId;

    if (isNaN(warehouseId)) {
        return res.status(400).json({ message: "Invalid warehouseId. It must be a number." });
    }

    next();
};

module.exports = validateWarehouseId;

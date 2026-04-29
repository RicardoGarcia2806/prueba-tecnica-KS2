const express = require('express');
const router = express.Router();
const houseController = require('../controllers/houseController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', houseController.getHouses);
router.get('/:id', houseController.getHouseById);
router.post('/', houseController.createHouse);
router.put('/:id', houseController.updateHouse);
router.delete('/:id', houseController.deleteHouse);

module.exports = router;

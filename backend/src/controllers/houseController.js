const { House, User } = require('../models');

exports.getHouses = async (req, res) => {
  try {
    const houses = await House.findAll({
      include: [{ model: User, as: 'seller', attributes: ['id', 'name', 'email'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(houses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching houses', error: error.message });
  }
};

exports.getHouseById = async (req, res) => {
  try {
    const house = await House.findByPk(req.params.id, {
      include: [{ model: User, as: 'seller', attributes: ['id', 'name', 'email'] }]
    });
    if (!house) return res.status(404).json({ message: 'House not found' });
    res.json(house);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching house', error: error.message });
  }
};

exports.createHouse = async (req, res) => {
  try {
    const { address, price, status, sellerId } = req.body;
    
    // Check if sellerId is valid (could use req.user.id depending on requirements, but sellerId allows an admin to specify)
    const newHouse = await House.create({
      address,
      price,
      status: status || 'disponible',
      sellerId: sellerId || req.user.id
    });
    
    res.status(201).json(newHouse);
  } catch (error) {
    res.status(500).json({ message: 'Error creating house', error: error.message });
  }
};

exports.updateHouse = async (req, res) => {
  try {
    const { address, price, status, sellerId } = req.body;
    const house = await House.findByPk(req.params.id);
    
    if (!house) return res.status(404).json({ message: 'House not found' });

    const isOwner = house.sellerId === req.user.id;
    const isAdmin = req.user.role === 'admin';
    const isEditor = req.user.role === 'editor';

    if (!isOwner && !isAdmin && !isEditor) {
      return res.status(403).json({ message: 'No tienes permiso para editar este inmueble' });
    }

    house.address = address || house.address;
    house.price = price || house.price;
    if (status) house.status = status;
    if (sellerId && req.user.isAdmin) house.sellerId = sellerId;

    await house.save();
    res.json(house);
  } catch (error) {
    res.status(500).json({ message: 'Error updating house', error: error.message });
  }
};

exports.deleteHouse = async (req, res) => {
  try {
    const house = await House.findByPk(req.params.id);
    if (!house) return res.status(404).json({ message: 'House not found' });

    const isOwner = house.sellerId === req.user.id;
    const isAdmin = req.user.role === 'admin';
    const isEditor = req.user.role === 'editor';

    if (!isOwner && !isAdmin && !isEditor) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar este inmueble' });
    }

    await house.destroy();
    res.json({ message: 'House deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting house', error: error.message });
  }
};

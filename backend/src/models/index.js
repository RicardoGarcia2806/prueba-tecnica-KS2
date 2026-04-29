const User = require('./User');
const House = require('./House');

User.hasMany(House, { foreignKey: 'sellerId', as: 'houses' });
House.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });

module.exports = {
  User,
  House,
};

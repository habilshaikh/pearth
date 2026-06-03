if (process.env.DB_PROVIDER === 'local') {
  module.exports = require('./local');
} else {
  const AdminUser = require('./AdminUser');
  const ClientLogo = require('./ClientLogo');
  const ContactMessage = require('./ContactMessage');
  const HomeContent = require('./HomeContent');
  const Inspection = require('./Inspection');
  const Machine = require('./Machine');
  const Product = require('./Product');
  const Service = require('./Service');

  module.exports = {
    AdminUser,
    ClientLogo,
    ContactMessage,
    HomeContent,
    Inspection,
    Machine,
    Product,
    Service,
  };
}

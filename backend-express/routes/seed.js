const express = require('express');
const bcrypt = require('bcryptjs');
const {
  AdminUser,
  ClientLogo,
  HomeContent,
  Inspection,
  Machine,
  Product,
  Service,
} = require('../models');
const {
  defaultHomeContent,
  defaultInspections,
  defaultMachines,
  defaultProducts,
  defaultServices,
} = require('../data/defaultData');

const router = express.Router();

// POST /api/seed - Seed the database with initial data
router.post('/', async (req, res) => {
  try {
    console.log('Starting database seed...');

    const existingAdmin = await AdminUser.findOne({ email: 'admin@saitech.com' });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      await AdminUser.create({
        email: 'admin@saitech.com',
        password: hashedPassword,
      });
      console.log('Admin user created');
    }

    const existingHome = await HomeContent.findOne();
    if (!existingHome) {
      await HomeContent.create(defaultHomeContent);
      console.log('Home content created');
    }

    const servicesCount = await Service.countDocuments();
    if (servicesCount === 0) {
      await Service.insertMany(defaultServices);
      console.log('Services created');
    }

    const productsCount = await Product.countDocuments();
    if (productsCount === 0) {
      await Product.insertMany(defaultProducts);
      console.log('Products created');
    }

    const machinesCount = await Machine.countDocuments();
    if (machinesCount === 0) {
      await Machine.insertMany(defaultMachines);
      console.log('Machines created');
    }

    const inspectionsCount = await Inspection.countDocuments();
    if (inspectionsCount === 0) {
      await Inspection.insertMany(defaultInspections);
      console.log('Inspections created');
    }
    res.json({
      message: 'Database seeded successfully',
      data: {
        admin: 'admin@saitech.com / Admin@123',
        services: await Service.countDocuments(),
        products: await Product.countDocuments(),
        machines: await Machine.countDocuments(),
        inspections: await Inspection.countDocuments(),
        clients: await ClientLogo.countDocuments(),
      },
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ error: 'Failed to seed database', details: error.message });
  }
});

module.exports = router;

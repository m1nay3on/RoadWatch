const crypto = require('node:crypto');
const { promisify } = require('node:util');
const { Category, User } = require('../models');

const scrypt = promisify(crypto.scrypt);
const demoUsers = [
  {
    firstName: 'Juan', lastName: 'Dela Cruz', birthday: '2000-05-15', mobile: '09171234567',
    address: { houseNumber: '123', street: 'Main Street', barangay: 'Commonwealth', city: 'Quezon City' },
    email: 'citizen@roadwatch.com', password: '123456', role: 'Citizen',
  },
  {
    firstName: 'Maria', lastName: 'Santos', birthday: '1995-03-10', mobile: '09181234567',
    address: { houseNumber: '456', street: 'Malaya Street', barangay: 'Malaya', city: 'Quezon City' },
    email: 'inspector@roadwatch.com', password: '123456', role: 'Field Inspector',
  },
  {
    firstName: 'Admin', lastName: 'User', birthday: '1990-01-01', mobile: '09191234567',
    address: { houseNumber: '789', street: 'Central Street', barangay: 'Central', city: 'Quezon City' },
    email: 'admin@roadwatch.com', password: '123456', role: 'Administrator',
  },
];

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = await scrypt(password, salt, 64);
  return `scrypt$${salt}$${derivedKey.toString('hex')}`;
}

async function seedDefaults() {
  if (process.env.NODE_ENV !== 'production' && await User.countDocuments() === 0) {
    const users = await Promise.all(demoUsers.map(async (user) => ({
      ...user,
      email: user.email.toLowerCase(),
      password: await hashPassword(user.password),
      createdAt: new Date(),
    })));
    await User.insertMany(users);
  }

  for (const name of ['Road Damage', 'Streetlight', 'Drainage', 'Public Facility']) {
    let category = await Category.findOne({ $or: [{ category_name: name }, { name }] });
    if (!category) category = new Category({ name, category_name: name, active: true });
    category.name = name;
    category.category_name = name;
    if (category.active === undefined) category.active = true;
    await category.save();
  }
}

module.exports = { hashPassword, seedDefaults };
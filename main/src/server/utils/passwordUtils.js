// src/server/utils/passwordUtils.js
const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  console.log("This is the password inside the hashPassword: ", password);
  return bcrypt.hash(password, salt);
};

  // Utility function to compare passwords
const comparePassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword
};
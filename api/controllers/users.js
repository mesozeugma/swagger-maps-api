'use strict';
const typeorm = require('typeorm');
module.exports = {
  createUser,
};
function createUser(req, res) {
  return createUserAsync(req, res);
}
async function createUserAsync(req, res) {
  try {
    const credentials = req.swagger.params.credentials.value;
    const userRepository = typeorm.getRepository('User');
    await userRepository.save(credentials);
    res.status(201).json();
  } catch (error) {
    const message = 'Error encountered while creating user';
    console.log(message);
    console.log(error);
    res.status(500).json({ message });
  }
}

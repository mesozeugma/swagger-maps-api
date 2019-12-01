'use strict';
const typeorm = require('typeorm');
module.exports = {
  login,
  logout,
};
function login(req, res) {
  return loginAsync(req, res);
}
async function loginAsync(req, res) {
  try {
    const credentials = req.swagger.params.credentials.value;
    const userRepository = typeorm.getRepository('User');
    const user = await userRepository.findOne({
      where: { username: credentials.username },
    });
    if (user) {
      const sessionRepository = typeorm.getRepository('Session');
      const session = await sessionRepository.save({ user });
      await res.status(201).json({ apiKey: session.id });
    } else {
      res.status(401).json({ message: 'Wrong credentials' });
    }
  } catch (error) {
    const message = 'Error encountered while creating session';
    console.log(message);
    console.log(error);
    res.status(500).json({ message });
  }
}
function logout(req, res) {
  return logoutAsync(req, res);
}
async function logoutAsync(req, res) {
  try {
    const session = req.session;
    const sessionRepository = typeorm.getRepository('Session');
    await sessionRepository.delete(session.id);
    res.status(204).json();
  } catch (error) {
    const message = 'Error encountered while deleting session';
    console.log(message);
    console.log(error);
    res.status(500).json({ message });
  }
}

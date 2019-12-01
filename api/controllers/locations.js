'use strict';
const typeorm = require('typeorm');
module.exports = {
  updateLocation,
};
function updateLocation(req, res) {
  return updateLocationAsync(req, res);
}
async function updateLocationAsync(req, res) {
  try {
    const location = req.swagger.params.location.value;
    const user = req.session.user;

    const userRepository = typeorm.getRepository('User');
    await userRepository.save({
      ...user,
      locationLongitude: location.longitude,
      locationLatitude: location.latitude,
    });
    res.status(204).json();
  } catch (error) {
    const message = 'Error encountered while creating location';
    console.log(message);
    console.log(error);
    res.status(500).json({ message });
  }
}

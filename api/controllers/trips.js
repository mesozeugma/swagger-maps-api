'use strict';
const typeorm = require('typeorm');
const request = require('request');
const util = require('util');
const httpGetAsync = util.promisify(request.get);
module.exports = {
  createTrip,
  destroyTrip,
  listTrips,
  showTrip,
};

const NOMINATIM_GEOCODE_API_URL = 'https://nominatim.openstreetmap.org/search';
const OSRM_ROUTE_API_URL = 'https://router.project-osrm.org/route/v1/car';

function createTrip(req, res) {
  return createTripAsync(req, res);
}

async function createTripAsync(req, res) {
  try {
    const tripDTO = req.swagger.params.trip.value;
    const user = req.session.user;

    let from = {
      longitude: user.locationLongitude,
      latitude: user.locationLatitude,
    };
    if (tripDTO.from) {
      from = await getGeocode(tripDTO.from);
    } else if (from.longitude === undefined || from.latitude === undefined) {
      res
        .status(400)
        .json({ message: 'No from location specified or found in session' });
      return;
    }
    const to = await getGeocode(tripDTO.to);
    if (!from || !to) {
      res.status(400).json({ message: 'Can not get coordinates for location' });
      return;
    }

    const route = await getRoute(from, to);

    const tripRepository = typeorm.getRepository('Trip');
    const trip = await tripRepository.save({
      ...tripObjectToEntity({ name: tripDTO.name, from, to }),
      user,
    });
    res.status(201).json({ ...tripEntityToObject(trip), route });
  } catch (error) {
    const message = 'Error encountered while creating trip';
    console.log(message);
    console.log(error);
    res.status(500).json({ message });
  }
}

function destroyTrip(req, res) {
  return destroyTripAsync(req, res);
}
async function destroyTripAsync(req, res) {
  try {
    const tripId = req.swagger.params.tripId.value;
    const user = req.session.user;

    const tripRepository = typeorm.getRepository('Trip');
    const trip = await tripRepository.findOne({
      where: { id: tripId, userId: user.id },
    });
    if (trip) {
      await tripRepository.delete(tripId);
      res.status(204).json();
    } else {
      res.status(404).json({ message: 'Trip not found' });
    }
  } catch (error) {
    const message = 'Error encountered while deleting trip';
    console.log(message);
    console.log(error);
    res.status(500).json({ message });
  }
}

function listTrips(req, res) {
  return listTripsAsync(req, res);
}
async function listTripsAsync(req, res) {
  try {
    const user = req.session.user;

    const tripRepository = typeorm.getRepository('Trip');
    const trips = await tripRepository.find({
      where: { userId: user.id },
    });
    res.json(trips.map(tripEntityToObject));
  } catch (error) {
    const message = 'Error encountered while listing trips';
    console.log(message);
    console.log(error);
    res.status(500).json({ message });
  }
  res.json();
}

function showTrip(req, res) {
  return showTripAsync(req, res);
}

async function showTripAsync(req, res) {
  try {
    const tripId = req.swagger.params.tripId.value;
    const user = req.session.user;

    const tripRepository = typeorm.getRepository('Trip');
    const trip = await tripRepository.findOne({
      where: { id: tripId, userId: user.id },
    });
    if (trip) {
      const tripObject = tripEntityToObject(trip);
      const route = await getRoute(tripObject.from, tripObject.to);

      res.status(200).json({ ...tripObject, route });
    } else {
      res.status(404).json({ message: 'Trip not found' });
    }

    res.json();
  } catch (error) {
    const message = 'Error encountered while showing trip';
    console.log(message);
    console.log(error);
    res.status(500).json({ message });
  }
}

async function getGeocode(str) {
  try {
    const response = await httpGetAsync(NOMINATIM_GEOCODE_API_URL, {
      qs: { format: 'json', q: str },
      headers: { 'User-Agent': 'PostmanRuntime/7.19.0' },
    });
    const jsonBody = JSON.parse(response.body);
    if (Array.isArray(jsonBody) && jsonBody.length > 0) {
      const { lon, lat } = jsonBody[0];
      return { longitude: Number(lon), latitude: Number(lat) };
    } else {
      return null;
    }
  } catch (error) {
    console.log('Error body getGeocode');
    console.log(error.body);
    throw new Error('Error while getting geocode');
  }
}

async function getRoute(from, to) {
  try {
    const response = await httpGetAsync(
      `${OSRM_ROUTE_API_URL}/${from.longitude},${from.latitude};${to.longitude},${to.latitude}`,
      {
        headers: { 'User-Agent': 'PostmanRuntime/7.19.0' },
      },
    );
    const jsonBody = JSON.parse(response.body);
    return jsonBody.waypoints.map(
      ({ distance, name, location: [longitude, latitude] }) => ({
        distance,
        name,
        location: { longitude, latitude },
      }),
    );
  } catch (error) {
    console.log('Error body getRoute');
    console.log(error.body);
    throw new Error('Error while getting route');
  }
}

function tripObjectToEntity(tripObject) {
  return {
    id: tripObject.id,
    name: tripObject.name,
    fromLongitude: tripObject.from.longitude,
    fromLatitude: tripObject.from.latitude,
    toLongitude: tripObject.to.longitude,
    toLatitude: tripObject.to.latitude,
  };
}

function tripEntityToObject(tripEntity) {
  return {
    id: tripEntity.id,
    name: tripEntity.name,
    from: {
      longitude: tripEntity.fromLongitude,
      latitude: tripEntity.fromLatitude,
    },
    to: { longitude: tripEntity.toLongitude, latitude: tripEntity.toLatitude },
  };
}

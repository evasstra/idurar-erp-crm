const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const { geocodeAddress } = require('@/services/geocoding');
const summary = require('./summary');

function modelController() {
  const Model = mongoose.model('Client');
  const methods = createCRUDController('Client');
  
  // Save reference to original create method
  const originalCreate = methods.create;
  
  // Override create method to add geocoding
  methods.create = async (req, res) => {
    const { address } = req.body;
    
    if (address) {
      try {
        const geocodingResult = await geocodeAddress(address);
        req.body.latitude = geocodingResult.latitude;
        req.body.longitude = geocodingResult.longitude;
        
        // Add geocoding result to response body
        req.body.geocoding = {
          status: geocodingResult.status,
          message: geocodingResult.message
        };
      } catch (error) {
        console.error('Geocoding failed:', error);
        res.geocoding = {
          status: 'error',
          message: 'Geocoding service error'
        };
      }
    }
    
    return originalCreate(req, res);
  };
  
  // Save reference to original update method
  const originalUpdate = methods.update;
  
  // Override update method to add geocoding
  methods.update = async (req, res) => {
    const { address } = req.body;
    
    if (address) {
      try {
        const geocodingResult = await geocodeAddress(address);
        req.body.latitude = geocodingResult.latitude;
        req.body.longitude = geocodingResult.longitude;
        
        // Add geocoding result to response
        res.geocoding = {
          status: geocodingResult.status,
          message: geocodingResult.message
        };
      } catch (error) {
        console.error('Geocoding failed:', error);
        res.geocoding = {
          status: 'error',
          message: 'Geocoding service error'
        };
      }
    }
    
    return originalUpdate(req, res);
  };
  
  // Save reference to original list method
  const originalList = methods.list;
  
  // Override list method to add location filter
  methods.list = async (req, res) => {
    const { onlyWithLocation } = req.query;
    
    if (onlyWithLocation) {
      req.query = {
        ...req.query,
        filter: {
          ...req.query.filter,
          latitude: { $ne: null },
          longitude: { $ne: null }
        }
      };
    }
    
    return originalList(req, res);
  };

  methods.summary = (req, res) => summary(Model, req, res);

  // New endpoint to get customers with valid location data
  methods.listWithLocation = async (req, res) => {
    try {
      const { skip, limit, filter, sort } = req.query;
      
      // Only include customers with valid latitude/longitude
      const locationFilter = {
        latitude: { $ne: null, $exists: true },
        longitude: { $ne: null, $exists: true }
      };
      const finalFilter = { ...filter, ...locationFilter };

      const items = await Model.find(finalFilter)
        .skip(Number(skip))
        .limit(Number(limit))
        .sort(sort)
        .exec();

      const total = await Model.countDocuments(finalFilter);

      return res.status(200).json({
        success: true,
        result: items,
        total,
        message: 'Successfully found all documents',
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        result: [],
        total: 0,
        message: err.message,
      });
    }
  };

  return methods;
}

module.exports = modelController();

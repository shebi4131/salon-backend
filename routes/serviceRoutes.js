import express from 'express';
import Service from '../models/Service.js';

const router = express.Router();

// GET: Get all services
router.get('/', async (req, res) => {
  try {
    console.log('📥 Received GET request for all services');
    
    const services = await Service.find().sort({ createdAt: -1 });
    
    console.log(`✅ Found ${services.length} services`);
    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
    
  } catch (err) {
    console.error('❌ Error fetching services:', err);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch services',
      message: err.message 
    });
  }
});

// GET: Get single service by ID
router.get('/:id', async (req, res) => {
  try {
    console.log('📥 Received GET request for service ID:', req.params.id);
    
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      });
    }
    
    console.log('✅ Service found:', service.name);
    res.status(200).json({
      success: true,
      data: service
    });
    
  } catch (err) {
    console.error('❌ Error fetching service:', err);
    
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid service ID'
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch service',
      message: err.message 
    });
  }
});

// POST: Add new service
router.post('/', async (req, res) => {
  try {
    console.log('📥 Received POST request body:', req.body);
    
    const { name, description, price, duration, imageUrl } = req.body;
    
    if (!name || !description || !price || !duration || !imageUrl) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ 
        error: 'Missing required fields',
        received: { name, description, price, duration, imageUrl }
      });
    }

    console.log('✅ Creating new service with data:', {
      name, description, price, duration, imageUrl
    });

    const newService = new Service({
      name,
      description,
      price,
      duration,
      imageUrl
    });

    console.log('💾 Attempting to save service...');
    const savedService = await newService.save();
    
    console.log('✅ Service saved successfully:', savedService);
    res.status(201).json(savedService);
    
  } catch (err) {
    console.error('❌ Error saving service:', err);
    
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ 
        error: 'Validation Error',
        details: errors 
      });
    }
    
    res.status(500).json({ 
      error: 'Internal server error',
      message: err.message 
    });
  }
});

export default router;
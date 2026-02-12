const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const sponsorController = require('../controllers/sponsor.controller');
const { verifyToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// Create multiple file upload middleware
const uploadFiles = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'rc', maxCount: 1 },
    { name: 'insurance', maxCount: 1 },
    { name: 'puc', maxCount: 1 }
]);

// Auth Routes (no /sponsor prefix for these)
router.post('/register', authController.registerSponsor);
router.post('/login', authController.loginSponsor);

// Sponsor Routes (with /sponsor prefix)
router.get('/sponsor/profile', verifyToken, authController.getSponsorProfile);
router.put('/sponsor/update-bank-details', verifyToken, authController.updateBankDetails);
router.get('/sponsor/dashboard', verifyToken, sponsorController.getDashboard);
router.post('/sponsor/add-bike', verifyToken, uploadFiles, sponsorController.addBike);
router.get('/sponsor/my-bikes', verifyToken, sponsorController.getMyBikes);
router.patch('/sponsor/bikes/:id/availability', verifyToken, sponsorController.toggleAvailability);
router.get('/sponsor/revenue', verifyToken, sponsorController.getRevenue);

// Fleet Management (Admin Setup)
router.get('/admin/fleet', sponsorController.getFleetData);
router.post('/admin/assign-fleet', sponsorController.assignFleet);

module.exports = router;

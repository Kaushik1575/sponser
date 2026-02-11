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

// Auth Routes
router.post('/register', authController.registerSponsor);
router.post('/login', authController.loginSponsor);
router.get('/profile', verifyToken, authController.getSponsorProfile);
router.put('/update-bank-details', verifyToken, authController.updateBankDetails);

// Sponsor Vehicle Routes
router.post('/add-bike', verifyToken, uploadFiles, sponsorController.addBike);
router.get('/my-bikes', verifyToken, sponsorController.getMyBikes);

module.exports = router;

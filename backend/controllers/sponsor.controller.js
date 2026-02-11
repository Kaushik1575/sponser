const { uploadToSupabase } = require('../utils/supabaseStorage');
const SupabaseDB = require('../models/supabaseDB');
const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET || 'uploads';

exports.addBike = async (req, res) => {
    try {
        const userId = req.user.id; // From middleware
        // Form Data
        const { name, bikeNumber, model, year, pricePerHour } = req.body;

        // Files from memory storage (multer)
        const imageFile = req.files['image'] ? req.files['image'][0] : null;
        const rcFile = req.files['rc'] ? req.files['rc'][0] : null;
        const insuranceFile = req.files['insurance'] ? req.files['insurance'][0] : null;
        const pucFile = req.files['puc'] ? req.files['puc'][0] : null;

        if (!name || !bikeNumber || !pricePerHour) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Upload files to Supabase Storage
        const uploadPromises = [
            imageFile ? uploadToSupabase(imageFile, SUPABASE_BUCKET, 'bikes') : null,
            rcFile ? uploadToSupabase(rcFile, SUPABASE_BUCKET, 'documents') : null,
            insuranceFile ? uploadToSupabase(insuranceFile, SUPABASE_BUCKET, 'documents') : null,
            pucFile ? uploadToSupabase(pucFile, SUPABASE_BUCKET, 'documents') : null
        ];

        const [imageUrl, rcUrl, insuranceUrl, pucUrl] = await Promise.all(uploadPromises);

        // Prepare vehicle data
        const vehicleData = {
            name,
            registration_number: bikeNumber,
            model,
            year: parseInt(year),
            price_per_hour: parseFloat(pricePerHour),
            image: imageUrl,
            rc_url: rcUrl,
            insurance_url: insuranceUrl,
            puc_url: pucUrl,
            sponsor_id: userId, // References sponsors table
            is_available: true,
            is_approved: false, // Pending admin approval
            type: 'bike'
        };

        const newBike = await SupabaseDB.addBike(vehicleData);

        res.status(201).json({
            message: 'Vehicle submitted for approval',
            bike: newBike
        });

    } catch (error) {
        console.error('Error adding bike:', error);
        res.status(500).json({ error: 'Failed to add vehicle' });
    }
};

exports.getMyBikes = async (req, res) => {
    try {
        const userId = req.user.id;
        const bikes = await SupabaseDB.getSponsorBikes(userId);
        res.json({ bikes });
    } catch (error) {
        console.error('Error fetching bikes:', error);
        res.status(500).json({ error: 'Failed to fetch bikes' });
    }
};

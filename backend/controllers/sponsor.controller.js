const { uploadToSupabase } = require('../utils/supabaseStorage');
const SponsorModel = require('../models/sponsorModel');
const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET || 'uploads';

exports.addBike = async (req, res) => {
    try {
        const userId = req.user.id; // From middleware
        // Form Data
        const { name, bikeNumber, model, year, pricePerHour, type } = req.body;

        // Files from memory storage (multer)
        const imageFile = req.files['image'] ? req.files['image'][0] : null;
        const rcFile = req.files['rc'] ? req.files['rc'][0] : null;
        const insuranceFile = req.files['insurance'] ? req.files['insurance'][0] : null;
        const pucFile = req.files['puc'] ? req.files['puc'][0] : null;

        if (!name || !bikeNumber || !pricePerHour || !type) {
            return res.status(400).json({ error: 'Missing required fields (including vehicle type)' });
        }

        // Upload files to Supabase Storage
        const uploadPromises = [
            imageFile ? uploadToSupabase(imageFile, SUPABASE_BUCKET, 'bikes') : null,
            rcFile ? uploadToSupabase(rcFile, SUPABASE_BUCKET, 'documents') : null,
            insuranceFile ? uploadToSupabase(insuranceFile, SUPABASE_BUCKET, 'documents') : null,
            pucFile ? uploadToSupabase(pucFile, SUPABASE_BUCKET, 'documents') : null
        ];

        const [imageUrl, rcUrl, insuranceUrl, pucUrl] = await Promise.all(uploadPromises);

        // Prepare vehicle data for staging table
        // Matches the structure used in RentHub's addVehicle
        const vehicleData = {
            name,
            registration_number: bikeNumber,
            model,
            year: parseInt(year),
            price: parseFloat(pricePerHour), // Standardize to 'price'
            image_url: imageUrl,            // Standardize to 'image_url'
            rc_url: rcUrl,
            insurance_url: insuranceUrl,
            puc_url: pucUrl,
            sponsor_id: userId,
            is_available: false,
            is_approved: false,
            type: type // Use provided type
        };

        const newRequest = await SponsorModel.addSponsorVehicle(vehicleData);

        res.status(201).json({
            message: 'Vehicle submitted for approval',
            request: newRequest
        });

    } catch (error) {
        console.error('Error adding bike:', error);
        res.status(500).json({ error: 'Failed to add vehicle' });
    }
};

exports.getMyBikes = async (req, res) => {
    try {
        const userId = req.user.id;
        const bikes = await SponsorModel.getSponsorVehicles(userId);
        res.json({ bikes });
    } catch (error) {
        console.error('Error fetching bikes:', error);
        res.status(500).json({ error: 'Failed to fetch bikes' });
    }
};

exports.getDashboard = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get sponsor's vehicles
        const vehicles = await SponsorModel.getSponsorVehicles(userId);

        // Calculate stats
        const totalVehicles = vehicles.length;
        const approvedVehicles = vehicles.filter(v => v.status === 'approved').length;
        const pendingVehicles = vehicles.filter(v => v.status === 'pending').length;
        const rejectedVehicles = vehicles.filter(v => v.status === 'rejected').length;

        // Fetch real revenue stats
        const { totalBookings, totalRideHours, totalRevenue } = await SponsorModel.getSponsorStats(userId);

        res.json({
            totalBikes: totalVehicles,
            totalVehicles,
            approvedVehicles,
            pendingVehicles,
            rejectedVehicles,
            totalBookings,
            totalRideHours,
            totalRevenue,
            netEarnings: totalRevenue * 0.85, // Assuming 15% platform fee deducted? Or just return revenue
            recentVehicles: vehicles.slice(0, 5)
        });
    } catch (error) {
        console.error('Error fetching dashboard:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
};

exports.toggleAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        const { isAvailable, type } = req.body;

        if (!type || !['bike', 'car', 'scooty'].includes(type)) {
            return res.status(400).json({ error: 'Valid vehicle type (bike/car/scooty) is required' });
        }

        const vehicle = await SponsorModel.toggleVehicleAvailability(id, type, isAvailable);
        res.json({ message: 'Availability updated', vehicle });

    } catch (error) {
        console.error('Error toggling availability:', error);
        res.status(500).json({ error: 'Failed to update availability' });
    }
};

exports.getRevenue = async (req, res) => {
    try {
        const userId = req.user.id;
        const stats = await SponsorModel.getDetailedRevenueStats(userId);

        // 70% to Sponsor, 30% to Platform
        const gross = stats.grossRevenue || 0;
        const commission = gross * 0.30;
        const net = gross - commission; // 70%

        res.json({
            grossRevenue: gross,
            commission: commission,
            netEarnings: net,
            transactions: stats.transactions || [],
            vehicleStats: stats.vehicleStats || []
        });
    } catch (error) {
        console.error('Error fetching revenue:', error);
        res.status(500).json({ error: 'Failed to fetch revenue stats' });
    }
};

exports.getFleetData = async (req, res) => {
    try {
        const vehicles = await SponsorModel.getAllVehiclesAdmin();
        const sponsors = await SponsorModel.getAllSponsorsAdmin();
        res.json({ vehicles, sponsors });
    } catch (e) {
        console.error('Error fetching fleet data:', e);
        res.status(500).json({ error: 'Failed to fetch fleet data' });
    }
};

exports.assignFleet = async (req, res) => {
    try {
        const { sponsorId, assignments } = req.body; // assignments: [{id, type}]

        if (!sponsorId || !assignments || !Array.isArray(assignments)) {
            return res.status(400).json({ error: 'Invalid data' });
        }

        let count = 0;
        for (const item of assignments) {
            await SponsorModel.assignVehicleToSponsor(item.id, item.type, sponsorId);
            count++;
        }
        res.json({ success: true, message: `Assigned ${count} vehicles successfully` });
    } catch (e) {
        console.error('Error assigning fleet:', e);
        res.status(500).json({ error: 'Failed to assign vehicles' });
    }
};

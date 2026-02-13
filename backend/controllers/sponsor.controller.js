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

        // Calculate vehicle status stats
        const totalVehicles = vehicles.length;
        const approvedVehicles = vehicles.filter(v => v.status === 'approved').length;
        const pendingVehicles = vehicles.filter(v => v.status === 'pending').length;
        const rejectedVehicles = vehicles.filter(v => v.status === 'rejected').length;

        // Fetch real revenue stats (using same source as Revenue page for consistency)
        const { grossRevenue, transactions, vehicleStats, netEarnings, totalWithdrawn } = await SponsorModel.getDetailedRevenueStats(userId);

        // Calculate Revenue Trend (Monthly for current year)
        const currentYear = new Date().getFullYear();
        const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlyRevenue = monthsShort.map(m => ({ name: m, revenue: 0, bookings: 0 }));

        transactions.forEach(t => {
            if (t.type === 'Debit') return; // Skip withdrawals for revenue/booking charts

            const d = new Date(t.raw_date || t.date);
            if (d.getFullYear() === currentYear) {
                const monthIdx = d.getMonth();
                monthlyRevenue[monthIdx].revenue += t.amount;
                monthlyRevenue[monthIdx].bookings += 1;
            }
        });

        // Prepare Top Vehicles for Pie Chart
        const topVehicles = vehicleStats
            .sort((a, b) => b.total - a.total)
            .slice(0, 5)
            .map(v => ({ name: v.name, value: v.total }));

        // Calculate Total Ride Hours from vehicle stats
        const totalRideHours = vehicleStats.reduce((acc, curr) => acc + (curr.hours || 0), 0);

        res.json({
            totalBikes: totalVehicles,
            totalVehicles,
            approvedVehicles,
            pendingVehicles,
            rejectedVehicles,
            totalBookings: transactions.filter(t => t.type !== 'Debit').length, // Filter out withdrawals
            totalRideHours,
            totalRevenue: grossRevenue,
            netEarnings: netEarnings, // Use calculated net earnings (withdrawals deducted)
            totalWithdrawn: totalWithdrawn || 0,
            revenueChart: monthlyRevenue,
            vehicleChart: topVehicles,
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
        const commission = stats.commission || (gross * 0.30);
        const net = stats.netEarnings || (gross - commission); // Use model calculation (deducts withdrawals)
        const withdrawn = stats.totalWithdrawn || 0;

        res.json({
            grossRevenue: gross,
            commission: commission,
            netEarnings: net,
            totalWithdrawn: withdrawn,
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

/**
 * Update Vehicle Details
 */
exports.updateVehicle = async (req, res) => {
    try {
        const vehicleId = req.params.id;
        const userId = req.user.id;
        const { name, price, type } = req.body;

        // Determine table
        let tableName = 'bikes';
        if (type === 'car') tableName = 'cars';
        if (type === 'scooty' || type === 'scooter') tableName = 'scooty';

        // Verify ownership
        const { data: vehicle, error: fetchError } = await supabase
            .from(tableName)
            .select('*')
            .eq('id', vehicleId)
            .eq('sponsor_id', userId)
            .single();

        if (fetchError || !vehicle) {
            return res.status(404).json({ error: 'Vehicle not found or unauthorized' });
        }

        // Update
        const updateData = {};
        if (name) updateData.name = name;
        if (price) updateData.price = price;

        const { error: updateError } = await supabase
            .from(tableName)
            .update(updateData)
            .eq('id', vehicleId);

        if (updateError) {
            console.error('Update error:', updateError);
            return res.status(500).json({ error: 'Failed to update vehicle' });
        }

        res.json({ success: true, message: 'Vehicle updated successfully' });
    } catch (error) {
        console.error('Error updating vehicle:', error);
        res.status(500).json({ error: 'Failed to update vehicle' });
    }
};

/**
 * Delete Vehicle
 */
exports.deleteVehicle = async (req, res) => {
    try {
        const vehicleId = req.params.id;
        const userId = req.user.id;
        const { type } = req.body;

        // Determine table
        let tableName = 'bikes';
        if (type === 'car') tableName = 'cars';
        if (type === 'scooty' || type === 'scooter') tableName = 'scooty';

        // Verify ownership
        const { data: vehicle, error: fetchError } = await supabase
            .from(tableName)
            .select('*')
            .eq('id', vehicleId)
            .eq('sponsor_id', userId)
            .single();

        if (fetchError || !vehicle) {
            return res.status(404).json({ error: 'Vehicle not found or unauthorized' });
        }

        // Delete
        const { error: deleteError } = await supabase
            .from(tableName)
            .delete()
            .eq('id', vehicleId);

        if (deleteError) {
            console.error('Delete error:', deleteError);
            return res.status(500).json({ error: 'Failed to delete vehicle' });
        }

        res.json({ success: true, message: 'Vehicle deleted successfully' });
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        res.status(500).json({ error: 'Failed to delete vehicle' });
    }
};

exports.getSponsorEarningsReport = async (req, res) => {
    try {
        const rawStats = await SponsorModel.getSponsorEarningsReport();

        // Calculate derived fields
        // 1. Map to report format
        const report = (rawStats || []).map(stat => {
            const revenue = stat.revenue || 0;
            const share = revenue * 0.70;
            const fee = revenue * 0.30;
            const withdrawn = stat.withdrawn || 0;
            const balance = share - withdrawn;

            return {
                id: stat.id,
                name: stat.name,
                email: stat.email,
                totalRevenue: revenue,
                sponsorShare: share,
                platformFee: fee,
                withdrawn: withdrawn,
                balance: balance,
                bookings: stat.bookings,
                vehicleCount: stat.vehicleCount
            };
        });

        // 2. Calculate Totals for Summary Cards
        const totals = report.reduce((acc, curr) => ({
            totalRevenue: acc.totalRevenue + curr.totalRevenue,
            sponsorShare: acc.sponsorShare + curr.sponsorShare,
            platformFee: acc.platformFee + curr.platformFee,
            totalPaid: acc.totalPaid + curr.withdrawn,
            pendingBalance: acc.pendingBalance + curr.balance
        }), {
            totalRevenue: 0,
            sponsorShare: 0,
            platformFee: 0,
            totalPaid: 0,
            pendingBalance: 0
        });

        res.json({ report, totals });

    } catch (error) {
        console.error('Error generating sponsor report:', error);
        res.status(500).json({ error: 'Failed to generate report' });
    }
};

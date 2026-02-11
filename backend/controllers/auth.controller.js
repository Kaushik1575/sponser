const SupabaseDB = require('../models/supabaseDB');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Sponsor Registration
 */
exports.registerSponsor = async (req, res) => {
    try {
        const {
            fullName, email, phoneNumber, password, confirmPassword,
            bankAccount, ifscCode, upiId, address
        } = req.body;

        // Check if sponsor already exists
        const existingSponsor = await SupabaseDB.getSponsorByEmail(email);
        if (existingSponsor) {
            return res.status(400).json({ error: 'Email already registered as sponsor' });
        }

        // Validate passwords
        if (!confirmPassword) return res.status(400).json({ error: 'Please confirm your password' });
        if (password !== confirmPassword) return res.status(400).json({ error: 'Passwords do not match' });

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create sponsor account
        const sponsorData = {
            full_name: fullName,
            email,
            phone_number: phoneNumber,
            password: hashedPassword,
            bank_account: bankAccount,
            ifsc_code: ifscCode,
            upi_id: upiId,
            address: address,
            is_blocked: false
        };

        await SupabaseDB.createSponsorAccount(sponsorData);

        res.status(201).json({
            message: 'Sponsor registration successful. You can now login.',
        });

    } catch (error) {
        console.error('Error registering sponsor:', error);
        res.status(500).json({ error: 'Error registering sponsor' });
    }
};

/**
 * Sponsor Login
 */
exports.loginSponsor = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('🔍 Sponsor login attempt for email:', email);

        // Get sponsor from sponsors table
        const sponsor = await SupabaseDB.getSponsorByEmail(email);

        if (!sponsor) {
            console.log('❌ Sponsor not found');
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check if sponsor is blocked
        if (sponsor.is_blocked) {
            console.log('❌ Blocked sponsor login attempt:', email);
            return res.status(403).json({ error: 'Your account has been blocked. Please contact support.' });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, sponsor.password);
        if (!validPassword) {
            console.log('❌ Invalid password');
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: sponsor.id,
                email: sponsor.email,
                isSponsor: true
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Prepare response
        const sponsorResponse = {
            id: sponsor.id,
            fullName: sponsor.full_name,
            email: sponsor.email,
            phoneNumber: sponsor.phone_number,
            bankAccount: sponsor.bank_account,
            ifscCode: sponsor.ifsc_code,
            upiId: sponsor.upi_id,
            address: sponsor.address
        };

        res.json({
            token,
            sponsor: sponsorResponse,
            message: 'Login successful'
        });

    } catch (error) {
        console.error('❌ Error during sponsor login:', error);
        res.status(500).json({ error: 'Error during login' });
    }
};

/**
 * Get Sponsor Profile
 */
exports.getSponsorProfile = async (req, res) => {
    try {
        const sponsorId = req.user.id; // From JWT middleware
        const sponsor = await SupabaseDB.getSponsorById(sponsorId);

        if (!sponsor) {
            return res.status(404).json({ error: 'Sponsor not found' });
        }

        const sponsorResponse = {
            id: sponsor.id,
            fullName: sponsor.full_name,
            email: sponsor.email,
            phoneNumber: sponsor.phone_number,
            bankAccount: sponsor.bank_account,
            ifscCode: sponsor.ifsc_code,
            upiId: sponsor.upi_id,
            address: sponsor.address
        };

        res.json({ success: true, sponsor: sponsorResponse });
    } catch (error) {
        console.error('Error fetching sponsor profile:', error);
        res.status(500).json({ error: 'Error fetching profile' });
    }
};

/**
 * Update Sponsor Bank Details
 */
exports.updateBankDetails = async (req, res) => {
    try {
        const sponsorId = req.user.id;
        const { bankAccount, ifscCode, upiId, address } = req.body;

        const updateData = {
            bank_account: bankAccount,
            ifsc_code: ifscCode,
            upi_id: upiId,
            address: address
        };

        const updated = await SupabaseDB.updateSponsor(sponsorId, updateData);

        res.json({
            success: true,
            message: 'Bank details updated successfully',
            sponsor: {
                bankAccount: updated.bank_account,
                ifscCode: updated.ifsc_code,
                upiId: updated.upi_id,
                address: updated.address
            }
        });
    } catch (error) {
        console.error('Error updating bank details:', error);
        res.status(500).json({ error: 'Error updating bank details' });
    }
};

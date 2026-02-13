import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Camera, Save } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/sponsor/profile');
            const userData = response.data?.sponsor || response.data;
            setUser(userData);
            setFormData({
                fullName: userData.fullName || userData.full_name || '',
                email: userData.email || '',
                phone: userData.phone || userData.phoneNumber || userData.phone_number || '',
                address: userData.address || ''
            });
        } catch (error) {
            console.error("Failed to fetch profile", error);
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                setUser(userData);
                setFormData({
                    fullName: userData.fullName || userData.full_name || '',
                    email: userData.email || '',
                    phone: userData.phone || userData.phoneNumber || userData.phone_number || '',
                    address: userData.address || ''
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleProfilePictureUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB');
            return;
        }

        setUploading(true);
        const formDataUpload = new FormData();
        formDataUpload.append('profilePicture', file);

        try {
            const response = await api.post('/sponsor/profile-picture', formDataUpload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success('Profile picture updated successfully!');
            const updatedUser = response.data.sponsor;
            setUser(updatedUser);

            // Update localStorage
            localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            toast.error(error.response?.data?.error || 'Failed to upload profile picture');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put('/sponsor/profile', formData);
            toast.success('Profile updated successfully!');
            setUser(response.data.sponsor || response.data);
            setIsEditing(false);

            // Update localStorage
            const updatedUser = response.data.sponsor || response.data;
            localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.response?.data?.error || 'Failed to update profile');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-red-500 text-lg">User not found. Please login again.</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            fontFamily: "'Inter', sans-serif"
        }}>
            <div style={{
                maxWidth: '850px',
                width: '100%',
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                padding: '40px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                    {/* Hidden file input */}
                    <input
                        type="file"
                        id="profilePictureInput"
                        accept="image/*"
                        onChange={handleProfilePictureUpload}
                        style={{ display: 'none' }}
                    />

                    <div
                        style={{
                            width: '120px',
                            height: '120px',
                            margin: '0 auto 20px',
                            borderRadius: '50%',
                            background: user?.profile_picture
                                ? `url(${user.profile_picture}) center/cover`
                                : 'linear-gradient(135deg, #0f4c81 0%, #2ecc71 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '48px',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 12px rgba(15, 76, 129, 0.3)',
                            position: 'relative',
                            overflow: 'hidden',
                            cursor: uploading ? 'wait' : 'pointer',
                            transition: 'transform 0.3s',
                            border: uploading ? '3px solid #2ecc71' : 'none'
                        }}
                        onClick={() => !uploading && document.getElementById('profilePictureInput').click()}
                        onMouseEnter={(e) => !uploading && (e.currentTarget.style.transform = 'scale(1.05)')}
                        onMouseLeave={(e) => !uploading && (e.currentTarget.style.transform = 'scale(1)')}
                    >
                        {uploading ? (
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'rgba(0,0,0,0.5)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                gap: '8px'
                            }}>
                                <div style={{
                                    width: '30px',
                                    height: '30px',
                                    border: '3px solid white',
                                    borderTopColor: 'transparent',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }}></div>
                                <span style={{ fontSize: '12px', fontWeight: '500' }}>Uploading...</span>
                            </div>
                        ) : !user?.profile_picture && (
                            formData.fullName?.charAt(0)?.toUpperCase() || 'S'
                        )}

                        <div style={{
                            position: 'absolute',
                            bottom: '0',
                            right: '0',
                            background: uploading ? '#95a5a6' : '#2ecc71',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '3px solid white',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                        }}>
                            <Camera size={16} color="white" />
                        </div>
                    </div>
                    <h2 style={{ fontSize: '28px', color: '#2c3e50', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                        {isEditing ? 'Edit Profile' : 'My Profile'}
                    </h2>
                    <p style={{ color: '#7f8c8d', margin: 0 }}>
                        {isEditing ? 'Update your personal information' : 'Sponsor Account Details'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    {/* Full Name */}
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label htmlFor="fullName" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '8px',
                            fontWeight: '700',
                            color: '#2c3e50',
                            fontSize: '16px'
                        }}>
                            <User size={18} color="#2ecc71" />
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            disabled={!isEditing}
                            placeholder="Enter your full name"
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '500',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                                backgroundColor: isEditing ? '#fff' : '#f8f9fa',
                                cursor: isEditing ? 'text' : 'not-allowed'
                            }}
                            onFocus={(e) => isEditing && (e.target.style.borderColor = '#2ecc71')}
                            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                        />
                    </div>

                    {/* Email */}
                    <div className="form-group" style={{ gridColumn: 'span 1' }}>
                        <label htmlFor="email" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '8px',
                            fontWeight: '700',
                            color: '#2c3e50',
                            fontSize: '16px'
                        }}>
                            <Mail size={18} color="#2ecc71" />
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            disabled={true}
                            placeholder="name@example.com"
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '500',
                                outline: 'none',
                                backgroundColor: '#f8f9fa',
                                cursor: 'not-allowed',
                                color: '#7f8c8d'
                            }}
                        />
                        <small style={{ color: '#95a5a6', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                            Email cannot be changed
                        </small>
                    </div>

                    {/* Phone */}
                    <div className="form-group" style={{ gridColumn: 'span 1' }}>
                        <label htmlFor="phone" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '8px',
                            fontWeight: '700',
                            color: '#2c3e50',
                            fontSize: '16px'
                        }}>
                            <Phone size={18} color="#2ecc71" />
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={!isEditing}
                            placeholder="Mobile Number"
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '500',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                                backgroundColor: isEditing ? '#fff' : '#f8f9fa',
                                cursor: isEditing ? 'text' : 'not-allowed'
                            }}
                            onFocus={(e) => isEditing && (e.target.style.borderColor = '#2ecc71')}
                            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                        />
                    </div>

                    {/* Address */}
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label htmlFor="address" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '8px',
                            fontWeight: '700',
                            color: '#2c3e50',
                            fontSize: '16px'
                        }}>
                            <MapPin size={18} color="#2ecc71" />
                            Residential Address
                        </label>
                        <textarea
                            id="address"
                            value={formData.address}
                            onChange={handleChange}
                            disabled={!isEditing}
                            placeholder="Full Address"
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '500',
                                outline: 'none',
                                minHeight: '100px',
                                resize: 'vertical',
                                transition: 'border-color 0.2s',
                                backgroundColor: isEditing ? '#fff' : '#f8f9fa',
                                cursor: isEditing ? 'text' : 'not-allowed'
                            }}
                            onFocus={(e) => isEditing && (e.target.style.borderColor = '#2ecc71')}
                            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                        />
                    </div>

                    {/* Sponsor ID - Read Only */}
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '8px',
                            fontWeight: '700',
                            color: '#2c3e50',
                            fontSize: '16px'
                        }}>
                            <div style={{
                                width: '18px',
                                height: '18px',
                                background: '#2ecc71',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '10px',
                                fontWeight: 'bold'
                            }}>ID</div>
                            Sponsor ID
                        </label>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <input
                                type="text"
                                value={user.id || 'Loading...'}
                                disabled={true}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    fontFamily: 'monospace',
                                    outline: 'none',
                                    backgroundColor: '#f0f7ff',
                                    cursor: 'not-allowed',
                                    color: '#0f4c81'
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    navigator.clipboard.writeText(user.id);
                                    toast.success('Sponsor ID copied!');
                                }}
                                style={{
                                    padding: '12px 20px',
                                    background: '#0f4c81',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '14px',
                                    whiteSpace: 'nowrap',
                                    transition: 'background 0.3s'
                                }}
                                onMouseEnter={(e) => e.target.style.background = '#0a3a61'}
                                onMouseLeave={(e) => e.target.style.background = '#0f4c81'}
                            >
                                Copy ID
                            </button>
                        </div>
                        <small style={{ color: '#95a5a6', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                            Use this ID for support and transactions
                        </small>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', marginTop: '10px' }}>
                        {isEditing ? (
                            <>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setFormData({
                                            fullName: user.fullName || user.full_name || '',
                                            email: user.email || '',
                                            phone: user.phone || user.phoneNumber || user.phone_number || '',
                                            address: user.address || ''
                                        });
                                    }}
                                    style={{
                                        flex: 1,
                                        padding: '14px',
                                        background: '#fff',
                                        color: '#7f8c8d',
                                        border: '2px solid #e0e0e0',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.borderColor = '#bdc3c7';
                                        e.target.style.background = '#f8f9fa';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.borderColor = '#e0e0e0';
                                        e.target.style.background = '#fff';
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        flex: 1,
                                        padding: '14px',
                                        background: '#2ecc71',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 12px rgba(46, 204, 113, 0.25)',
                                        transition: 'all 0.3s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}
                                    onMouseEnter={(e) => e.target.style.background = '#27ae60'}
                                    onMouseLeave={(e) => e.target.style.background = '#2ecc71'}
                                >
                                    <Save size={18} />
                                    Save Changes
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                style={{
                                    width: '100%',
                                    padding: '14px',
                                    background: '#0f4c81',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 12px rgba(15, 76, 129, 0.25)',
                                    transition: 'all 0.3s'
                                }}
                                onMouseEnter={(e) => e.target.style.background = '#0a3a61'}
                                onMouseLeave={(e) => e.target.style.background = '#0f4c81'}
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                @media (max-width: 768px) {
                    form {
                        grid-template-columns: 1fr !important;
                        gap: 16px !important;
                    }
                    .form-group {
                        grid-column: span 1 !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Profile;

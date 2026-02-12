import { useState, useEffect } from 'react';
import { Camera, Mail, Phone, MapPin, CreditCard, Building, Edit } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Try fetching fresh profile from API
                const response = await api.get('/sponsor/profile'); // Assuming a profile endpoint exists
                if (response.data && response.data.sponsor) {
                    setUser(response.data.sponsor);
                } else {
                    setUser(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch fresh profile", error);
                // Fallback to localStorage
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return <div className="p-10 text-center">Loading profile...</div>;
    if (!user) return <div className="p-10 text-center text-red-500">User not found. Please login again.</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen pb-20">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header / Cover */}
                <div className="relative h-48 bg-gradient-to-r from-brand-600 to-cyan-500 rounded-2xl overflow-hidden shadow-lg">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute -bottom-12 left-8">
                        <div className="relative w-32 h-32 rounded-full border-4 border-white bg-white shadow-md overflow-hidden group cursor-pointer">
                            <img src={user.profilePicture || "https://ui-avatars.com/api/?name=" + user.fullName} alt="Profile" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="w-8 h-8 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-14 px-8 flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{user.fullName || "Sponsor Name"}</h1>
                        <p className="text-gray-500">{user.email}</p>
                        <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-100 text-brand-700 uppercase tracking-wide">
                            {user.role} Account
                        </span>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                        <Edit className="w-4 h-4" />
                        Edit Profile
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">Personal Information</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-gray-600">
                                <div className="w-5 h-5 flex items-center justify-center bg-indigo-100 rounded-full text-indigo-600 font-bold text-xs">ID</div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-400">Sponsor ID</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium font-mono bg-gray-50 px-2 py-1 rounded select-all">{user.id || "Loading..."}</p>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(user.id);
                                                toast.success('ID Copied!');
                                            }}
                                            className="text-gray-400 hover:text-indigo-600 transition-colors"
                                            title="Copy ID"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <Mail className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-400">Email Address</p>
                                    <p className="text-sm font-medium">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <Phone className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-400">Phone Number</p>
                                    <p className="text-sm font-medium">{user.phone || "Not provided"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <MapPin className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-400">Address</p>
                                    <p className="text-sm font-medium">{user.address || "No address details"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bank Details */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">Bank Details</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-gray-600">
                                <Building className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-400">Bank Account</p>
                                    <p className="text-sm font-medium font-mono">{user.bankAccount ? `•••• •••• ${user.bankAccount.slice(-4)}` : "Not Linked"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <CreditCard className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-400">IFSC Code</p>
                                    <p className="text-sm font-medium font-mono">{user.ifscCode || "N/A"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <div className="w-5 h-5 text-gray-400 font-bold flex items-center justify-center text-[10px] border border-gray-400 rounded">UPI</div>
                                <div>
                                    <p className="text-xs text-gray-400">UPI ID</p>
                                    <p className="text-sm font-medium">{user.upiId || "Not Linked"}</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-100">
                            <button className="text-sm text-brand-600 font-medium hover:text-brand-700 transition-colors">Update Bank Details</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { User, Mail, Phone, Lock, Hash, MapPin, Building, CreditCard, ArrowLeft } from 'lucide-react';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        bankAccount: '',
        ifscCode: '',
        upiId: '',
        address: '',
        role: 'sponsor',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords don't match!");
            return;
        }
        setLoading(true);
        try {
            await api.post('/register/sponsor', {
                ...formData
            });
            toast.success('Registration successful! Please login.');
            navigate('/login');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            </div>

            <div className="bg-white/80 backdrop-blur-md w-full max-w-4xl p-8 rounded-2xl shadow-xl z-10 border border-gray-100">

                <div className="mb-8">
                    <Link to="/login" className="text-gray-500 hover:text-brand-600 flex items-center gap-2 text-sm font-medium mb-4">
                        <ArrowLeft className="w-4 h-4" /> Back to Login
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-800">Become a Partner</h1>
                    <p className="text-gray-500 mt-2">Join our network and start earning by renting your bikes.</p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Personal Info */}
                    <div className="space-y-4 md:col-span-1">
                        <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Personal Details</h2>

                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <input type="text" name="fullName" placeholder="Full Name" required onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
                        </div>

                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <input type="email" name="email" placeholder="Email Address" required onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
                        </div>

                        <div className="relative">
                            <Phone className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <input type="tel" name="phoneNumber" placeholder="Phone Number" required onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
                        </div>

                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <textarea name="address" placeholder="Residential Address" required onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all min-h-[100px] align-top text-sm"></textarea>
                        </div>
                    </div>

                    {/* Banking & Security */}
                    <div className="space-y-4 md:col-span-1">
                        <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Banking & Security</h2>

                        <div className="relative">
                            <Building className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <input type="text" name="bankAccount" placeholder="Bank Account Number" required onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
                        </div>

                        <div className="relative">
                            <Hash className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <input type="text" name="ifscCode" placeholder="IFSC Code" required onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
                        </div>

                        <div className="relative">
                            <CreditCard className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <input type="text" name="upiId" placeholder="UPI ID (Optional)" onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                <input type="password" name="password" placeholder="Password" required onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                <input type="password" name="confirmPassword" placeholder="Confirm" required onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 mt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-brand-600 to-cyan-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all transform active:scale-95 text-lg disabled:opacity-70"
                        >
                            {loading ? 'Creating Account...' : 'Register as Sponsor'}
                        </button>
                        <p className="text-xs text-center text-gray-400 mt-4">By registering, you agree to our Terms of Service and Privacy Policy.</p>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default Register;

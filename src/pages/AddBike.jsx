import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Upload, Bike, FileText, CheckCircle, X } from 'lucide-react';

const AddBike = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        bikeNumber: '',
        model: '',
        year: '',
        pricePerHour: '',
    });
    const [files, setFiles] = useState({
        image: null,
        rc: null,
        insurance: null,
        puc: null,
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFiles({ ...files, [e.target.name]: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        Object.keys(files).forEach(key => {
            if (files[key]) data.append(key, files[key]);
        });

        try {
            await api.post('/sponsor/add-bike', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Bike added successfully! Waiting for approval.');
            navigate('/my-bikes');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to add bike.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen pb-20">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Add New Bike</h1>
                        <p className="text-gray-500 mt-1">Submit your vehicle details for verification.</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => navigate('/my-bikes')}
                        className="text-gray-500 hover:text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-white transition-colors"
                    >
                        Cancel
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-8">

                    {/* Bike Details Section */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-700 border-b pb-4 mb-6 flex items-center gap-2">
                            <Bike className="w-5 h-5 text-brand-600" />
                            Vehicle Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Bike Name (Make)</label>
                                <input type="text" name="name" placeholder="e.g. Royal Enfield Classic 350" required onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Registration Number</label>
                                <input type="text" name="bikeNumber" placeholder="e.g. KA-01-AB-1234" required onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none uppercase" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Model</label>
                                <input type="text" name="model" placeholder="e.g. 2023 ABS" required onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Year</label>
                                <input type="number" name="year" placeholder="e.g. 2023" required onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none" />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-gray-700">Price Per Hour (₹)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
                                    <input type="number" name="pricePerHour" placeholder="0.00" required onChange={handleInputChange} className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Documents Upload Section */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-700 border-b pb-4 mb-6 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-brand-600" />
                            Documents & Photos
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Bike Image */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Bike Photo</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                                    <input type="file" name="image" accept="image/*" required onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-500 font-medium">{files.image ? files.image.name : 'Click to upload bike photo'}</p>
                                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                                </div>
                            </div>

                            {/* RC Document */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">RC Document</label>
                                <div className={`border border-gray-200 rounded-lg p-3 flex items-center justify-between ${files.rc ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                                    <span className="text-sm text-gray-500 truncate max-w-[150px]">{files.rc ? files.rc.name : 'No file chosen'}</span>
                                    <label className="cursor-pointer bg-white border border-gray-300 rounded px-3 py-1 text-xs font-medium hover:bg-gray-50 transition-colors">
                                        Browse
                                        <input type="file" name="rc" accept=".pdf,image/*" required onChange={handleFileChange} className="hidden" />
                                    </label>
                                </div>
                            </div>

                            {/* Insurance */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Policy</label>
                                <div className={`border border-gray-200 rounded-lg p-3 flex items-center justify-between ${files.insurance ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                                    <span className="text-sm text-gray-500 truncate max-w-[150px]">{files.insurance ? files.insurance.name : 'No file chosen'}</span>
                                    <label className="cursor-pointer bg-white border border-gray-300 rounded px-3 py-1 text-xs font-medium hover:bg-gray-50 transition-colors">
                                        Browse
                                        <input type="file" name="insurance" accept=".pdf,image/*" required onChange={handleFileChange} className="hidden" />
                                    </label>
                                </div>
                            </div>

                            {/* PUC */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">PUC Certificate</label>
                                <div className={`border border-gray-200 rounded-lg p-3 flex items-center justify-between ${files.puc ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                                    <span className="text-sm text-gray-500 truncate max-w-[150px]">{files.puc ? files.puc.name : 'No file chosen'}</span>
                                    <label className="cursor-pointer bg-white border border-gray-300 rounded px-3 py-1 text-xs font-medium hover:bg-gray-50 transition-colors">
                                        Browse
                                        <input type="file" name="puc" accept=".pdf,image/*" required onChange={handleFileChange} className="hidden" />
                                    </label>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/my-bikes')}
                            className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-brand-600 to-cyan-500 text-white font-medium hover:shadow-lg transition-all transform active:scale-95 disabled:opacity-70 flex items-center gap-2"
                        >
                            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <CheckCircle className="w-5 h-5" />}
                            {loading ? 'Submitting...' : 'Submit Bike'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddBike;

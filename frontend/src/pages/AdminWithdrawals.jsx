import { useState, useEffect } from 'react';
import { DollarSign, Building, Smartphone, Clock, CheckCircle, XCircle, Send, Filter, Search, User } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AdminWithdrawals = () => {
    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [actionType, setActionType] = useState('');
    const [transactionRef, setTransactionRef] = useState('');
    const [adminNotes, setAdminNotes] = useState('');

    useEffect(() => {
        fetchWithdrawalRequests();
    }, []);

    useEffect(() => {
        filterRequests();
    }, [requests, statusFilter, searchTerm]);

    const fetchWithdrawalRequests = async () => {
        try {
            setLoading(true);
            console.log('🔍 Fetching withdrawal requests from API...');
            const response = await api.get('/admin/withdrawal/requests');
            console.log('✅ API Response:', response.data);
            console.log('📊 Number of requests:', response.data.requests?.length || 0);
            setRequests(response.data.requests || []);
        } catch (error) {
            console.error('❌ Error fetching withdrawal requests:', error);
            console.error('Error details:', error.response?.data);
            toast.error('Failed to load withdrawal requests');
        } finally {
            setLoading(false);
        }
    };

    const filterRequests = () => {
        let filtered = [...requests];

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(req => req.status === statusFilter);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(req =>
                req.sponsors?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                req.sponsors?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                req.id.toString().includes(searchTerm)
            );
        }

        setFilteredRequests(filtered);
    };

    const handleAction = (request, action) => {
        setSelectedRequest(request);
        setActionType(action);
        setShowConfirmModal(true);
        setTransactionRef('');
        setAdminNotes('');
    };

    const confirmAction = async () => {
        if (!selectedRequest) return;

        try {
            const updateData = {
                status: actionType,
                adminNotes: adminNotes || undefined,
                transactionReference: transactionRef || undefined
            };

            await api.patch(`/admin/withdrawal/requests/${selectedRequest.id}`, updateData);

            toast.success(`Request ${actionType} successfully!`);
            setShowConfirmModal(false);
            setSelectedRequest(null);
            fetchWithdrawalRequests();
        } catch (error) {
            console.error('Error updating withdrawal request:', error);
            toast.error(error.response?.data?.error || 'Failed to update request');
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { icon: Clock, color: 'bg-yellow-100 text-yellow-700 border-yellow-300', text: 'Pending' },
            approved: { icon: CheckCircle, color: 'bg-blue-100 text-blue-700 border-blue-300', text: 'Approved' },
            completed: { icon: CheckCircle, color: 'bg-green-100 text-green-700 border-green-300', text: 'Completed' },
            rejected: { icon: XCircle, color: 'bg-red-100 text-red-700 border-red-300', text: 'Rejected' }
        };

        const config = statusConfig[status] || statusConfig.pending;
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
                <Icon className="w-3 h-3" />
                {config.text}
            </span>
        );
    };

    const stats = {
        total: requests.length,
        pending: requests.filter(r => r.status === 'pending').length,
        approved: requests.filter(r => r.status === 'approved').length,
        completed: requests.filter(r => r.status === 'completed').length,
        rejected: requests.filter(r => r.status === 'rejected').length,
        totalAmount: requests.reduce((sum, r) => sum + parseFloat(r.amount || 0), 0)
    };

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Withdrawal Management</h1>
                    <p className="text-gray-600">Review and process sponsor withdrawal requests</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Pending</p>
                                <h3 className="text-3xl font-bold text-gray-800">{stats.pending}</h3>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-full">
                                <Clock className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Approved</p>
                                <h3 className="text-3xl font-bold text-gray-800">{stats.approved}</h3>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-full">
                                <CheckCircle className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Completed</p>
                                <h3 className="text-3xl font-bold text-gray-800">{stats.completed}</h3>
                            </div>
                            <div className="bg-green-100 p-3 rounded-full">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm mb-1">Total Amount</p>
                                <h3 className="text-2xl font-bold">₹{stats.totalAmount.toLocaleString('en-IN')}</h3>
                            </div>
                            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                                <DollarSign className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by sponsor name, email, or request ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="relative">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="pl-12 pr-8 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all appearance-none bg-white cursor-pointer min-w-[200px]"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="completed">Completed</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Requests List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                            <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading withdrawal requests...</p>
                        </div>
                    ) : filteredRequests.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                            <XCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Requests Found</h3>
                            <p className="text-gray-600">No withdrawal requests match your filters.</p>
                        </div>
                    ) : (
                        filteredRequests.map((request) => (
                            <div key={request.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                    {/* Left Section - Request Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="bg-purple-100 p-2 rounded-full">
                                                        <User className="w-5 h-5 text-purple-600" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-bold text-gray-800">
                                                            {request.sponsors?.full_name || 'Unknown Sponsor'}
                                                        </h3>
                                                        <p className="text-sm text-gray-500">{request.sponsors?.email}</p>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-400 ml-12">
                                                    Request ID: #{request.id} • {new Date(request.created_at).toLocaleDateString('en-IN', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                            {getStatusBadge(request.status)}
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Amount</p>
                                                <p className="text-xl font-bold text-purple-600">
                                                    ₹{parseFloat(request.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Payment Method</p>
                                                <div className="flex items-center gap-2">
                                                    {request.payment_method === 'bank' ? (
                                                        <>
                                                            <Building className="w-4 h-4 text-gray-600" />
                                                            <span className="font-semibold text-gray-800">Bank</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Smartphone className="w-4 h-4 text-gray-600" />
                                                            <span className="font-semibold text-gray-800">UPI</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Contact</p>
                                                <p className="text-sm font-medium text-gray-800">
                                                    {request.sponsors?.phone_number || 'N/A'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Payment Details */}
                                        <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                                            <p className="text-xs text-blue-700 font-semibold mb-2">Payment Details</p>
                                            {request.payment_method === 'bank' ? (
                                                <div className="space-y-1 text-sm">
                                                    <p><strong>Account Holder:</strong> {request.account_holder_name}</p>
                                                    <p><strong>Account Number:</strong> {request.bank_account_number}</p>
                                                    <p><strong>IFSC Code:</strong> {request.ifsc_code}</p>
                                                </div>
                                            ) : (
                                                <div className="text-sm">
                                                    <p><strong>UPI ID:</strong> {request.upi_id}</p>
                                                </div>
                                            )}
                                        </div>

                                        {request.transaction_reference && (
                                            <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
                                                <p className="text-xs text-green-700 font-semibold mb-1">Transaction Reference</p>
                                                <p className="text-sm font-mono text-green-800">{request.transaction_reference}</p>
                                            </div>
                                        )}

                                        {request.admin_notes && (
                                            <div className="mt-4 p-4 bg-gray-100 rounded-xl">
                                                <p className="text-xs text-gray-600 font-semibold mb-1">Admin Notes</p>
                                                <p className="text-sm text-gray-700">{request.admin_notes}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Section - Actions */}
                                    {request.status === 'pending' && (
                                        <div className="flex flex-col gap-3 lg:w-48">
                                            <button
                                                onClick={() => handleAction(request, 'approved')}
                                                className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleAction(request, 'rejected')}
                                                className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all"
                                            >
                                                <XCircle className="w-4 h-4" />
                                                Reject
                                            </button>
                                        </div>
                                    )}

                                    {request.status === 'approved' && (
                                        <div className="lg:w-48">
                                            <button
                                                onClick={() => handleAction(request, 'completed')}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                                            >
                                                <Send className="w-4 h-4" />
                                                Mark Completed
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && selectedRequest && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Confirm {actionType.charAt(0).toUpperCase() + actionType.slice(1)}
                        </h2>

                        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                            <p className="text-sm text-gray-600 mb-2">Request Details:</p>
                            <p className="font-semibold text-gray-800">
                                {selectedRequest.sponsors?.full_name}
                            </p>
                            <p className="text-2xl font-bold text-purple-600 mt-2">
                                ₹{parseFloat(selectedRequest.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </p>
                        </div>

                        {actionType === 'completed' && (
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Transaction Reference
                                </label>
                                <input
                                    type="text"
                                    value={transactionRef}
                                    onChange={(e) => setTransactionRef(e.target.value)}
                                    placeholder="Enter transaction reference number"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                                />
                            </div>
                        )}

                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Admin Notes (Optional)
                            </label>
                            <textarea
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                placeholder="Add any notes about this action..."
                                rows="3"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmAction}
                                className={`flex-1 px-4 py-3 text-white rounded-xl font-semibold transition-all ${actionType === 'rejected'
                                    ? 'bg-red-600 hover:bg-red-700'
                                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg'
                                    }`}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminWithdrawals;

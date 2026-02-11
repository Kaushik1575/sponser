import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Search, Filter, Download } from 'lucide-react';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const mockBookings = [
        {
            _id: 'BK123456',
            customerName: 'Alice Johnson',
            bikeName: 'Royal Enfield Classic 350',
            startTime: '2023-10-25T10:00:00',
            endTime: '2023-10-25T14:00:00',
            totalHours: 4,
            totalAmount: 1200,
            status: 'completed',
            paymentStatus: 'paid'
        },
        {
            _id: 'BK987654',
            customerName: 'Bob Smith',
            bikeName: 'Yamaha R15 V4',
            startTime: '2023-10-26T09:00:00',
            endTime: '2023-10-27T09:00:00',
            totalHours: 24,
            totalAmount: 3500,
            status: 'active',
            paymentStatus: 'paid'
        },
        {
            _id: 'BK456789',
            customerName: 'Charlie Brown',
            bikeName: 'KTM Duke 200',
            startTime: '2023-10-28T15:00:00',
            endTime: '2023-10-28T18:00:00',
            totalHours: 3,
            totalAmount: 900,
            status: 'cancelled',
            paymentStatus: 'refunded'
        }
    ];

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await api.get('/sponsor/bookings');
                setBookings(response.data);
            } catch (error) {
                console.error(error);
                // toast.error('Failed to fetch bookings. Using Mock.');
                setBookings(mockBookings);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'completed': return 'bg-green-100 text-green-700';
            case 'active': return 'bg-blue-100 text-blue-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Booking History</h1>
                    <p className="text-gray-500 mt-1">Track all rentals and their status.</p>
                </div>

                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input type="text" placeholder="Search booking ID..." className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none w-64" />
                    </div>
                    <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
                        <Filter className="w-5 h-5" />
                    </button>
                    <button className="p-2 border border-brand-200 bg-brand-50 rounded-lg hover:bg-brand-100 text-brand-600">
                        <Download className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                                <th className="px-6 py-4">Booking ID</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Bike</th>
                                <th className="px-6 py-4">Duration</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Payment</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-10 text-gray-500">Loading bookings...</td>
                                </tr>
                            ) : bookings.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-10 text-gray-500">No bookings found.</td>
                                </tr>
                            ) : (
                                bookings.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-sm text-gray-600">#{booking._id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-xs uppercase">
                                                    {booking.customerName.charAt(0)}
                                                </div>
                                                <span className="font-medium text-gray-800 text-sm">{booking.customerName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{booking.bikeName}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs text-gray-500">
                                                <p>{new Date(booking.startTime).toLocaleDateString()} {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                <p className="font-bold text-gray-400">↓</p>
                                                <p>{new Date(booking.endTime).toLocaleDateString()} {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                <p className="mt-1 font-semibold text-gray-700">({booking.totalHours} hrs)</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-800">₹{booking.totalAmount}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getStatusColor(booking.status)}`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${booking.paymentStatus === 'paid' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                                                {booking.paymentStatus}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination Placeholders */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-sm text-gray-500">Showing 1 to {bookings.length} of {bookings.length} entries</p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Bookings;

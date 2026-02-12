import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { DollarSign, Download, TrendingUp, TrendingDown, Clock, CreditCard } from 'lucide-react';

const Revenue = () => {
    const [revenueData, setRevenueData] = useState({
        grossRevenue: 0,
        commission: 0,
        netEarnings: 0,
        transactions: [],
        vehicleStats: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRevenue = async () => {
            try {
                const response = await api.get('/sponsor/revenue');
                setRevenueData(response.data);
            } catch (error) {
                console.error(error);
                // Fallback Mock
                setRevenueData({
                    grossRevenue: 15400,
                    commission: 1540,
                    netEarnings: 13860,
                    transactions: [
                        { id: 'TXN001', date: '2023-10-25', amount: 1200, type: 'Credit', description: 'Booking payment for #BK123456' },
                        { id: 'TXN002', date: '2023-10-26', amount: 3500, type: 'Credit', description: 'Booking payment for #BK987654' },
                        { id: 'TXN003', date: '2023-10-28', amount: -150, type: 'Debit', description: 'Listing Fee Adjustment' }, // Example debit
                        { id: 'TXN004', date: '2023-10-29', amount: 900, type: 'Credit', description: 'Booking payment for #BK456789' },
                    ]
                });
                // toast.error("Using mock revenue data");
            } finally {
                setLoading(false);
            }
        };
        fetchRevenue();
    }, []);

    const downloadCSV = () => {
        const headers = ["Transaction ID", "Date", "Description", "Type", "Amount"];
        const rows = revenueData.transactions.map(t => [t.id, t.date, t.description, t.type, t.amount]);

        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += headers.join(",") + "\n";
        rows.forEach(row => {
            csvContent += row.join(",") + "\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "revenue_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <div className="p-10 text-center">Loading revenue data...</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen pb-20">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Financial Overview</h1>
                    <p className="text-gray-500 mt-1">Detailed breakdown of your earnings and payouts.</p>
                </div>
                <button
                    onClick={downloadCSV}
                    className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors"
                >
                    <Download className="w-5 h-5" />
                    Export CSV
                </button>
            </div>

            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl p-6 text-white shadow-lg shadow-blue-200">
                    <div className="flex items-center justify-between mb-4 opacity-80">
                        <span className="text-sm font-medium">Gross Revenue</span>
                        <DollarSign className="w-5 h-5" />
                    </div>
                    <h3 className="text-3xl font-bold mb-1">₹{revenueData.grossRevenue.toLocaleString()}</h3>
                    <p className="text-xs opacity-70">Total value generated from bookings</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4 text-gray-500">
                        <span className="text-sm font-medium">Platform Commission (30%)</span>
                        <TrendingDown className="w-5 h-5 text-red-500" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-1">- ₹{revenueData.commission.toLocaleString()}</h3>
                    <p className="text-xs text-gray-400">Deducted service fees</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg shadow-green-200">
                    <div className="flex items-center justify-between mb-4 opacity-80">
                        <span className="text-sm font-medium">Net Earnings</span>
                        <CreditCard className="w-5 h-5" />
                    </div>
                    <h3 className="text-3xl font-bold mb-1">₹{revenueData.netEarnings.toLocaleString()}</h3>
                    <p className="text-xs opacity-70">Available for payout</p>
                </div>
            </div>

            {/* Vehicle Performance Breakdown */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-700">Vehicle Performance Breakdown</h3>
                    <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full font-bold">Live Data</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4">Vehicle</th>
                                <th className="px-6 py-4 text-right">This Week</th>
                                <th className="px-6 py-4 text-right">This Month</th>
                                <th className="px-6 py-4 text-right">Total Hours</th>
                                <th className="px-6 py-4 text-right">Total Revenue</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {(revenueData.vehicleStats || []).length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-400 font-medium">No vehicle data available</td>
                                </tr>
                            ) : (
                                (revenueData.vehicleStats || []).map((v, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                                                    {v.image ? (
                                                        <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                            <TrendingUp size={16} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800 text-sm">{v.name}</p>
                                                    <p className="text-xs text-gray-500 font-mono">{v.regNo || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm text-gray-700">₹{(v.week || 0).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right text-sm text-gray-700">₹{(v.month || 0).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right text-sm text-gray-700">
                                            <div className="flex items-center justify-end gap-1">
                                                <Clock size={12} className="text-gray-400" />
                                                {v.hours} hrs
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-green-600">₹{(v.total || 0).toLocaleString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-700">Recent Transactions</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4">Ref ID</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {revenueData.transactions.map((txn, index) => (
                                <tr key={txn.id || index} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-xs font-mono text-gray-500">#{txn.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{txn.date}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{txn.description}</td>
                                    <td className={`px-6 py-4 text-sm font-mono font-medium text-right ${txn.type === 'Debit' ? 'text-red-500' : 'text-green-600'}`}>
                                        {txn.type === 'Debit' ? '-' : '+'} ₹{Math.abs(txn.amount).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {revenueData.transactions.length === 0 && (
                    <div className="p-8 text-center text-gray-500 text-sm">No transactions yet.</div>
                )}
            </div>
        </div>
    );
};

export default Revenue;

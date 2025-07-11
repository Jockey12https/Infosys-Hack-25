import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle, RefreshCw, Filter, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Transaction } from '../lib/supabase';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user, filter, dateRange]);

  const fetchTransactions = async () => {
    try {
      let query = supabase
        .from('transactions')
        .select(`
          *,
          bookings (
            booking_date,
            booking_time,
            guides (
              profiles (
                full_name
              )
            )
          ),
          payer:profiles!payer_id (
            full_name,
            email
          ),
          payee:profiles!payee_id (
            full_name,
            email
          ),
          payment_methods (
            type,
            provider,
            last_four,
            upi_id
          )
        `)
        .or(`payer_id.eq.${user?.id},payee_id.eq.${user?.id}`)
        .order('created_at', { ascending: false });

      // Apply status filter
      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      // Apply date range filter
      if (dateRange !== 'all') {
        const now = new Date();
        let startDate = new Date();
        
        switch (dateRange) {
          case '7days':
            startDate.setDate(now.getDate() - 7);
            break;
          case '30days':
            startDate.setDate(now.getDate() - 30);
            break;
          case '90days':
            startDate.setDate(now.getDate() - 90);
            break;
        }
        
        query = query.gte('created_at', startDate.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (transaction: Transaction) => {
    const isIncoming = transaction.payee_id === user?.id;
    
    switch (transaction.status) {
      case 'completed':
        return isIncoming ? (
          <ArrowDownLeft className="h-5 w-5 text-green-600" />
        ) : (
          <ArrowUpRight className="h-5 w-5 text-red-600" />
        );
      case 'pending':
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'failed':
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'refunded':
        return <RefreshCw className="h-5 w-5 text-blue-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTransactionColor = (transaction: Transaction) => {
    const isIncoming = transaction.payee_id === user?.id;
    
    switch (transaction.status) {
      case 'completed':
        return isIncoming ? 'text-green-600' : 'text-red-600';
      case 'pending':
      case 'processing':
        return 'text-yellow-600';
      case 'failed':
      case 'cancelled':
        return 'text-red-600';
      case 'refunded':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTransactionAmount = (transaction: Transaction) => {
    const isIncoming = transaction.payee_id === user?.id;
    const amount = transaction.amount / 100; // Convert from paise to rupees
    
    return isIncoming ? `+₹${amount}` : `-₹${amount}`;
  };

  const getTransactionDescription = (transaction: Transaction) => {
    const isIncoming = transaction.payee_id === user?.id;
    
    if (transaction.type === 'booking_payment') {
      if (isIncoming) {
        return `Payment received from ${transaction.payer?.full_name}`;
      } else {
        return `Payment to ${transaction.payee?.full_name}`;
      }
    }
    
    return transaction.description || 'Transaction';
  };

  const getPaymentMethodDisplay = (transaction: Transaction) => {
    if (!transaction.payment_methods) return 'N/A';
    
    const method = transaction.payment_methods;
    switch (method.type) {
      case 'card':
        return `${method.provider?.toUpperCase()} •••• ${method.last_four}`;
      case 'upi':
        return method.upi_id;
      default:
        return method.type.toUpperCase();
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please sign in to view transaction history.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
          
          <div className="flex space-x-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
            
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading transactions...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gray-100 rounded-full">
                      {getTransactionIcon(transaction)}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {getTransactionDescription(transaction)}
                      </h3>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                        <span>
                          {new Date(transaction.created_at).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span>•</span>
                        <span>{getPaymentMethodDisplay(transaction)}</span>
                        {transaction.gateway && (
                          <>
                            <span>•</span>
                            <span>{transaction.gateway.toUpperCase()}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-xl font-bold ${getTransactionColor(transaction)}`}>
                      {getTransactionAmount(transaction)}
                    </div>
                    <div className="flex items-center justify-end mt-1">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                        transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        transaction.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        transaction.status === 'failed' ? 'bg-red-100 text-red-800' :
                        transaction.status === 'refunded' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                {(transaction.fees > 0 || transaction.bookings) && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      {transaction.fees > 0 && (
                        <div>
                          <span className="text-gray-500">Platform Fee:</span>
                          <span className="ml-2 font-medium">₹{transaction.fees / 100}</span>
                        </div>
                      )}
                      {transaction.net_amount && (
                        <div>
                          <span className="text-gray-500">Net Amount:</span>
                          <span className="ml-2 font-medium">₹{transaction.net_amount / 100}</span>
                        </div>
                      )}
                      {transaction.bookings && (
                        <div>
                          <span className="text-gray-500">Booking Date:</span>
                          <span className="ml-2 font-medium">
                            {new Date(transaction.bookings.booking_date).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                      )}
                      {transaction.gateway_transaction_id && (
                        <div>
                          <span className="text-gray-500">Transaction ID:</span>
                          <span className="ml-2 font-mono text-xs">
                            {transaction.gateway_transaction_id.slice(-8)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {transactions.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Transactions Found</h3>
                <p className="text-gray-600">
                  {filter !== 'all' || dateRange !== 'all' 
                    ? 'Try adjusting your filters to see more transactions.'
                    : 'Your transaction history will appear here once you make bookings.'
                  }
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
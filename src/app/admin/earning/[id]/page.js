// app/admin/earning/[id]/page.js
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { X } from 'lucide-react';

import toast from 'react-hot-toast';
import apiCall from '@/components/lib/apiClient';
import { API_ENDPOINTS } from '@/components/lib/api';

const TransactionDetailsPage = ({ params }) => {
    const router = useRouter();
    const { id } = params;
    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            fetchTransactionDetails();
        }
    }, [id]);

    const fetchTransactionDetails = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch all payments and find the matching one
            const response = await apiCall(
                API_ENDPOINTS.DASHBOARD.ALL_PAYMENTS,
                "GET"
            );

            if (response && response.payments && Array.isArray(response.payments)) {
                // Extract transaction ID number from URL parameter (e.g., TXN1 -> 1)
                const transactionIdNum = id.replace('TXN', '');
                
                // Find matching payment
                const foundPayment = response.payments.find(
                    p => p.id.toString() === transactionIdNum
                );

                if (foundPayment) {
                    // Transform API data to transaction format
                    const transformedTransaction = {
                        serial: `INV${foundPayment.id}`,
                        userName: foundPayment.event_name || "N/A",
                        userType: foundPayment.platform || "N/A",
                        subscriptionType: foundPayment.status || "N/A",
                        amount: parseFloat(foundPayment.amount_paid) || 0,
                        accNumber: foundPayment.store_transaction_id || "N/A",
                        date: new Date(foundPayment.payment_date).toLocaleString() || "N/A",
                        fullName: foundPayment.admin_name || "Administrator",
                        email: foundPayment.admin_email || "N/A",
                        phone: "N/A",
                        transactionID: `TXN${foundPayment.id}`,
                        accHolderName: foundPayment.event_admin || "N/A",
                        receivedAmount: parseFloat(foundPayment.amount_paid) || 0,
                        detectPercentage: 0,
                        finalAmount: parseFloat(foundPayment.amount_paid) || 0,
                        userImagePath: "/image/user-photo.png",
                        status: foundPayment.status,
                        currency: foundPayment.currency || "USD",
                        platform: foundPayment.platform,
                        revenuecat_transaction_id: foundPayment.revenuecat_transaction_id,
                        verified_at: foundPayment.verified_at,
                        refunded_at: foundPayment.refunded_at,
                    };
                    setTransaction(transformedTransaction);
                } else {
                    setError("Transaction not found");
                    toast.error("Transaction not found");
                }
            } else {
                setError("Failed to load transaction data");
                toast.error("Failed to load transaction data");
            }
        } catch (err) {
            console.error("Error fetching transaction:", err);
            setError(err.message || "An error occurred");
            toast.error(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        router.back();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-800">
                <p>Loading transaction details...</p>
            </div>
        );
    }

    if (error || !transaction) {
        return (
            <div className="relative min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <style jsx global>{`
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                    body {
                        font-family: 'Inter', sans-serif;
                    }
                `}</style>
                <div className="relative bg-white rounded-xl shadow-lg p-6 max-w-md w-full sm:p-8">
                    <button
                        onClick={handleClose}
                        className="absolute -top-3 -right-3 w-10 h-10 bg-[#4B697F] rounded-full flex items-center justify-center shadow-md hover:bg-red-700 transition-colors duration-200"
                    >
                        <X className="text-white" size={24} strokeWidth={2} />
                    </button>
                    <p className="text-red-500 mb-4">{error || "Transaction not found"}</p>
                    <button
                        onClick={handleClose}
                        className="w-full px-4 py-2 bg-[#4B697F] text-white rounded hover:bg-opacity-90"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const userImage = transaction.userImagePath || "/image/default-user.png";

    return (
        <div className="relative min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                body {
                    font-family: 'Inter', sans-serif;
                }
            `}</style>
            <div className="relative bg-white rounded-xl shadow-lg p-6 max-w-md w-full sm:p-8">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute -top-3 -right-3 w-10 h-10 bg-[#4B697F] rounded-full flex items-center justify-center shadow-md hover:bg-red-700 transition-colors duration-200"
                >
                    <X className="text-white" size={24} strokeWidth={2} />
                </button>

                <div className="flex flex-col items-center sm:flex-row sm:items-start sm:gap-6 mb-6">
                    {/* User Image */}
                    <div className="flex-shrink-0 mb-4 sm:mb-0">
                        <Image
                            src={userImage}
                            alt="User"
                            width={100}
                            height={100}
                            className="rounded-full object-cover border border-gray-200"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/image/default-user.png";
                            }}
                            unoptimized
                        />
                    </div>

                    {/* User Details */}
                    <div className="text-center sm:text-left">
                        <p className="text-gray-800 text-lg font-semibold mb-1">
                            Full name : {transaction.fullName}
                        </p>
                        <p className="text-gray-600 text-sm mb-1">
                            Email: {transaction.email}
                        </p>
                        <p className="text-gray-600 text-sm">
                            Phone number: {transaction.phone}
                        </p>
                    </div>
                </div>

                <h3 className="text-gray-800 text-xl font-bold mb-4 border-b pb-2 border-gray-200">
                    Transaction Details :
                </h3>

                {/* Transaction Details Grid */}
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                    <p className="text-gray-600 font-medium">Transaction ID :</p>
                    <p className="text-right text-gray-800 font-semibold">
                        {transaction.transactionID}
                    </p>

                    <p className="text-gray-600 font-medium">Event Name:</p>
                    <p className="text-right text-gray-800">
                        {transaction.userName}
                    </p>

                    <p className="text-gray-600 font-medium">Platform:</p>
                    <p className="text-right text-gray-800">
                        {transaction.platform}
                    </p>

                    <p className="text-gray-600 font-medium">Status:</p>
                    <p className="text-right">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            transaction.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : transaction.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                        }`}>
                            {transaction.status.charAt(0).toUpperCase() +
                                transaction.status.slice(1)}
                        </span>
                    </p>

                    <p className="text-gray-600 font-medium">Amount Paid:</p>
                    <p className="text-right text-gray-800">
                        {transaction.currency} {transaction.receivedAmount.toFixed(2)}
                    </p>

                    <p className="text-gray-600 font-medium">Store Transaction ID:</p>
                    <p className="text-right text-gray-800 text-xs">
                        {transaction.accNumber ? `**** **** *${transaction.accNumber.slice(-3)}` : 'N/A'}
                    </p>

                    <p className="text-gray-600 font-medium">RevenueCat ID:</p>
                    <p className="text-right text-gray-800 text-xs">
                        {transaction.revenuecat_transaction_id ? 
                            transaction.revenuecat_transaction_id.slice(0, 20) + '...' 
                            : 'N/A'}
                    </p>

                    <p className="text-gray-600 font-medium">Verified At:</p>
                    <p className="text-right text-gray-800 text-xs">
                        {transaction.verified_at 
                            ? new Date(transaction.verified_at).toLocaleString()
                            : 'N/A'}
                    </p>

                    <p className="text-gray-600 font-medium">Refunded:</p>
                    <p className="text-right text-gray-800">
                        {transaction.refunded_at ? "Yes" : "No"}
                    </p>

                    <p className="text-gray-800 font-semibold text-base border-t-2 pt-2 col-span-2">
                        Final Amount: <span className="text-right">{transaction.currency} {transaction.finalAmount.toFixed(2)}</span>
                    </p>
                </div>

                {/* Close Button at Bottom */}
                <button
                    onClick={handleClose}
                    className="w-full mt-6 px-4 py-2 bg-[#4B697F] text-white rounded hover:bg-opacity-90 transition"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default TransactionDetailsPage;
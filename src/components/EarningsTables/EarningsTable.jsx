// components/EarningsTable.js
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRouter } from 'next/navigation';
import toast from "react-hot-toast";
import { API_ENDPOINTS } from "../lib/api";
import apiCall from "../lib/apiClient";



const itemsPerPage = 10;

export default function EarningsTable() {
  const router = useRouter();
  const [selected, setSelected] = useState("All");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState("0.00");
  const [paymentStats, setPaymentStats] = useState({
    completed: 0,
    pending: 0,
    refunded: 0,
  });

  const options = ["All", "Completed", "Pending", "Refunded"];

  // Fetch payments data
  useEffect(() => {
    fetchPaymentsData();
  }, []);

  const fetchPaymentsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiCall(
        API_ENDPOINTS.DASHBOARD.ALL_PAYMENTS,
        "GET"
      );

      if (response && response.payments && Array.isArray(response.payments)) {
        // Transform API data to table format
        const transformedData = response.payments.map((payment) => ({
          serial: `INV${payment.id}`,
          userName: payment.event_name || "N/A",
          userType: payment.platform || "N/A",
          subscriptionType: payment.status || "N/A",
          amount: parseFloat(payment.amount_paid) || 0,
          accNumber: payment.store_transaction_id || "N/A",
          date: new Date(payment.payment_date).toLocaleString() || "N/A",
          fullName: payment.admin_name || "N/A",
          email: payment.admin_email || "N/A",
          phone: "N/A",
          transactionID: `TXN${payment.id}`,
          accHolderName: payment.event_admin || "N/A",
          receivedAmount: parseFloat(payment.amount_paid) || 0,
          detectPercentage: 0,
          finalAmount: parseFloat(payment.amount_paid) || 0,
          userImagePath: "/image/user-photo.png",
          status: payment.status,
          currency: payment.currency || "USD",
          originalPayment: payment, // Keep original data
        }));

        setData(transformedData);

        // Calculate total revenue
        const total = transformedData.reduce((sum, item) => sum + item.amount, 0);
        setTotalRevenue(total.toFixed(2));

        // Calculate payment stats
        const stats = {
          completed: transformedData.filter(item => item.status === "completed").length,
          pending: transformedData.filter(item => item.status === "pending").length,
          refunded: transformedData.filter(item => item.status === "refunded").length,
        };
        setPaymentStats(stats);

        toast.success("Payments loaded successfully!");
      } else {
        setError("No payment data found");
        toast.error("No payment data found");
      }
    } catch (err) {
      console.error("Error fetching payments:", err);
      setError(err.message || "Failed to load payments data");
      toast.error(err.message || "Failed to load payments data");
    } finally {
      setLoading(false);
    }
  };

  // Filter data based on search and selected filter
  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.userName.toLowerCase().includes(search.toLowerCase()) ||
      item.serial.toLowerCase().includes(search.toLowerCase()) ||
      item.accNumber.toLowerCase().includes(search.toLowerCase()) ||
      item.date.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      selected === "All" || item.status === selected.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const viewTransactionDetails = (transactionID) => {
    router.push(`/admin/earning/${transactionID}`);
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    fetchPaymentsData();
  };

  if (loading) {
    return (
      <div
        style={{ boxShadow: "0px 4px 14.7px 0px rgba(0, 0, 0, 0.25)" }}
        className="bg-white text-black p-6 rounded-lg shadow-lg flex items-center justify-center min-h-96"
      >
        <div className="text-gray-600">Loading payments data...</div>
      </div>
    );
  }

  if (error && data.length === 0) {
    return (
      <div
        style={{ boxShadow: "0px 4px 14.7px 0px rgba(0, 0, 0, 0.25)" }}
        className="bg-white text-black p-6 rounded-lg shadow-lg"
      >
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-[#4B697F] text-white rounded hover:bg-opacity-90"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div
        style={{ boxShadow: "0px 4px 14.7px 0px rgba(0, 0, 0, 0.25)" }}
        className="bg-white text-black p-6 rounded-lg shadow-lg"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold">Earnings Overview</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 bg-gray-100 rounded-tl-[7.04px] rounded-bl-[7.04px] border-[1px] border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={handleRefresh}
              className="px-3 py-2 bg-[#4B697F] text-white rounded text-sm hover:bg-opacity-90 transition"
              title="Refresh data"
            >
              ↻
            </button>
          </div>
        </div>

        {/* Revenue Summary */}
        <div className="relative text-black flex flex-col justify-center items-center mb-6">
          <div className="mb-2 text-sm">
            {selected} Revenue{" "}
            <span className="font-bold">
              ${selected === "All" 
                ? totalRevenue 
                : filteredData.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-[8.31px] w-auto px-4 mb-5 h-[27px] rounded-[18.28px] bg-[#4B697F] border border-gray-300 text-white"
          >
            <span className="text-xs">{selected}</span>
            <ChevronDown
              size={16}
              className={`transform transition-transform duration-300 ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            className={`absolute top-full mt-1 w-[100px] rounded bg-gray-100 border border-gray-300 text-xs shadow-md z-10 transform transition-all duration-300 origin-top ${
              open
                ? "scale-y-100 opacity-100"
                : "scale-y-0 opacity-0 pointer-events-none"
            }`}
          >
            {options.map((option) => (
              <div
                key={option}
                className="px-3 py-1 cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  setSelected(option);
                  setOpen(false);
                  setCurrentPage(1);
                }}
              >
                {option}
              </div>
            ))}
          </div>

          {/* Payment Stats */}
          <div className="text-xs text-gray-600 mt-3 space-x-4">
            <span>Completed: {paymentStats.completed}</span>
            <span>Pending: {paymentStats.pending}</span>
            <span>Refunded: {paymentStats.refunded}</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {paginatedData.length > 0 ? (
            <table className="w-full text-sm text-black">
              <thead>
                <tr className="bg-[#4B697F] text-white text-center">
                  <th className="py-2 px-4">Serial</th>
                  <th className="py-2 px-4">Event Name</th>
                  <th className="py-2 px-4">Amount</th>
                  <th className="py-2 px-4">Transaction ID</th>
                  <th className="py-2 px-4">Date</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-200 hover:bg-gray-50 transition text-center"
                  >
                    <td className="py-2 px-4">{item.serial}</td>
                    <td className="py-2 px-4 flex items-center gap-2 justify-center">
                      <Image
                        src={item.userImagePath}
                        alt="Event"
                        width={24}
                        height={24}
                        className="rounded-full"
                        onError={(e) => {
                          e.target.src = "/image/default-user.png";
                        }}
                        unoptimized
                      />
                      {item.userName}
                    </td>
                    <td className="py-2 px-4">
                      {item.currency} {item.amount.toFixed(2)}
                    </td>
                    <td className="py-2 px-4 text-xs">{item.accNumber}</td>
                    <td className="py-2 px-4 text-xs">{item.date}</td>
                    <td className="py-2 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          item.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : item.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.status.charAt(0).toUpperCase() +
                          item.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => viewTransactionDetails(item.transactionID)}
                        className="hover:opacity-75 transition"
                      >
                        <Image
                          src="/icon/eye.svg"
                          alt="View"
                          width={24}
                          height={24}
                          unoptimized
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No payments found
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center mt-6 gap-2 text-sm text-black">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center border border-[#4B697F] rounded-full justify-center p-[10px] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="8"
              height="14"
              viewBox="0 0 8 14"
              fill="none"
            >
              <path
                d="M6.99995 13C6.99995 13 1.00001 8.58107 0.999999 6.99995C0.999986 5.41884 7 1 7 1"
                stroke="#4B697F"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {Array.from({ length: totalPages }).map((_, index) => {
            const pageNumber = index + 1;
            if (
              pageNumber === 1 ||
              pageNumber === totalPages ||
              (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
            ) {
              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`w-8 h-8 flex items-center justify-center rounded ${
                    currentPage === pageNumber
                      ? "bg-[#4B697F] text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            } else if (
              (pageNumber === currentPage - 3 && currentPage > 4) ||
              (pageNumber === currentPage + 3 && currentPage < totalPages - 3)
            ) {
              return (
                <span key={pageNumber} className="px-2 text-gray-500">
                  .....
                </span>
              );
            }
            return null;
          })}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-8 h-8 flex items-center border border-[#4B697F] rounded-full justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="8"
              height="14"
              viewBox="0 0 8 14"
              fill="none"
            >
              <path
                d="M1.00005 1C1.00005 1 6.99999 5.41893 7 7.00005C7.00001 8.58116 1 13 1 13"
                stroke="#4B697F"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
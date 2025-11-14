import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Checkout() {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(10);
  const router = useRouter();
  const { amount: queryAmount } = router.query;

  // This will run when the component mounts and when the router is ready
  useEffect(() => {
    if (router.isReady) {
      const parsedAmount = parseFloat(queryAmount);
      if (!isNaN(parsedAmount) && parsedAmount > 0) {
        setAmount(parsedAmount);
      }
    }
  }, [router.isReady, queryAmount]);

  const createOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/createCashfreeOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_amount: parseFloat(amount),
          customer_id: "cust_001",
          customer_email: "test@example.com",
          customer_phone: "9999999999",
          order_note: `Add to wallet: ${amount}`
        }),
      });

      const data = await res.json();

      if (data?.payment_session_id) {
        const cashfree = new window.Cashfree({ mode: "sandbox" });
        cashfree.checkout({
          paymentSessionId: data.payment_session_id,
          redirectTarget: "_self",
        });
      } else {
        alert("Order creation failed: " + (data.message || "Unknown error"));
        console.error(data);
      }
    } catch (err) {
      alert("Error creating order");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center mt-20 p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
            <button onClick={() => router.back()} className="text-blue-600 mb-4">&larr; Go Back</button>
            <h2 className="text-2xl mb-6 font-bold text-center">💳 Add Funds to Wallet</h2>
            <form onSubmit={createOrder} className="space-y-6">
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount (INR)</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">₹</span>
                        </div>
                        <input
                            type="number"
                            name="amount"
                            id="amount"
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md h-12"
                            placeholder="10.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            min="1"
                            step="any"
                            required
                            disabled={!!queryAmount} // Disable if amount is passed in URL
                        />
                    </div>
                    {queryAmount && <p className="mt-2 text-xs text-gray-500">This amount is required to complete your previous action.</p>}
                </div>

                <button
                    type="submit"
                    disabled={loading || !amount || amount < 1}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-md disabled:bg-gray-400"
                >
                    {loading ? "Processing..." : `Pay ₹${amount || 0}`}
                </button>
            </form>
        </div>
      </div>
      <script src="https://sdk.cashfree.com/js/v3/cashfree.js"></script>
    </>
  );
}

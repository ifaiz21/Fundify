function PaymentMethodIcons() {
    return (
      <div className="flex flex-wrap gap-4">
        {/* Visa */}
        <div className="payment-icon bg-blue-100 rounded-lg p-3 w-20 h-10 flex items-center justify-center">
          <span className="text-[#0066B2] font-bold text-medium">VISA</span>
        </div>
  
        {/* Stripe */}
        <div className="payment-icon bg-purple-100 rounded-lg p-3 w-20 h-10 flex items-center justify-center">
          <span className="text-[#6772E5] font-medium text-medium">stripe</span>
        </div>
  
        {/* Mastercard */}
        <div className="payment-icon bg-orange-100 rounded-lg p-3 w-20 h-10 flex items-center justify-center">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-[#EB001B] rounded-full"></div>
            <div className="w-8 h-8 bg-[#F79E1B] rounded-full -ml-4"></div>
          </div>
        </div>
  
        {/* JazzCash */}
        <div className="payment-icon bg-orange-100 rounded-lg p-3 w-20 h-10 flex items-center justify-center">
          <span className="font-bold text-medium">
            <span className="text-[#FAC914]">Jazz</span>
            <span className="text-[#FAC914]">Cash</span>
          </span>
        </div>
  
        {/* Easypaisa */}
        <div className="payment-icon bg-green-100 rounded-lg p-3 w-20 h-10 flex items-center justify-center">
          <span className="text-[#6CC24A] font-medium text-medium">easypaisa</span>
        </div>
      </div>
    )
  }
  
  export default PaymentMethodIcons;
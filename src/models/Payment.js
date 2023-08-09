class Payment {
  constructor(paymentDate, amount, isMonthlyPayment) {
    this.payment_date = paymentDate;
    this.amount = amount;
    this.is_monthly_payment = isMonthlyPayment;
  }
}

module.exports = Payment;

class Customer {
  constructor(name, phone) {
    this.name = name;
    this.phone = phone;
    this.payments = [];
    this.vehicles = [];
  }

  has_paid_current_month() {
    // determinar si el cliente ha pagado el mes actual
    return this.payments.some(payment => payment.is_monthly_payment && payment.payment_date.getMonth() === new Date().getMonth());
  }

  get_payment_history() {
    return this.payments;
  }
}

module.exports = Customer;

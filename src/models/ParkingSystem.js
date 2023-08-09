class ParkingSystem {
  constructor(database) {
    this.vehicles = [];
    this.customers = [];
    this.db = database; // Almacenar la conexión con la base de datos
  }

  register_vehicle(vehicle) {
    this.vehicles.push(vehicle);

    // Agregar el vehículo a la base de datos IndexedDB
    const transaction = this.db.transaction(['vehicles'], 'readwrite');
    const store = transaction.objectStore('vehicles');
    store.add(vehicle);
  }

  process_payment(payment) {
    // procesar un pago
    const pay = new Payment(new Date(), amount, isMonthlyPayment);
    customer.payments.push(pay);
  
    // Actualizar la base de datos con el nuevo pago
    const transaction = this.db.transaction(['customers'], 'readwrite');
    const store = transaction.objectStore('customers');
    store.put(customer);
  
    // ... lógica adicional, enviar un recibo al cliente

  }

  generate_payment_reminders() {
    // generar recordatorios de pago
    this.customers.forEach(customer => {
      if (!customer.has_paid_current_month()) {
        // Enviar un recordatorio de pago, por ejemplo, por correo electrónico
      }
    });
  }
}

module.exports = ParkingSystem;

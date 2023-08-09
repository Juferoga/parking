class Vehicle {
  constructor(licensePlate, vehicleType, entryTime) {
    this.license_plate = licensePlate;
    this.vehicle_type = vehicleType;
    this.entry_time = new Date(entryTime);
  }

  calculate_time_parked() {
    const now = new Date();
    return now - this.entry_time;
  }

  calculate_cost() {
    // calcular el costo en función del tipo de vehículo y el tiempo estacionado
    const hoursParked = this.calculate_time_parked() / (1000 * 60 * 60);
    let rate;

    // Definir una tarifa en función del tipo de vehículo
    switch (this.vehicle_type) {
      case 'car':
        rate = 500; // por ejemplo, 500 pesos por hora
        break;
      case 'motorcycle':
        rate = 300;
        break;
      // ... otros tipos de vehículos
    }

    return hoursParked * rate;
  }
}

module.exports = Vehicle;

class Payment {
  constructor(paymentDate, amount, isMonthlyPayment) {
    this.payment_date = paymentDate;
    this.amount = amount;
    this.is_monthly_payment = isMonthlyPayment;
  }
}

module.exports = Payment;

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

// Importar las clases
const Vehicle = require('./models/Vehicle');
const Payment = require('./models/Payment');
const Customer = require('./models/Customer');
const ParkingSystem = require('./models/ParkingSystem');

let db; // Variable para almacenar la conexión con la base de datos
let parkingSystem; // Variable para almacenar la instancia del sistema de estacionamiento

// Abrir la base de datos
const request = indexedDB.open('ParkingSystemDB', 1);

request.onerror = function (event) {
  console.log('Error opening database:', event.target.errorCode);
};

request.onsuccess = function (event) {
  db = event.target.result;

  // Instancia del sistema de estacionamiento
  parkingSystem = new ParkingSystem(db);

  // Llamar a las funciones para inicializar la página
  displayPaymentHistory();
  generatePaymentReminders();
};

request.onupgradeneeded = function (event) {
  db = event.target.result;
  db.createObjectStore('vehicles', { keyPath: 'license_plate' });
  db.createObjectStore('customers', { keyPath: 'phone' });
};

// Registrar un vehículo
document.getElementById('vehicleForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const licensePlate = document.getElementById('licensePlate').value;
  const vehicleType = document.getElementById('vehicleType').value;
  const vehicle = new Vehicle(licensePlate, vehicleType, new Date());
  parkingSystem.register_vehicle(vehicle);
  alert('Vehicle registered successfully!');
});

// Procesar un pago
document.getElementById('paymentForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const customerPhone = document.getElementById('customerPhone').value;
  const amount = document.getElementById('amount').value;
  const isMonthlyPayment = document.getElementById('isMonthlyPayment').checked;

  // Encontrar o crear un cliente
  let customer = parkingSystem.customers.find(c => c.phone === customerPhone);
  if (!customer) {
    customer = new Customer('Unknown', customerPhone);
    parkingSystem.customers.push(customer);
  }

  parkingSystem.process_payment(customer, amount, isMonthlyPayment);
  alert('Payment processed successfully!');
  displayPaymentHistory();
});

// Mostrar el historial de pagos
function displayPaymentHistory() {
  const paymentHistoryDiv = document.getElementById('paymentHistory');
  paymentHistoryDiv.innerHTML = '<h2>Payment History:</h2>';

  parkingSystem.customers.forEach(customer => {
    const payments = customer.get_payment_history();
    payments.forEach(payment => {
      paymentHistoryDiv.innerHTML += `<p>${customer.phone}: ${payment.amount} (monthly: ${payment.is_monthly_payment})</p>`;
    });
  });
}

// Generar recordatorios de pago
function generatePaymentReminders() {
  const paymentRemindersDiv = document.getElementById('paymentReminders');
  paymentRemindersDiv.innerHTML = '<h2>Payment Reminders:</h2>';

  parkingSystem.generate_payment_reminders();
  parkingSystem.customers.forEach(customer => {
    if (!customer.has_paid_current_month()) {
      paymentRemindersDiv.innerHTML += `<p>Reminder for ${customer.phone}: Monthly payment is due!</p>`;
    }
  });
}

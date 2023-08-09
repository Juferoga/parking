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
  console.log('Error abriendo la base de datos:', event.target.errorCode);
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

// ! ---------------------------------------------------------------------------------
// Registrar un vehículo
document.getElementById('vehicleForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const licensePlate = document.getElementById('licensePlate').value;
  const vehicleType = document.getElementById('vehicleType').value;
  const vehicle = new Vehicle(licensePlate, vehicleType, new Date());
  parkingSystem.register_vehicle(vehicle);
  updateVehicleTable();
  alert('Vehículo registrado correctamente!');
});

// Actualizar la tabla de vehículos
function updateVehicleTable() {
  const tableBody = document.getElementById('vehicleTable').getElementsByTagName('tbody')[0];
  tableBody.innerHTML = '';

  parkingSystem.vehicles.forEach((vehicle, index) => {
    const row = tableBody.insertRow();

    // License Plate
    const licenseCell = row.insertCell(0);
    licenseCell.innerHTML = vehicle.license_plate;

    // Vehicle Type
    const typeCell = row.insertCell(1);
    typeCell.innerHTML = vehicle.vehicle_type;

    // Entry Time
    const entryTimeCell = row.insertCell(2);
    entryTimeCell.innerHTML = vehicle.entry_time;

    // Actions (Edit & Delete)
    const actionsCell = row.insertCell(3);
    actionsCell.innerHTML = `
      <button onclick="editVehicle(${index})" class="btn btn-warning btn-sm">Editar</button>
      <button onclick="deleteVehicle(${index})" class="btn btn-danger btn-sm">Eliminar</button>`;
  });
}

// Editar un vehículo (aquí puedes agregar la lógica para editar un vehículo)
function editVehicle(index) {
  const vehicle = parkingSystem.vehicles[index];
  // Aquí puedes rellenar un formulario de edición con los datos del vehículo
}

// Eliminar un vehículo
function deleteVehicle(index) {
  parkingSystem.vehicles.splice(index, 1);
  updateVehicleTable();
  alert('Vehículo eliminado correctamente!');
}

// Inicializar la tabla de vehículos al cargar la página
updateVehicleTable();


// ! ---------------------------------------------------------------------------------
// Procesar un pago
document.getElementById('paymentForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const customerPhone = document.getElementById('customerPhone').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const isMonthlyPayment = document.getElementById('isMonthlyPayment').checked;

  // Encontrar o crear un cliente
  let customer = parkingSystem.customers.find(c => c.phone === customerPhone);
  if (!customer) {
    customer = new Customer('Unknown', customerPhone);
    parkingSystem.customers.push(customer);
  }

  const payment = new Payment(new Date(), amount, isMonthlyPayment);
  customer.payments.push(payment);

  alert('PAgo procesado correctamente!');
  displayPaymentHistory();
});

// Mostrar el historial de pagos
function displayPaymentHistory() {
  const paymentHistoryDiv = document.getElementById('paymentHistory');
  paymentHistoryDiv.innerHTML = '<h2>Historial de pagos:</h2>';

  parkingSystem.customers.forEach(customer => {
    const payments = customer.get_payment_history();
    payments.forEach(payment => {
      paymentHistoryDiv.innerHTML += `<p>${customer.phone}: ${payment.amount} (mensualmente: ${payment.is_monthly_payment})</p>`;
    });
  });
}

// Inicializar el historial de pagos al cargar la página
displayPaymentHistory();

// ! ---------------------------------------------------------------------------------
// Agregar un cliente
document.getElementById('customerForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const name = document.getElementById('customerName').value;
  const phone = document.getElementById('customerPhone').value;
  const customer = new Customer(name, phone);
  parkingSystem.customers.push(customer);
  updateCustomerTable();
  alert('Cliente añadido correctamente!');
});

// Actualizar la tabla de clientes
function updateCustomerTable() {
  const tableBody = document.getElementById('customerTable').getElementsByTagName('tbody')[0];
  tableBody.innerHTML = '';

  parkingSystem.customers.forEach((customer, index) => {
    const row = tableBody.insertRow();

    // Name
    const nameCell = row.insertCell(0);
    nameCell.innerHTML = customer.name;

    // Phone
    const phoneCell = row.insertCell(1);
    phoneCell.innerHTML = customer.phone;

    // Actions (Edit & Delete)
    const actionsCell = row.insertCell(2);
    actionsCell.innerHTML = `
      <button onclick="editCustomer(${index})" class="btn btn-warning btn-sm">Editar</button>
      <button onclick="deleteCustomer(${index})" class="btn btn-danger btn-sm">Eliminar</button>`;
  });
}

// lógica para editar un cliente
function editCustomer(index) {
  const customer = parkingSystem.customers[index];
  // rellenar un formulario de edición con los datos del cliente
}

// Eliminar un cliente
function deleteCustomer(index) {
  parkingSystem.customers.splice(index, 1);
  updateCustomerTable();
  alert('Cliente eliminado correctamente!');
}

// Inicializar la tabla de clientes al cargar la página
updateCustomerTable();

// ? ----------------------------------------------------------------------------------

// Generar recordatorios de pago
function generatePaymentReminders() {
  const paymentRemindersDiv = document.getElementById('paymentReminders');
  paymentRemindersDiv.innerHTML = '<h2>Recordatorios de pago:</h2>';

  parkingSystem.generate_payment_reminders();
  parkingSystem.customers.forEach(customer => {
    if (!customer.has_paid_current_month()) {
      paymentRemindersDiv.innerHTML += `<p>Recordatorio para ${customer.phone}: Mes de pago vencido!</p>`;
    }
  });
}

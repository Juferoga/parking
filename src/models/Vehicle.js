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

package inspections.management.domains.fviberi.vehicle

import inspections.management.pogos.vehicles.BikeVehicle
import inspections.management.pogos.vehicles.CarVehicle
import inspections.management.pogos.vehicles.ScooterVehicle
import inspections.management.pogos.vehicles.Vehicle

interface IVehicle {

    Vehicle buildVehicle()

    enum Type {

        CAR(CarVehicle),
        E_SCOOTER(ScooterVehicle),
        E_BIKE(BikeVehicle)

        final Class clazz

        Type(Class clazz) {
            this.clazz = clazz
        }

    }

}

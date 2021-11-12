package inspections.management.domains.fviberi.vehicle

import inspections.management.pogos.vehicles.Vehicle

interface IVehicle {

    Vehicle buildVehicle()

    enum Type {

        CAR,
        SCOOTER

    }

}

package inspections.management.pogos.vehicles

import groovy.transform.TupleConstructor
import inspections.management.domains.fviberi.vehicle.IVehicle

@TupleConstructor
class Vehicle {

    IVehicle.Type type
    String identifier
    String brand
    String model

}

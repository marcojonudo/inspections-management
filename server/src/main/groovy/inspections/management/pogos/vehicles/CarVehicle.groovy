package inspections.management.pogos.vehicles

import groovy.transform.TupleConstructor

@TupleConstructor(includeSuperProperties = true, callSuper = true)
class CarVehicle extends Vehicle {

    String cylinder
    String engineCode
    String power
    Integer registrationYear

}

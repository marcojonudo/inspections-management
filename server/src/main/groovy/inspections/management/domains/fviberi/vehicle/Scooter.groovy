package inspections.management.domains.fviberi.vehicle

import grails.gorm.annotation.Entity
import inspections.management.pogos.vehicles.ScooterVehicle
import inspections.management.pogos.vehicles.Vehicle
import inspections.management.utils.Constants
import org.grails.datastore.gorm.GormEntity

@Entity
class Scooter implements GormEntity<Scooter>, IVehicle {

    String serialNumber
    String brand
    String model
    String color

    static transients = ['type']

    static mapping = {
        datasource Constants.DataSource.FVIBERI
        table 'fvpatinete'

        serialNumber column: 'nuserie'
        brand column: 'nomarca'
        model column: 'nomodelo'
        color column: 'color'

        version false
    }

    Vehicle buildVehicle() {
        return new ScooterVehicle(Type.SCOOTER, this.serialNumber, this.brand, this.model)
    }

}

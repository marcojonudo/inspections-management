package inspections.management.domains.fviberi.vehicle

import grails.gorm.annotation.Entity
import inspections.management.pogos.vehicles.CarVehicle
import inspections.management.pogos.vehicles.Vehicle
import inspections.management.utils.Constants
import org.grails.datastore.gorm.GormEntity

@Entity
class Car implements GormEntity<Car>, IVehicle {

    String numberPlate
    String model
    String cylinder
    String brand
    Integer registrationYear

    CarInfo extraInfo

    static transients = ['extraInfo', 'type']

    static constraints = {
        registrationYear nullable: true
    }

    static mapping = {
        datasource Constants.DataSource.FVIBERI
        table 'fvvehicu'

        numberPlate column: 'numatric'
        model column: 'nomodelo'
        cylinder column: 'nucilind'
        brand column: 'nomarcav'
        registrationYear column: 'nuanomat'

        id name: 'numberPlate', generator: 'assigned'
        version false
    }

    Vehicle buildVehicle() {
        return new CarVehicle(
            Type.CAR,
            this.numberPlate,
            this.brand,
            this.model,
            this.cylinder,
            this.extraInfo?.engineCode,
            this.extraInfo?.power,
            this.registrationYear
        )
    }

}

package inspections.management.domains.fviberi


import grails.gorm.annotation.Entity
import inspections.management.utils.Constants
import org.grails.datastore.gorm.GormEntity

@Entity
class Vehicle implements GormEntity<Vehicle> {

    String numberPlate
    String model
    String cylinder
    String brand
    Integer registrationYear

    VehicleInfo extraInfo

    static transients = ['extraInfo']

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

}

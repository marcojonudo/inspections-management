package inspections.management.domains.fviberi.vehicle


import grails.gorm.annotation.Entity
import inspections.management.utils.Constants
import org.grails.datastore.gorm.GormEntity

@Entity
class CarInfo implements GormEntity<CarInfo> {

    String numberPlate
    String engineCode
    String power

    static mapping = {
        datasource Constants.DataSource.FVIBERI
        table 'fvvehicuext'

        numberPlate column: 'numatric'
        engineCode column: 'enginecode'
        power column: 'potenciakw'

        id name: 'numberPlate', generator: 'assigned'
        version false
    }

}

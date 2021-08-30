package inspections.management.domains.fviberi


import grails.gorm.annotation.Entity
import inspections.management.utils.Constants
import org.grails.datastore.gorm.GormEntity

@Entity
class VehicleInfo implements GormEntity<VehicleInfo> {

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

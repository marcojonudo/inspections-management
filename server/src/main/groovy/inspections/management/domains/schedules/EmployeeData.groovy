package inspections.management.domains.schedules

import grails.gorm.annotation.Entity
import inspections.management.utils.Constants
import org.grails.datastore.gorm.GormEntity

@Entity
class EmployeeData implements GormEntity<EmployeeData> {

    String code
    String name
    String surname1
    String surname2

    static mapping = {
        datasource Constants.DataSource.SCHEDULES
        version defaultValue: 0
    }

}

package inspections.management.domains.fviberi

import grails.gorm.annotation.Entity
import inspections.management.utils.Constants
import org.grails.datastore.gorm.GormEntity

@Entity
class OrderTime implements GormEntity<OrderTime> {

	Integer orderNumber
	String code
	String mechanicCode

	static mapping = {
		datasource Constants.DataSource.FVIBERI
		table 'fvsegtie'

		orderNumber column: 'nuordrep'
		code column: 'codcorto'
		mechanicCode column: 'covende3'

		id generator: 'assigned', name: 'orderNumber'
		version false
	}

}

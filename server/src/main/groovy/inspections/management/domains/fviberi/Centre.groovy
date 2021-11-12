package inspections.management.domains.fviberi

import grails.gorm.annotation.Entity
import inspections.management.utils.Constants
import org.grails.datastore.gorm.GormEntity

@Entity
class Centre implements GormEntity<Centre> {

	String code
	String name
	String addressLine1
	String addressLine2
	String addressLine3
	String phoneNumber

	static mapping = {
		datasource Constants.DataSource.FVIBERI
		table 'fvcentro'

		code column: 'cocentro'
		name column: 'nocentro'
		addressLine1 column: 'nodirec1'
		addressLine2 column: 'nodirec2'
		addressLine3 column: 'nodirec3'
		phoneNumber column: 'nutelefo'

		id generator: 'assigned', name: 'code'
		version false
	}

}

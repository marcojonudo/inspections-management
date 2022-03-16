package inspections.management.domains.fviberi

import grails.gorm.annotation.Entity
import inspections.management.utils.Constants
import org.grails.datastore.gorm.GormEntity

@Entity
class Client implements GormEntity<Client> {

	int code
	String name
	String surnames
	Integer phoneNumber
	String email

	static mapping = {
		datasource Constants.DataSource.FVIBERI
		table 'fvclient'

		code column: 'coclient'
		name column: 'noclient'
		surnames column: 'apellido'
		phoneNumber column: 'nutelefo'
		email column: 'emailcli'

		id name: 'code', generator : 'assigned'
		version false
	}

}

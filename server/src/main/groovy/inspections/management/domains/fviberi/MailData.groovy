package inspections.management.domains.fviberi

import grails.gorm.annotation.Entity
import inspections.management.utils.Constants
import org.grails.datastore.gorm.GormEntity

@Entity
class MailData implements GormEntity<MailData> {

	String centreCode
	String email
	String password
	String host
	String port

	static mapping = {
		datasource Constants.DataSource.HESTIA_FVIBERI
		table 'fvusmail'

		centreCode column: 'cocentro'
		email column: 'usuario'
		password column: 'passwd'

		id name: 'centreCode', generator : 'assigned'
		version false
	}

}

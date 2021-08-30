package inspections.management.domains.fviberi

import com.fasterxml.jackson.annotation.JsonFormat
import grails.gorm.annotation.Entity
import inspections.management.utils.Constants
import org.grails.datastore.gorm.GormEntity

import java.time.LocalDate

@Entity
class Order implements GormEntity<Order> {

	int number

	@JsonFormat(pattern = Constants.DateFormat.yyyy_MM_dd, timezone = Constants.SPAIN_TIMEZONE)
	LocalDate day
	String state
	Vehicle vehicle
	Client client
	String sellerCode

	static hasMany = [lines: OrderLine]

	static mapping = {
		datasource Constants.DataSource.FVIBERI
		table 'fvcabord'

		number column: 'nuordrep'
		day column: 'feordrep'
		state column: 'clsituac'
		vehicle column: 'numatric', lazy: false
		client column: 'coclient', fetch: 'join'
		sellerCode column: 'covended'
		lines fetch: 'join'

		id generator: 'assigned', name: 'number'
		version false
	}

}

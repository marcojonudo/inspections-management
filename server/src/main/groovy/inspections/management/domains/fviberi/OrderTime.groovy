package inspections.management.domains.fviberi

import com.fasterxml.jackson.annotation.JsonFormat
import grails.gorm.annotation.Entity
import inspections.management.utils.Constants
import org.grails.datastore.gorm.GormEntity

import java.time.LocalDate

@Entity
class OrderTime implements GormEntity<OrderTime> {

	Integer orderNumber
	String code
	String mechanicCode

	@JsonFormat(pattern = Constants.DateFormat.yyyy_MM_dd, timezone = Constants.SPAIN_TIMEZONE)
	LocalDate day

	static mapping = {
		datasource Constants.DataSource.FVIBERI
		table 'fvsegtie'

		orderNumber column: 'nuordrep'
		code column: 'codcorto'
		mechanicCode column: 'covende3'
		day column: 'feconfcita'

		id generator: 'assigned', name: 'orderNumber'
		version false
	}

}

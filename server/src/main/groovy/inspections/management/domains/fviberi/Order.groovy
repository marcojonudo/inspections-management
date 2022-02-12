package inspections.management.domains.fviberi

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonInclude
import grails.gorm.annotation.Entity
import inspections.management.pogos.vehicles.Vehicle
import inspections.management.utils.Constants
import org.grails.datastore.gorm.GormEntity

import java.time.LocalDate

@Entity
class Order implements GormEntity<Order> {

	int number
	String code
	String state

	@JsonFormat(pattern = Constants.DateFormat.yyyy_MM_dd, timezone = Constants.SPAIN_TIMEZONE)
	LocalDate day
	String carIdentifier
	Vehicle vehicle
	Client client
	String sellerCode
	String mechanicCode
	String vehicleType
	boolean keys

	@JsonInclude
	Set<RelatedBudget> relatedBudgets

	@JsonInclude
	List<Budget> budgets

	static hasMany = [lines: OrderLine, relatedBudgets: RelatedBudget]

	static mapping = {
		datasource Constants.DataSource.FVIBERI
		table 'fvcabord'

		number column: 'nuordrep'
		day column: 'feordrep'
		state column: 'clsituac'
		carIdentifier column: 'numatric'
		client column: 'coclient', fetch: 'join'
		sellerCode column: 'covended'
		lines fetch: 'join'
		relatedBudgets fetch: 'join'
		vehicleType column: 'tipvehicu'

		id generator: 'assigned', name: 'number'
		version false
	}

	static transients = ['code', 'mechanicCode', 'budgets', 'vehicle', 'keys']

	boolean isAppointment() {
		return code.startsWith(Constants.APPOINTMENT_IDENTIFIER)
	}

	enum VehicleType {

		E_BIKE("BICICLETA"),
		CAR("COCHE"),
		MOTORBIKE("MOTO"),
		E_SCOOTER("PATINETE")

		final String type

		VehicleType(String type) {
			this.type = type
		}

	}

}

package inspections.management.domains.fviberi

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import grails.gorm.annotation.Entity
import inspections.management.deserializers.VehicleDeserializer
import inspections.management.domains.fviberi.vehicle.IVehicle
import inspections.management.domains.savedItems.SavedItem
import inspections.management.pogos.pdf.inspection.cards.CarCard
import inspections.management.pogos.pdf.inspection.cards.ScooterCard
import inspections.management.pogos.pdf.inspection.cards.VehicleCard
import inspections.management.pogos.vehicles.CarVehicle
import inspections.management.pogos.vehicles.ScooterVehicle
import inspections.management.pogos.vehicles.Vehicle
import inspections.management.services.data.OrderDataService
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

	@JsonDeserialize(using = VehicleDeserializer)
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

		BIKE(
			"BICICLETA",
			{ OrderDataService dataService, String id -> dataService.bikeDataService.find(id) },
			{ CarVehicle car, List<SavedItem> headerItems -> null },
			"bike.jpg"
		),
		CAR(
			"COCHE",
			{ OrderDataService dataService, String id -> dataService.carDataService.find(id) },
			{ CarVehicle car, List<SavedItem> headerItems -> new CarCard(car, headerItems) },
			"car.jpg"
		),
		MOTORBIKE(
			"MOTO",
			{ OrderDataService dataService, String id -> null },
			{ CarVehicle car, List<SavedItem> headerItems -> null },
			"motorbike.jpg"
		),
		E_SCOOTER(
			"PATINETE",
			{ OrderDataService dataService, String id -> dataService.scooterDataService.find(id) },
			{ ScooterVehicle scooter, List<SavedItem> headerItems -> new ScooterCard(scooter) },
			"scooter.jpg"
		),

		final String type
		final Closure<IVehicle> find
		final Closure<VehicleCard> buildCard
		final String backgroundImage

		VehicleType(
			String type, Closure<IVehicle> find, Closure<VehicleCard> buildCard, String backgroundImage
		) {
			this.type = type
			this.find = find
			this.buildCard = buildCard
			this.backgroundImage = backgroundImage
		}

	}

}

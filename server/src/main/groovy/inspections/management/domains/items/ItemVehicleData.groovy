package inspections.management.domains.items

import com.fasterxml.jackson.annotation.JsonIgnore
import grails.gorm.annotation.Entity
import inspections.management.domains.GaragePosition
import inspections.management.domains.VehicleSection
import org.grails.datastore.gorm.GormEntity

@Entity
class ItemVehicleData implements GormEntity<ItemVehicleData> {

	@JsonIgnore
	Item item

	String vehicle
	GaragePosition garagePosition
	VehicleSection vehicleSection

	static belongsTo = Item

	static constraints = {
		garagePosition nullable: true
		vehicleSection nullable: true
	}

	static mapping = {
		garagePosition lazy: false
		vehicleSection lazy: false
	}

}

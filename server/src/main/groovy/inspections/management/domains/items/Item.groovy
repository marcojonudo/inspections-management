package inspections.management.domains.items

import com.fasterxml.jackson.annotation.JsonIgnore
import grails.gorm.annotation.Entity
import inspections.management.domains.InspectionVehicle
import inspections.management.domains.ItemCategory
import org.grails.datastore.gorm.GormEntity

@Entity
class Item implements GormEntity<Item> {

	Type type
	String code
	ItemCategory category

	@JsonIgnore
	Set<InspectionVehicle> inspectionsVehicle

	@JsonIgnore
	Set<ItemVehicleData> vehicleDataList

    ItemVehicleData vehicleData

	static hasMany = [inspectionsVehicle: InspectionVehicle, vehicleDataList: ItemVehicleData]

	static belongsTo = InspectionVehicle

	static transients = ['vehicleData']

	static constraints = {
		type maxSize: 25
		category nullable: true
	}

	static mapping = {
		tablePerHierarchy false

		vehicleDataList fetch: 'join'
		category lazy: false
	}

	enum Type {

		TEXT,
		SELECT,
		TEXT_AREA

	}

}

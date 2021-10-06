package inspections.management.domains.items

import com.fasterxml.jackson.annotation.JsonIgnore
import grails.gorm.annotation.Entity
import inspections.management.domains.InspectionVehicle
import org.grails.datastore.gorm.GormEntity

@Entity
class Item implements GormEntity<Item> {

	Type type
	String code

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
	}

	static mapping = {
		tablePerHierarchy false

		vehicleDataList fetch: 'join'
	}

	enum Type {

		TEXT,
		SELECT,
		TEXT_AREA

	}

}

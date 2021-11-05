package inspections.management.domains.items

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonInclude
import grails.gorm.annotation.Entity
import inspections.management.domains.InspectionVehicle
import inspections.management.domains.ItemCategory
import inspections.management.domains.ItemRelation
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

	@JsonInclude
	Set<ItemRelation> relations

    ItemVehicleData vehicleData

	static hasMany = [inspectionsVehicle: InspectionVehicle, vehicleDataList: ItemVehicleData, relations: ItemRelation]

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
		relations fetch: 'join'
	}

	enum Type {

		TEXT,
		SELECT,
		TEXT_AREA

	}

}

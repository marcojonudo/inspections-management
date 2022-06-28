package inspections.management.domains.items

import com.fasterxml.jackson.annotation.JsonIgnore
import grails.gorm.annotation.Entity
import inspections.management.domains.InspectionVehicle
import inspections.management.domains.ItemCategory
import inspections.management.domains.savedItems.SelectSavedItemData
import inspections.management.domains.savedItems.TextAreaSavedItemData
import inspections.management.domains.savedItems.TextSavedItemData
import org.grails.datastore.gorm.GormEntity

@Entity
class Item implements GormEntity<Item> {

	Type type
	String code
	String name
	String shortName
	Integer order
	Integer printOrder
	ItemCategory category
	HeaderCard header
	boolean picture
	boolean print
	boolean required

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
		shortName nullable: true
		order nullable: true
		printOrder nullable: true
		category nullable: true
		header nullable: true
	}

	static mapping = {
		tablePerHierarchy false

		vehicleDataList fetch: 'join'
		category lazy: false
	}

	enum Type {

		TEXT(TextItem, TextSavedItemData),
		SELECT(SelectItem, SelectSavedItemData),
		TEXT_AREA(TextAreaItem, TextAreaSavedItemData)

		Class clazz
		Class savedItemDataClazz

		Type(Class clazz, Class savedItemDataClazz) {
			this.clazz = clazz
			this.savedItemDataClazz = savedItemDataClazz
		}

	}

	enum HeaderCard {

		INFO,
		CENTRE,
		VEHICLE

	}

}

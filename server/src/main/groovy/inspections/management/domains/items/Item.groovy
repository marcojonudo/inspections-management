package inspections.management.domains.items

import com.fasterxml.jackson.annotation.JsonIgnore
import grails.gorm.annotation.Entity
import inspections.management.domains.InspectionVehicle
import inspections.management.domains.ItemCategory
import inspections.management.domains.savedItems.SavedItem
import inspections.management.domains.savedItems.SelectSavedItem
import inspections.management.domains.savedItems.TextAreaSavedItem
import inspections.management.domains.savedItems.TextSavedItem
import inspections.management.services.data.SavedItemDataService
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
	boolean required
	HeaderCard header
	boolean picture
	boolean print

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

		TEXT(
			TextItem,
			TextSavedItem,
			{ TextSavedItem existent, TextSavedItem savedItem, SavedItemDataService savedItemDataService ->
				return savedItemDataService.textSavedItemDataService.update(existent, savedItem.fields)
			}
		),
		SELECT(
			SelectItem,
			SelectSavedItem,
			{ SelectSavedItem existent, SelectSavedItem savedItem, SavedItemDataService savedItemDataService ->
				return savedItemDataService.selectSavedItemDataService.update(existent.id, savedItem.value)
			}
		),
		TEXT_AREA(
			TextAreaItem,
			TextAreaSavedItem,
			{ TextAreaSavedItem existent, TextAreaSavedItem savedItem, SavedItemDataService savedItemDataService ->
				return savedItemDataService.textAreaSavedItemDataService.update(existent.id, savedItem.text)
			}
		)

		Class clazz
		Class savedItemClazz
		Closure<SavedItem> updateSavedItem

		Type(Class clazz, Class savedItemClazz, Closure<SavedItem> updateSavedItem) {
			this.clazz = clazz
			this.savedItemClazz = savedItemClazz
			this.updateSavedItem = updateSavedItem
		}

	}

	enum HeaderCard {

		INFO,
		CENTRE,
		VEHICLE

	}

}

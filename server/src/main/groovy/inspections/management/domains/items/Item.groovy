package inspections.management.domains.items

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonInclude
import grails.gorm.annotation.Entity
import inspections.management.domains.InspectionVehicle
import inspections.management.domains.ItemCategory
import inspections.management.domains.ItemRelation
import inspections.management.domains.savedItems.SavedItem
import inspections.management.domains.savedItems.SelectSavedItem
import inspections.management.domains.savedItems.TextAreaSavedItem
import inspections.management.domains.savedItems.TextSavedItem
import inspections.management.services.data.SavedItemDataService
import inspections.management.utils.Builder
import org.grails.datastore.gorm.GormEntity

@Entity
class Item implements GormEntity<Item> {

	Type type
	String code
	Integer order
	Integer printOrder
	ItemCategory category
	HeaderCard header
	boolean required

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
		order nullable: true
		printOrder nullable: true
		category nullable: true
		header nullable: true
	}

	static mapping = {
		tablePerHierarchy false

		vehicleDataList fetch: 'join'
		category lazy: false
		relations fetch: 'join'
	}

	enum Type {

		TEXT({ Map<String, Object> item ->
			return Builder.buildTextSavedItem(item)
		}, { TextSavedItem existent, TextSavedItem savedItem, SavedItemDataService savedItemDataService ->
			return savedItemDataService.textSavedItemDataService.update(existent, savedItem.fields)
		}),
		SELECT({ Map<String, Object> item ->
			return Builder.buildSelectSavedItem(item)
		}, { SelectSavedItem existent, SelectSavedItem savedItem, SavedItemDataService savedItemDataService ->
			return savedItemDataService.selectSavedItemDataService.update(existent.id, savedItem.value)
		}),
		TEXT_AREA({ Map<String, Object> item ->
			return Builder.buildTextAreaSavedItem(item)
		}, { TextAreaSavedItem existent, TextAreaSavedItem savedItem, SavedItemDataService savedItemDataService ->
			return savedItemDataService.textAreaSavedItemDataService.update(existent.id, savedItem.text)
		})

		Closure<SavedItem> buildSavedItem
		Closure<SavedItem> updateSavedItem

		Type(Closure<SavedItem> buildSavedItem, Closure<SavedItem> updateSavedItem) {
			this.buildSavedItem = buildSavedItem
			this.updateSavedItem = updateSavedItem
		}

	}

	enum HeaderCard {

		INFO,
		CENTRE,
		VEHICLE

	}

}

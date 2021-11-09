package inspections.management.domains.items

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonInclude
import grails.gorm.annotation.Entity
import inspections.management.domains.InspectionVehicle
import inspections.management.domains.ItemCategory
import inspections.management.domains.ItemRelation
import inspections.management.domains.savedItems.SavedItem
import inspections.management.domains.savedItems.SelectSavedItem
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
		}, { Serializable id, TextSavedItem savedItem, SavedItemDataService savedItemDataService ->
			return savedItemDataService.textSavedItemDataService.update(id, savedItem.text)
		}),
		SELECT({ Map<String, Object> item ->
			return Builder.buildSelectSavedItem(item)
		}, { Serializable id, SelectSavedItem savedItem, SavedItemDataService savedItemDataService ->
			return savedItemDataService.selectSavedItemDataService.update(id, savedItem.value)
		}),
		TEXT_AREA({ Map<String, Object> item ->
			return Builder.buildTextSavedItem(item)
		}, { Serializable id, TextSavedItem savedItem, SavedItemDataService savedItemDataService ->
			return savedItemDataService.textSavedItemDataService.update(id, savedItem.text)
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

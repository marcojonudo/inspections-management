package inspections.management.domains.items

import com.fasterxml.jackson.annotation.JsonIgnore
import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class ItemVehicleData implements GormEntity<ItemVehicleData> {

	@JsonIgnore
	Item item

	String vehicle

	static belongsTo = Item

}

package inspections.management.domains.savedItems

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import grails.gorm.annotation.Entity
import inspections.management.deserializers.SavedItemDeserializer
import inspections.management.domains.Image
import inspections.management.domains.SavedInspection
import inspections.management.domains.items.Item
import inspections.management.utils.Constants
import org.grails.datastore.gorm.GormEntity

import java.time.LocalDateTime

@Entity
@JsonDeserialize(using = SavedItemDeserializer)
abstract class SavedItem implements GormEntity<SavedItem> {

	@JsonIgnore
	SavedInspection savedInspection

	Item item
	String employeeCode
	String sellerCode
	boolean hidden
	Image image
	boolean restrictive

	@JsonFormat(pattern = Constants.DateTimeFormat.yyyy_MM_dd_HH_mm_ss, timezone = Constants.SPAIN_TIMEZONE)
	LocalDateTime filled

	static belongsTo = SavedInspection

	static constraints = {
		filled nullable: true
		image nullable: true
		sellerCode nullable: true
	}

	static mapping = {
		tablePerHierarchy false
		item fetch: 'join'
		image fetch: 'join'
	}

	abstract boolean equals(SavedItem savedItem)

	boolean equalsSaveItem(SavedItem savedItem) {
		return hidden == savedItem.hidden
	}

}

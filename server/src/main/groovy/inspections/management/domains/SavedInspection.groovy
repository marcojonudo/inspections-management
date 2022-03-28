package inspections.management.domains

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer
import grails.gorm.annotation.Entity
import inspections.management.deserializers.SavedItemsDeserializer
import inspections.management.domains.savedItems.SavedItem
import inspections.management.utils.Constants
import org.grails.datastore.gorm.GormEntity

import java.time.LocalDateTime

@Entity
class SavedInspection implements GormEntity<SavedInspection> {

	String inspectionTypeCode
	int orderNumber
	String vehicle
	String employeeCode
	String numberPlate
	String sellerCode
	State state
	boolean orderInspection

	@JsonFormat(pattern = Constants.DateTimeFormat.yyyy_MM_dd_HH_mm_ss, timezone = Constants.SPAIN_TIMEZONE)
	LocalDateTime saved

	@JsonFormat(pattern = Constants.DateTimeFormat.yyyy_MM_dd_HH_mm_ss, timezone = Constants.SPAIN_TIMEZONE)
	@JsonSerialize(using = LocalDateTimeSerializer)
	LocalDateTime sent

	@JsonDeserialize(using = SavedItemsDeserializer)
	Set<SavedItem> items

	static hasMany = [items: SavedItem]

	static mapping = {
		items fetch: 'join'
	}

	static constraints = {
		sent nullable: true
	}

	enum State {

		PENDING({ Set<SavedItem> items -> false }),
		STARTED({ Set<SavedItem> items -> items.find { it.item.required && !it.filled } as boolean }),
		FINISHED({ Set<SavedItem> items -> !items.find { it.item.required && !it.filled } as boolean })

		final Closure<Boolean> check

		State(Closure<Boolean> check) {
			this.check = check;
		}

	}

}

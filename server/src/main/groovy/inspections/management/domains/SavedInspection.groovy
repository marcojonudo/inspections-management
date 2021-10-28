package inspections.management.domains

import com.fasterxml.jackson.annotation.JsonFormat
import grails.gorm.annotation.Entity
import inspections.management.domains.savedItems.SavedItem
import inspections.management.utils.Constants
import org.grails.datastore.gorm.GormEntity

import java.time.LocalDateTime

@Entity
class SavedInspection implements GormEntity<SavedInspection> {

	int orderNumber
	String employeeCode
	State state
	boolean orderInspection

	@JsonFormat(pattern = Constants.DateTimeFormat.yyyy_MM_dd_HH_mm_ss, timezone = Constants.SPAIN_TIMEZONE)
	LocalDateTime saved

	static hasMany = [items: SavedItem]

	static constraints = {
		name maxSize: 45
	}

	static mapping = {
		items fetch: 'join'
	}

	enum State {

		PENDING,
		STARTED,
		FINISHED

	}

}

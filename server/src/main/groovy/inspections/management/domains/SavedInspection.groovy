package inspections.management.domains

import com.fasterxml.jackson.annotation.JsonInclude
import grails.gorm.annotation.Entity
import inspections.management.domains.items.Item
import inspections.management.domains.savedItems.SavedItem
import inspections.management.utils.Utils
import org.grails.datastore.gorm.GormEntity

import java.time.LocalDateTime

@Entity
class SavedInspection implements GormEntity<SavedInspection> {

	String inspectionTypeCode
	Integer orderNumber
	String vehicle
	String numberPlate
	State state
	boolean orderInspection

	@JsonInclude
	List<SavedItem> items

	static hasMany = [data: SavedInspectionData]

	static mapping = {
		data fetch: 'join'
	}

	static transients = ['items']

	enum State {

		PENDING({ List<SavedItem> savedItems, List<Item> items -> false }),
		STARTED({ List<SavedItem> savedItems, List<Item> items ->
			savedItems.find { Utils.findItem(it.code, items).required && !it.data } as boolean
		}),
		FINISHED({ List<SavedItem> savedItems, List<Item> items ->
			!savedItems.find { Utils.findItem(it.code, items).required && !it.data } as boolean
		})
		final Closure<Boolean> check

		State(Closure<Boolean> check) {
			this.check = check;
		}

	}

	SavedInspectionData findData() {
		return data.max { it.saved }
	}

	LocalDateTime findSaved() {
		return findData().saved
	}

	String findEmployeeCode() {
		return findData().employeeCode
	}

}

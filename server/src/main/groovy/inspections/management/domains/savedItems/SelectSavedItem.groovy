package inspections.management.domains.savedItems

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
class SelectSavedItem extends SavedItem implements GormEntity<SelectSavedItem> {

	String value

	boolean equals(SavedItem savedItem) {
		return equalsSaveItem(savedItem) && value == ((SelectSavedItem) savedItem).value
	}

}

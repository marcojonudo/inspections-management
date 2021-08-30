package inspections.management.domains.savedItems


import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class SelectSavedItem extends SavedItem implements GormEntity<SelectSavedItem> {

	String value

	boolean equals(SavedItem savedItem) {
		return equalsSaveItem(savedItem) && value == ((SelectSavedItem) savedItem).value
	}

}

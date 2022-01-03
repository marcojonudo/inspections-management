package inspections.management.domains.savedItems


import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class TextAreaSavedItem extends SavedItem implements GormEntity<TextAreaSavedItem> {

	String text

	static constraints = {
		text nullable: true
	}

	boolean equals(SavedItem savedItem) {
		return equalsSaveItem(savedItem) && text == ((TextAreaSavedItem) savedItem).text
	}

}

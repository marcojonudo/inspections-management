package inspections.management.domains.savedItems


import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class TextSavedItem extends SavedItem implements GormEntity<TextSavedItem> {

	String text

	static constraints = {
		text nullable: true
	}

	boolean equals(SavedItem savedItem) {
		return equalsSaveItem(savedItem) && text == ((TextSavedItem) savedItem).text
	}

}

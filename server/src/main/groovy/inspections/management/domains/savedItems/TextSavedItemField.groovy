package inspections.management.domains.savedItems

import com.fasterxml.jackson.annotation.JsonIgnore
import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class TextSavedItemField implements GormEntity<TextSavedItemField> {

	@JsonIgnore
	TextSavedItem textSavedItem

	String text
	int order

	static mapping = {
		order column: '`order`'
	}

	static constraints = {
		text nullable: true
	}

	boolean equals(TextSavedItemField textSavedItemField) {
		return text == textSavedItemField.text
	}

}

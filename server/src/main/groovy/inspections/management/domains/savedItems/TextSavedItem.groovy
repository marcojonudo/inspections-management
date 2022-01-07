package inspections.management.domains.savedItems

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
class TextSavedItem extends SavedItem implements GormEntity<TextSavedItem> {

	static hasMany = [fields: TextSavedItemField]

	static mapping = {
		fields fetch: 'join'
	}

	boolean equals(SavedItem savedItem) {
		if (!equalsSaveItem(savedItem)) {
			return false
		}
		TextSavedItem textSavedItem = (TextSavedItem) savedItem
		if (fields.size() != textSavedItem.fields.size()) {
			return false;
		}
		TextSavedItemField differentField = fields.find { TextSavedItemField field ->
			field.text != textSavedItem.fields.find { it.order == field.order }.text
		}
		return !differentField
	}

}

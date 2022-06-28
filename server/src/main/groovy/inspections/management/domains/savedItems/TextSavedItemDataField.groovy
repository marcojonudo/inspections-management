package inspections.management.domains.savedItems

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
class TextSavedItemDataField implements GormEntity<TextSavedItemDataField> {

	@JsonIgnore
	TextSavedItemData textSavedItemData

	String text
	int order

	static mapping = {
		order column: '`order`'
	}

	static constraints = {
		text nullable: true
	}

}

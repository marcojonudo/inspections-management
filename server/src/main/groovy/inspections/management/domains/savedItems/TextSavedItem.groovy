package inspections.management.domains.savedItems

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import grails.gorm.annotation.Entity
import inspections.management.domains.items.TextItem
import inspections.management.domains.items.TextItemField
import inspections.management.pogos.pdf.inspection.items.PdfTextItem
import inspections.management.pogos.pdf.structure.elements.items.PdfItem
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

	String findValue() {
		Set<TextItemField> itemFields = ((TextItem) item).fields
		return fields.sort { it.order }.collect { TextSavedItemField savedField ->
			TextItemField itemField = itemFields.find { it.order == savedField.order }
			return "${itemField.prefix ?: ''}$savedField.text${itemField.separator ?: ''}"
		}.join("")
	}

	String findUnit() {
		return findValue() ? ((TextItem) this.item).unit ?: "" : ""
	}

	PdfItem buildPdfItem() {
		return new PdfTextItem(this)
	}

}

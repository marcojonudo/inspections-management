package inspections.management.domains.savedItems

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import grails.gorm.annotation.Entity
import inspections.management.domains.items.SelectItemOption
import inspections.management.domains.items.TextItem
import inspections.management.domains.items.TextItemField
import inspections.management.pogos.pdf.inspection.items.PdfTextItem
import inspections.management.pogos.pdf.structure.elements.PdfItem
import org.grails.datastore.gorm.GormEntity

@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
class TextSavedItemData extends SavedItemData implements GormEntity<TextSavedItemData> {

	static hasMany = [fields: TextSavedItemDataField]

	static mapping = {
		fields fetch: 'join'
	}

	String findValue() {
		Set<TextItemField> itemFields = ((TextItem) savedItem.item).fields
		return fields.sort { it.order }.collect { TextSavedItemDataField savedField ->
			TextItemField itemField = itemFields.find { it.order == savedField.order }
			return savedField.text ? "${itemField.prefix ?: ''}$savedField.text${itemField.separator ?: ''}" : ''
		}.join("")
	}

	String findUnit(TextItem item) {
		return findValue() ? item.unit ?: "" : ""
	}

	SavedItemData fill(SavedItem savedItem) {
		fields.each { it.textSavedItemData = this }
		return fillSavedItem(savedItem)
	}

	PdfItem buildPdfItem(SavedItem savedItem, List<SelectItemOption> options) {
		return new PdfTextItem(savedItem)
	}

}

package inspections.management.domains.savedItems

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import grails.gorm.annotation.Entity
import inspections.management.domains.items.SelectItemOption
import inspections.management.pogos.pdf.inspection.items.PdfTextAreaItem
import inspections.management.pogos.pdf.structure.elements.PdfItem
import org.grails.datastore.gorm.GormEntity

@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
class TextAreaSavedItemData extends SavedItemData implements GormEntity<TextAreaSavedItemData> {

	String text

	static constraints = {
		text nullable: true
	}

	SavedItemData fill(SavedItem savedItem) {
		return fillSavedItem(savedItem)
	}

	String findValue() {
		return text
	}

	PdfItem buildPdfItem(SavedItem savedItem, List<SelectItemOption> options) {
		return new PdfTextAreaItem(savedItem)
	}

}

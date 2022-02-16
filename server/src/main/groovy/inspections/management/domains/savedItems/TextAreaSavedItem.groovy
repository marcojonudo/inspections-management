package inspections.management.domains.savedItems

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import grails.gorm.annotation.Entity
import inspections.management.pogos.pdf.inspection.items.PdfTextAreaItem
import inspections.management.pogos.pdf.structure.elements.PdfItem
import org.grails.datastore.gorm.GormEntity

@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
class TextAreaSavedItem extends SavedItem implements GormEntity<TextAreaSavedItem> {

	String text

	static constraints = {
		text nullable: true
	}

	boolean equals(SavedItem savedItem) {
		return equalsSaveItem(savedItem) && text == ((TextAreaSavedItem) savedItem).text
	}

	String findValue() {
		return text
	}

	PdfItem buildPdfItem() {
		return new PdfTextAreaItem(this)
	}

}

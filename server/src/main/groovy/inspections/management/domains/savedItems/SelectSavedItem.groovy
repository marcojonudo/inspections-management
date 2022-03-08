package inspections.management.domains.savedItems

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import grails.gorm.annotation.Entity
import inspections.management.domains.items.SelectItem
import inspections.management.pogos.pdf.inspection.items.PdfSelectItem
import inspections.management.pogos.pdf.structure.elements.PdfItem
import org.grails.datastore.gorm.GormEntity

@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
class SelectSavedItem extends SavedItem implements GormEntity<SelectSavedItem> {

	String value

	boolean equals(SavedItem savedItem) {
		return equalsSaveItem(savedItem) && value == ((SelectSavedItem) savedItem).value
	}

	String findValue() {
		return value
	}

	String findPrintIcon() {
		return ((SelectItem) this.item).options.find { it.code == this.value }.printIcon
	}

	String findIcon() {
		return ((SelectItem) this.item).options.find { it.code == this.value }.icon
	}

	enum Value {

		P('#7b7979'),
		C('#36d23d'),
		PS('#ff6a00'),
		SN('#d23636'),
		RA('#3681d2'),
		RR('#3681d2')

		final String color

		Value(String color) {
			this.color = color
		}

	}

	PdfItem buildPdfItem() {
		return new PdfSelectItem(this)
	}

}

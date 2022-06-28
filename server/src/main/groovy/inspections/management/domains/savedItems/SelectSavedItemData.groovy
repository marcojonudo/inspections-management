package inspections.management.domains.savedItems

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import grails.gorm.annotation.Entity
import inspections.management.domains.items.SelectItemOption
import inspections.management.pogos.pdf.inspection.items.PdfSelectItem
import inspections.management.pogos.pdf.structure.elements.PdfItem
import org.grails.datastore.gorm.GormEntity

@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
class SelectSavedItemData extends SavedItemData implements GormEntity<SelectSavedItemData> {

	String value

	SavedItemData fill(SavedItem savedItem) {
		return fillSavedItem(savedItem)
	}

	String findValue() {
		return value
	}

	String findPrintIcon(List<SelectItemOption> options) {
		return options.find { it.code == this.value }.printIcon
	}

	String findIcon(List<SelectItemOption> options) {
		return options.find { it.code == this.value }.icon
	}

	PdfItem buildPdfItem(SavedItem savedItem, List<SelectItemOption> options) {
		return new PdfSelectItem(savedItem, options)
	}

	enum Value {

		P('#7b7979'),
		C('#36d23d'),
		PS('#ff6a00'),
		SN('#d23636'),
		RA('#3681d2'),
		RR('#3681d2'),
		NA('#000')

		final String color

		Value(String color) {
			this.color = color
		}

	}

}

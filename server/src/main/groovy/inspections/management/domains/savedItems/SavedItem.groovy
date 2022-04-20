package inspections.management.domains.savedItems

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer
import grails.gorm.annotation.Entity
import inspections.management.domains.Image
import inspections.management.domains.SavedInspection
import inspections.management.domains.items.Item
import inspections.management.domains.items.SelectItemOption
import inspections.management.pogos.pdf.structure.elements.PdfItem
import inspections.management.utils.Constants
import org.grails.datastore.gorm.GormEntity

import java.time.LocalDateTime

@Entity
abstract class SavedItem implements GormEntity<SavedItem> {

	long savedInspectionId

	Item.Type type
	String code
	String employeeCode
	String sellerCode
	boolean hidden
	Long imageId
	boolean restrictive

	@JsonFormat(pattern = Constants.DateTimeFormat.yyyy_MM_dd_HH_mm_ss, timezone = Constants.SPAIN_TIMEZONE)
	@JsonDeserialize(using = LocalDateTimeDeserializer)
	LocalDateTime filled

	@JsonIgnore
	Item item
	Image image

	static belongsTo = SavedInspection

	static constraints = {
		filled nullable: true
		imageId nullable: true
		sellerCode nullable: true
	}

	static mapping = {
		tablePerHierarchy false
	}

	static transients = ['item', 'image']

	abstract boolean equals(SavedItem savedItem)

	abstract String findValue()

	abstract PdfItem buildPdfItem(List<SelectItemOption> options)

	boolean equalsSaveItem(SavedItem savedItem) {
		return hidden == savedItem.hidden
	}

}

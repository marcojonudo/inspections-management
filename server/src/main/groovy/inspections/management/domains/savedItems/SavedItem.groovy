package inspections.management.domains.savedItems


import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import grails.gorm.annotation.Entity
import groovy.transform.TupleConstructor
import inspections.management.deserializers.SavedItemDeserializer
import inspections.management.domains.Image
import inspections.management.domains.SavedInspection
import inspections.management.domains.items.Item
import inspections.management.domains.items.SelectItemOption
import inspections.management.pogos.pdf.structure.elements.PdfItem
import org.grails.datastore.gorm.GormEntity

@Entity
@JsonDeserialize(using = SavedItemDeserializer)
@TupleConstructor
class SavedItem implements GormEntity<SavedItem> {

	Item.Type type
	String code
	Set<SavedItemData> data
	Long savedInspectionId

	Image image

	Item item

	static belongsTo = SavedInspection

	static hasMany = [data: SavedItemData]

	static mapping = {
		data fetch: 'join'
	}

	static transients = ['image', 'item']

	SavedItemData findData() {
		return data.max { it.saved }
	}

	String findValue() {
		return findData().findValue()
	}

	Long findImageId() {
		return findData().imageId
	}

	boolean findHidden() {
		return findData().hidden
	}

	PdfItem buildPdfItem(List<SelectItemOption> options) {
		return findData().buildPdfItem(this, options)
	}

}

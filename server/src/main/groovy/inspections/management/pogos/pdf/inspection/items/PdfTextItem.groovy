package inspections.management.pogos.pdf.inspection.items

import groovy.transform.CompileStatic
import inspections.management.domains.savedItems.TextSavedItem
import inspections.management.pogos.pdf.structure.elements.items.PdfItem

@CompileStatic
class PdfTextItem extends PdfItem {

    String value
    String unit
    boolean multipleFields

    PdfTextItem(TextSavedItem savedItem) {
        super(savedItem.item, savedItem.fields.size() > 2)
        value = savedItem.findValue()
        unit = savedItem.findUnit()
    }

    String toHtml() {
        return """
            <div class="${findClasses()}">
                ${super.toHtml()}
                <span class="item-text-value">$value</span>
                <span class="item-unit">$unit</span>
            </div>   
        """
    }

}

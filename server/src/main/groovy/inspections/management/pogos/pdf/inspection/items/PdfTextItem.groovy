package inspections.management.pogos.pdf.inspection.items

import groovy.transform.CompileStatic
import inspections.management.domains.items.TextItem
import inspections.management.domains.savedItems.SavedItem
import inspections.management.domains.savedItems.TextSavedItemData
import inspections.management.pogos.pdf.structure.elements.PdfItem

@CompileStatic
class PdfTextItem extends PdfItem {

    String value
    String unit
    boolean multipleFields

    PdfTextItem(SavedItem savedItem) {
        super(savedItem.item, ((TextSavedItemData) savedItem.findData()).fields.size() > 2)
        value = savedItem.findValue()
        unit = ((TextSavedItemData) savedItem.findData()).findUnit((TextItem) savedItem.item)
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

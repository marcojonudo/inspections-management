package inspections.management.pogos.pdf.inspection.items

import groovy.transform.CompileStatic
import inspections.management.domains.savedItems.TextAreaSavedItem
import inspections.management.pogos.pdf.structure.elements.items.PdfItem

@CompileStatic
class PdfTextAreaItem extends PdfItem {

    String text

    PdfTextAreaItem(TextAreaSavedItem savedItem) {
        super(savedItem.item.name)
        text = savedItem.findValue()
    }

}

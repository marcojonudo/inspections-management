package inspections.management.pogos.pdf.inspection.items

import groovy.transform.CompileStatic
import inspections.management.domains.savedItems.SavedItem
import inspections.management.pogos.pdf.structure.elements.PdfItem

@CompileStatic
class PdfTextAreaItem extends PdfItem {

    String text

    PdfTextAreaItem(SavedItem savedItem) {
        super(savedItem.item)
        text = savedItem.findValue()
    }

}

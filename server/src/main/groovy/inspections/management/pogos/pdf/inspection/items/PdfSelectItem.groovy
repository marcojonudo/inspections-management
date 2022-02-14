package inspections.management.pogos.pdf.inspection.items

import groovy.transform.CompileStatic
import inspections.management.domains.savedItems.SelectSavedItem
import inspections.management.pogos.pdf.inspection.elements.ItemImage
import inspections.management.pogos.pdf.structure.elements.items.PdfItem

@CompileStatic
class PdfSelectItem extends PdfItem {

    ItemImage image

    PdfSelectItem(SelectSavedItem savedItem) {
        super(savedItem.item)
        image = new ItemImage("img/icons/${savedItem.findPrintIcon()}.svg", SelectSavedItem.Value.valueOf(savedItem.value).color)
        if (savedItem.value != SelectSavedItem.Value.C.toString()) {
            classes << "highlight"
        }
    }

    String toHtml() {
        return """
            <div class="${findClasses()}">
                ${super.toHtml()}
                ${image.toHtml()}
            </div>   
        """
    }

}

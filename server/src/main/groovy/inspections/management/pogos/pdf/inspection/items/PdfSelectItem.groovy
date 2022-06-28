package inspections.management.pogos.pdf.inspection.items

import groovy.transform.CompileStatic
import inspections.management.domains.items.SelectItemOption
import inspections.management.domains.savedItems.SavedItem
import inspections.management.domains.savedItems.SelectSavedItemData
import inspections.management.pogos.pdf.inspection.elements.ItemImage
import inspections.management.pogos.pdf.structure.elements.PdfItem

@CompileStatic
class PdfSelectItem extends PdfItem {

    ItemImage image

    PdfSelectItem(SavedItem savedItem, List<SelectItemOption> options) {
        super(savedItem.item)
        image = new ItemImage(
            "img/icons/${((SelectSavedItemData) savedItem.findData()).findPrintIcon(options)}.svg",
            SelectSavedItemData.Value.valueOf(savedItem.findValue()).color
        )
        if (savedItem.findValue() != SelectSavedItemData.Value.C.toString()) {
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

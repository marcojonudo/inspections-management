package inspections.management.pogos.pdf.inspection.items

import groovy.transform.CompileStatic
import inspections.management.domains.savedItems.SavedItem
import inspections.management.pogos.pdf.structure.elements.Image
import inspections.management.pogos.pdf.structure.elements.PdfItem
import inspections.management.services.PdfService

@CompileStatic
class PdfImageItem extends PdfItem {

    Image image
    boolean showTitle

    PdfImageItem(SavedItem savedItem, boolean showTitle = true) {
        super(savedItem.item)
        this.classes = ["image-item"]
        image = new Image([], null, PdfService.buildImageUrl(savedItem))
        this.showTitle = showTitle
    }

    String toHtml() {
        return """
            <div class="${findClasses()}">
                <div>
                    ${showTitle ? super.toHtml() : ""}
                    ${image.toHtml()}
                </div>
            </div>   
        """
    }

}

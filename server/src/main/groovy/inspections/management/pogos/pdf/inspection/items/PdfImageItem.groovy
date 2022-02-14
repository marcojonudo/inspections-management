package inspections.management.pogos.pdf.inspection.items

import groovy.transform.CompileStatic
import inspections.management.domains.savedItems.SavedItem
import inspections.management.pogos.pdf.structure.elements.Image
import inspections.management.pogos.pdf.structure.elements.items.PdfItem

@CompileStatic
class PdfImageItem extends PdfItem {

    Image image

    PdfImageItem(SavedItem savedItem) {
        super(savedItem.item)
        this.classes = ["image-item"]
        String base64Code = new String(Base64.encoder.encode(savedItem.image.image))
        image = new Image([], null, "data:image/png;base64,$base64Code")
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

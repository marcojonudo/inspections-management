package inspections.management.pogos.pdf.structure.cards

import groovy.transform.CompileStatic
import inspections.management.pogos.pdf.structure.elements.Title
import inspections.management.pogos.pdf.structure.elements.PdfItem
import inspections.management.utils.Constants

@CompileStatic
class ImagesCard extends Card {

    List<PdfItem> items

    ImagesCard(Title title, List<PdfItem> items) {
        super()
        this.title = title
        this.items = items
        this.classes.addAll(["category", "image-category"])
    }

    String toHtml() {
        return """
            <div class="${findClasses()}">
                ${title.toHtml()}
                <div class="card-content">
                    ${items.collate(Constants.ROW_IMAGES).collect { buildRow(it) }.join("\n")}
                </div>
            </div>
        """
    }

    static String buildRow(List<PdfItem> items) {
        return """
            <div class="images-row">
                ${items.collect { it.toHtml() }.join("\n")}
            </div>
        """
    }

}

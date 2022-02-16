package inspections.management.pogos.pdf.structure.cards

import groovy.transform.CompileStatic
import inspections.management.pogos.pdf.structure.elements.Title
import inspections.management.pogos.pdf.structure.elements.PdfItem

@CompileStatic
class RowsCard extends Card {

    List<PdfItem> items

    RowsCard(Title title, List<PdfItem> items) {
        super()
        this.title = title
        this.items = items
    }

    @Override
    String toHtml() {
        return """
            <div class="${findClasses()}">
                ${title.toHtml()}
                <div class="card-content">
                    ${items.collate(4).collect { buildRow(it) }.join("\n")}
                </div>
            </div>
        """
    }

    static String buildRow(List<PdfItem> items) {
        return """
            <div class="item-row">
                ${items.collect { it.toHtml() }.join("\n")}
            </div>
        """
    }

}

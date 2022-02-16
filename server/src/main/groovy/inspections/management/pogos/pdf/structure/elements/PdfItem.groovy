package inspections.management.pogos.pdf.structure.elements

import groovy.transform.CompileStatic
import inspections.management.domains.items.Item
import inspections.management.pogos.pdf.structure.IPdf

@CompileStatic
class PdfItem extends IPdf {

    String name
    boolean multipleFields

    PdfItem(Item item, boolean multipleFields = false) {
        this.classes = ["item"]
        this.name = item.shortName ?: item.name
        this.multipleFields = multipleFields
    }

    String toHtml() {
        return """
            <div class="item-text ${multipleFields ? 'multiple-fields' : ''}">$name</div>
        """
    }

}

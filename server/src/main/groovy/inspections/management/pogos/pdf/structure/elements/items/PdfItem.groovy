package inspections.management.pogos.pdf.structure.elements.items

import groovy.transform.CompileStatic
import inspections.management.pogos.pdf.structure.IPdf

@CompileStatic
class PdfItem extends IPdf {

    String name
    boolean multipleFields

    PdfItem(String name, boolean multipleFields = false) {
        this.classes = ["item"]
        this.name = name
        this.multipleFields = multipleFields
    }

    String toHtml() {
        return """
            <div class="item-text ${multipleFields ? 'multiple-fields' : ''}">$name</div>
        """
    }

}

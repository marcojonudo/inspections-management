package inspections.management.pogos.pdf.structure.elements.items

import groovy.transform.CompileStatic
import groovy.transform.TupleConstructor
import inspections.management.pogos.pdf.structure.IPdf

@CompileStatic
@TupleConstructor
class PdfItem extends IPdf {

    String name

    PdfItem(String name) {
        this.classes = ["item"]
        this.name = name
    }

    String toHtml() {
        return """
            <div class="item-text">$name</div>
        """
    }

}

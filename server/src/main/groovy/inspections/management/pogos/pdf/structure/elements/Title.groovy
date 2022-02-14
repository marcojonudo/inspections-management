package inspections.management.pogos.pdf.structure.elements

import groovy.transform.CompileStatic
import groovy.transform.TupleConstructor
import inspections.management.pogos.pdf.structure.IPdf

@CompileStatic
@TupleConstructor(includeSuperProperties = true)
class Title extends IPdf {

    Image image
    String text

    String toHtml() {
        return """
            <div id="$id" class="${findClasses()}">
                ${image.toHtml()}
                <div>$text</div>
            </div>
        """
    }

}

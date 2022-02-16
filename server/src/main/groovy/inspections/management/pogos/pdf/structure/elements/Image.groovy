package inspections.management.pogos.pdf.structure.elements

import groovy.transform.CompileStatic
import groovy.transform.TupleConstructor
import inspections.management.pogos.pdf.structure.IPdf

@CompileStatic
@TupleConstructor(includeSuperProperties = true)
class Image extends IPdf {

    String src

    String toHtml() {
        return """
            <img id="$id" src="$src" class="${findClasses()}">
        """
    }

}

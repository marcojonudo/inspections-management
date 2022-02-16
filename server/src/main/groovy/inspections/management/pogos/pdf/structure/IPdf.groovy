package inspections.management.pogos.pdf.structure

import groovy.transform.CompileStatic
import groovy.transform.TupleConstructor

@CompileStatic
@TupleConstructor
abstract class IPdf {

    List<String> classes
    String id

    abstract String toHtml()

    String findClasses() {
        return classes.join(" ")
    }

}

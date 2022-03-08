package inspections.management.pogos.pdf.structure.cards

import groovy.transform.CompileStatic
import inspections.management.pogos.pdf.structure.IPdf
import inspections.management.pogos.pdf.structure.elements.Title

@CompileStatic
abstract class Card extends IPdf {

    Title title

    Card() {
        classes = ["card"]
    }

}

package inspections.management.pogos.pdf.inspection.cards.title

import groovy.transform.CompileStatic
import inspections.management.pogos.pdf.structure.elements.Image
import inspections.management.pogos.pdf.structure.elements.Title

@CompileStatic
class CardTitle extends Title {

    CardTitle(String imageSrc, String text) {
        super(["card-title"], null, new Image(["icon"], null, imageSrc), text)
    }

}

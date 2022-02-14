package inspections.management.pogos.pdf.inspection.header

import groovy.transform.CompileStatic
import inspections.management.pogos.pdf.structure.elements.Title

@CompileStatic
class PdfHeaderTitle extends Title {

    PdfHeaderTitle(String imageSrc, String text) {
//        super(new Image([], "logo", imageSrc), text)
        id = "title"
    }

    String toHtml() {
        return """
            <div class="${findClasses()}">
                ${image.toHtml()}
                <div>$text</div>
            </div>
        """
    }

}

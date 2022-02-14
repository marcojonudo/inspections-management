package inspections.management.pogos.pdf.structure.elements

import groovy.transform.CompileStatic
import inspections.management.pogos.pdf.structure.IPdf

@CompileStatic
class Label extends IPdf {

    String name
    String color

    Label(String name, String color) {
        this.classes = ["label"]
        this.name = name
        this.color = color
    }

    String toHtml() {
        return """
            <div class="${findClasses()}">
                <div class="label-color" style="background-color: $color"></div>
                <span>$name</span>
            </div>
        """
    }

}

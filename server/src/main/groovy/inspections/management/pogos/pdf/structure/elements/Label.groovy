package inspections.management.pogos.pdf.structure.elements

import groovy.transform.CompileStatic
import inspections.management.pogos.pdf.structure.IPdf

@CompileStatic
class Label extends IPdf {

    String name
    String color
    int width

    Label(String name, String color, int width) {
        this.classes = ["label"]
        this.name = name
        this.color = color
        this.width = width
    }

    String toHtml() {
        return """
            <div class="${findClasses()}" style="width: $width%">
                <div class="label-color" style="background-color: $color"></div>
                <span>$name</span>
            </div>
        """
    }

}

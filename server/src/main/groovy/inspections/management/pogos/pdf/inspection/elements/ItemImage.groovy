package inspections.management.pogos.pdf.inspection.elements

import groovy.transform.CompileStatic
import inspections.management.pogos.pdf.structure.elements.Image

@CompileStatic
class ItemImage extends Image {

    String color

    ItemImage(String src, String color) {
        this.classes = ["item-icon"]
        this.src = src
        this.color = color
    }

    @Override
    String toHtml() {
        return """
            <div class="item-icon-container">
                <img src="$src" class="${findClasses()}" style="color: $color">
            </div>
        """
    }

}

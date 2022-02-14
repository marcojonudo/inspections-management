package inspections.management.pogos.pdf.structure.cards

import groovy.transform.CompileStatic
import inspections.management.pogos.pdf.structure.elements.Title

@CompileStatic
class ItemCard extends Card {

    String text

    ItemCard(Title title, String text) {
        this.title = title
        this.text = text
    }

    String toHtml() {
        return """
            <div class="${findClasses()}">
                ${title.toHtml()}
                <div class="card-content">
                    $text
                </div>
            </div>
        """
    }

}

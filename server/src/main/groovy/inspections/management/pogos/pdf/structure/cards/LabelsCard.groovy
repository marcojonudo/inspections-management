package inspections.management.pogos.pdf.structure.cards

import groovy.transform.CompileStatic
import inspections.management.pogos.pdf.structure.elements.Label

@CompileStatic
class LabelsCard extends Card {

    List<Label> labels

    String toHtml() {
        List<String> labels = this.labels.collect { it.toHtml() }
        return """
            <div id="$id" class="${findClasses()}">
                <div class="card-content">
                    ${labels.join("\n")}
                </div>
            </div>
        """
    }

}

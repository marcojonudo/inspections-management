package inspections.management.pogos.pdf.structure.cards

import groovy.transform.CompileStatic
import inspections.management.pogos.pdf.structure.elements.KeyValueSection

@CompileStatic
class KeyValueCard extends Card {

    List<KeyValueSection> sections

    String toHtml() {
        List<String> sections = this.sections.collect { it.toHtml() }
        return """
            <div id="$id" class="${findClasses()}">
                ${title.toHtml()}
                <div class="card-content">
                    ${sections.join("\n")}
                </div>
            </div>
        """
    }

}

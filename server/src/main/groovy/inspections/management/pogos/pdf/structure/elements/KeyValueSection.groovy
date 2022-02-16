package inspections.management.pogos.pdf.structure.elements

import groovy.transform.CompileStatic
import inspections.management.pogos.pdf.structure.IPdf

@CompileStatic
class KeyValueSection extends IPdf {

    String key
    String value

    KeyValueSection(String key, String value) {
        classes = ["key-value-section"]
        this.key = key
        this.value = value
    }

    String toHtml() {
        return """
            <div class="${findClasses()}">
                <div>$key</div>
                <div>$value</div>
            </div>
        """
    }

}

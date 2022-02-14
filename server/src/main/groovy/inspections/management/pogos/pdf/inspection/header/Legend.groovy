package inspections.management.pogos.pdf.inspection.header

import groovy.transform.CompileStatic
import inspections.management.pogos.pdf.structure.IPdf
import inspections.management.pogos.pdf.structure.elements.Label

@CompileStatic
class Legend extends IPdf {

    List<Label> labels

    Legend() {
        this.id = "legend"
        this.labels = [
            new Label("Selección pendiente", "#7b7979"),
            new Label("Correcto", "#36d23d"),
            new Label("Planificar sustitución", "#ff6a00"),
            new Label("Sustitución necesaria", "#d23636"),
            new Label("Realizado ajuste/cambio", "#3681d2")
        ]
    }

    String toHtml() {
        return """
            <div id="$id">
                ${labels.collect { it.toHtml() }.join("\n")}
            </div>
        """
    }

}

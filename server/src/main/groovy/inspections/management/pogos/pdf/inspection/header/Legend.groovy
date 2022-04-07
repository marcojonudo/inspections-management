package inspections.management.pogos.pdf.inspection.header

import groovy.transform.CompileStatic
import inspections.management.i18n.CustomMessageSource
import inspections.management.pogos.pdf.structure.IPdf
import inspections.management.pogos.pdf.structure.elements.Label

@CompileStatic
class Legend extends IPdf {

    List<Label> labels

    Legend() {
        this.id = "legend"
        this.labels = [
            new Label(
                CustomMessageSource.getMessage("print.labels.pendingSelection"),
                "#7b7979",
                CustomMessageSource.getMessage("print.labels.pendingSelection.width") as Integer
            ),
            new Label(
                CustomMessageSource.getMessage("print.labels.correct"),
                "#36d23d",
                CustomMessageSource.getMessage("print.labels.correct.width") as Integer
            ),
            new Label(
                CustomMessageSource.getMessage("print.labels.plannedReplacement"),
                "#ff6a00",
                CustomMessageSource.getMessage("print.labels.plannedReplacement.width") as Integer
            ),
            new Label(
                CustomMessageSource.getMessage("print.labels.neededReplacement"),
                "#d23636",
                CustomMessageSource.getMessage("print.labels.neededReplacement.width") as Integer
            ),
            new Label(
                CustomMessageSource.getMessage("print.labels.doneReplacement"),
                "#3681d2",
                CustomMessageSource.getMessage("print.labels.doneReplacement.width") as Integer
            )
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

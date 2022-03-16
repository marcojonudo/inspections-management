package inspections.management.pogos.pdf.inspection.pages

import groovy.transform.CompileStatic
import inspections.management.domains.fviberi.Order
import inspections.management.pogos.pdf.inspection.header.PdfHeader
import inspections.management.pogos.pdf.structure.IPdf
import inspections.management.pogos.pdf.structure.cards.Card

@CompileStatic
class PdfInspectionPage extends IPdf {

    PdfHeader header
    List<Card> categories
    Order.VehicleType vehicleType
    boolean printHeader
    boolean tyrePage

    PdfInspectionPage(PdfHeader header, Order.VehicleType vehicleType) {
        this.classes = ["page"]
        this.header = header
        this.vehicleType = vehicleType
        this.printHeader = true
        this.tyrePage = false
    }

    String toHtml() {
        return """
            <div class="${findClasses()}">
                ${tyrePage ? '' : "<img class=\"background-image\" src=\"img/backgrounds/${vehicleType.backgroundImage}\"/>"}
                <div class="content-wrapper">
                    ${printHeader ? header.toHtml() : ''}
                    <div class="categories-container">
                        ${categories.collect { it.toHtml() }.join("\n")}
                    </div>
                </div>
            </div>
        """
    }

}

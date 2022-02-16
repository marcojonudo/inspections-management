package inspections.management.pogos.pdf.inspection.header

import groovy.transform.CompileStatic
import inspections.management.domains.SavedInspection
import inspections.management.domains.fviberi.Centre
import inspections.management.domains.fviberi.Order
import inspections.management.domains.savedItems.SavedItem
import inspections.management.pogos.pdf.inspection.cards.CentreCard
import inspections.management.pogos.pdf.inspection.cards.InfoCard
import inspections.management.pogos.pdf.inspection.cards.VehicleCard
import inspections.management.pogos.pdf.structure.IPdf
import inspections.management.pogos.pdf.structure.cards.Card
import inspections.management.pogos.pdf.structure.elements.Image
import inspections.management.pogos.pdf.structure.elements.Title

@CompileStatic
class PdfHeader extends IPdf {

    Title title
    List<Card> cards
    Legend legend

    PdfHeader(
        Centre centre,
        Order order,
        String inspectionName,
        SavedInspection savedInspection,
        Order.VehicleType vehicleType
    ) {
        id = "header"
        title = new Title([], "title", new Image([], "logo", "img/feuvert-logo.png"), inspectionName)
        Set<SavedItem> headerItems = savedInspection.items.findAll { it.item.header }
        cards = [
            (Card) new InfoCard(order, savedInspection),
            (Card) new CentreCard(centre),
            (Card) ((Closure<VehicleCard>) vehicleType.buildCard)(order.vehicle, headerItems)
        ]
        legend = new Legend()
    }

    String toHtml() {
        return """
            <div id="$id">
                ${title.toHtml()}
                <div id="info">
                    ${cards.collect { it.toHtml() }.join("\n") }
                </div>
                ${legend.toHtml()}
            </div>
        """
    }

}

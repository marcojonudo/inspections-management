package inspections.management.pogos.pdf.inspection.cards

import groovy.transform.CompileStatic
import inspections.management.domains.SavedInspection
import inspections.management.domains.fviberi.Order
import inspections.management.i18n.CustomMessageSource
import inspections.management.pogos.pdf.inspection.cards.title.CardTitle
import inspections.management.pogos.pdf.structure.cards.KeyValueCard
import inspections.management.pogos.pdf.structure.elements.KeyValueSection

import java.time.format.DateTimeFormatter

@CompileStatic
class InfoCard extends KeyValueCard {

    InfoCard(Order order, SavedInspection savedInspection) {
        this.id = "info-card"
        this.title = new CardTitle("img/icons/info.svg", CustomMessageSource.getMessage("print.info.title"))
        this.sections = [
            new KeyValueSection(CustomMessageSource.getMessage("print.info.day"),
            order.day.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")))
        ]
        if (order.sellerCode) {
            this.sections << new KeyValueSection(CustomMessageSource.getMessage("print.info.seller"), order.sellerCode)
        }
        this.sections << new KeyValueSection(
            CustomMessageSource.getMessage("print.info.orderNumber"), "$order.code · $order.number"
        )
        this.sections << new KeyValueSection(
            CustomMessageSource.getMessage("print.info.mechanic"), "${savedInspection.findEmployeeCode()}"
        )
        this.sections << new KeyValueSection(CustomMessageSource.getMessage("print.info.client"), "$order.client.name")
    }

}

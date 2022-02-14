package inspections.management.pogos.pdf.inspection.cards

import groovy.transform.CompileStatic
import inspections.management.domains.SavedInspection
import inspections.management.domains.fviberi.Order
import inspections.management.pogos.pdf.inspection.cards.title.CardTitle
import inspections.management.pogos.pdf.structure.cards.KeyValueCard
import inspections.management.pogos.pdf.structure.elements.KeyValueSection

import java.time.LocalDate
import java.time.format.DateTimeFormatter

@CompileStatic
class InfoCard extends KeyValueCard {

    InfoCard(Order order, SavedInspection savedInspection) {
        this.id = "info-card"
        this.title = new CardTitle("img/icons/info.svg", "Información")
        this.sections = [new KeyValueSection("Día", LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")))]
        if (order.sellerCode) {
            this.sections << new KeyValueSection("Asesor", order.sellerCode)
        }
        this.sections << new KeyValueSection("Nº orden", "$order.code · $order.number")
        this.sections << new KeyValueSection("Mecánico", "$savedInspection.employeeCode")
        this.sections << new KeyValueSection("Cliente", "$order.client.name")
    }

}

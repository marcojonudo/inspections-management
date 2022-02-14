package inspections.management.pogos.pdf.inspection.cards

import groovy.transform.CompileStatic
import inspections.management.pogos.pdf.structure.cards.KeyValueCard

@CompileStatic
class VehicleCard extends KeyValueCard {

    VehicleCard() {
        this.id = "vehicle-card"
    }

}

package inspections.management.pogos.pdf.inspection.cards

import groovy.transform.CompileStatic
import inspections.management.pogos.pdf.inspection.cards.title.CardTitle
import inspections.management.pogos.pdf.structure.elements.KeyValueSection
import inspections.management.pogos.vehicles.ScooterVehicle
import org.apache.commons.text.WordUtils

@CompileStatic
class ScooterCard extends VehicleCard {

    ScooterCard(ScooterVehicle scooter) {
        this.title = new CardTitle("img/icons/scooter.svg", "Coche")
        this.sections = [
            new KeyValueSection("Número serie", scooter.identifier),
            new KeyValueSection("Modelo", "${WordUtils.capitalizeFully(scooter.brand)} ${WordUtils.capitalizeFully(scooter.model)}")
        ]
    }

}

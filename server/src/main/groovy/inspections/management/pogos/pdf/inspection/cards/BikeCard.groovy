package inspections.management.pogos.pdf.inspection.cards

import groovy.transform.CompileStatic
import inspections.management.i18n.CustomMessageSource
import inspections.management.pogos.pdf.inspection.cards.title.CardTitle
import inspections.management.pogos.pdf.structure.elements.KeyValueSection
import inspections.management.pogos.vehicles.BikeVehicle
import org.apache.commons.text.WordUtils

@CompileStatic
class BikeCard extends VehicleCard {

    BikeCard(BikeVehicle bike) {
        super()
        this.title = new CardTitle("img/icons/bike.svg", CustomMessageSource.getMessage("print.bike.title"))
        this.sections = [
            new KeyValueSection(
                CustomMessageSource.getMessage("print.bike.serialNumber"),
                bike.identifier
            ),
            new KeyValueSection(
                CustomMessageSource.getMessage("print.bike.model"),
                "${WordUtils.capitalizeFully(bike.brand)} ${WordUtils.capitalizeFully(bike.model)}"
            )
        ]
    }

}

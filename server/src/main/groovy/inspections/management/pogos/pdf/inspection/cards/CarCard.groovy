package inspections.management.pogos.pdf.inspection.cards

import groovy.transform.CompileStatic
import inspections.management.domains.savedItems.SavedItem
import inspections.management.i18n.CustomMessageSource
import inspections.management.pogos.pdf.inspection.cards.title.CardTitle
import inspections.management.pogos.pdf.structure.elements.KeyValueSection
import inspections.management.pogos.vehicles.CarVehicle
import org.apache.commons.text.WordUtils

@CompileStatic
class CarCard extends VehicleCard {

    CarCard(CarVehicle car, Set<SavedItem> headerItems) {
        super()
        this.title = new CardTitle("img/icons/car.svg", CustomMessageSource.getMessage("print.car.title"))
        this.sections = [
            new KeyValueSection(
                CustomMessageSource.getMessage("print.car.numberPlate"),
                car.identifier.trim()
            ),
            new KeyValueSection(
                CustomMessageSource.getMessage("print.car.model"),
                "${WordUtils.capitalizeFully(car.brand)} ${WordUtils.capitalizeFully(car.model)}"
            ),
            new KeyValueSection(
                CustomMessageSource.getMessage("print.car.cylinder"),
                car.cylinder ?: "-"
            ),
            new KeyValueSection(
                CustomMessageSource.getMessage("print.car.motor"),
                car.engineCode ?: "-"
            ),
            new KeyValueSection(
                CustomMessageSource.getMessage("print.car.power"),
                (String) (car.power ? "${car.power}cv" : "-")
            ),
            new KeyValueSection(
                CustomMessageSource.getMessage("print.car.registration"),
                "${car.registrationYear ?: "-"}"
            )
        ]
        headerItems.sort { it.item.printOrder }.each {
            this.sections << new KeyValueSection(it.item.shortName ?: it.item.name, it.findValue())
        }
    }

}

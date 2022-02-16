package inspections.management.pogos.pdf.inspection.cards

import groovy.transform.CompileStatic
import inspections.management.domains.savedItems.SavedItem
import inspections.management.pogos.pdf.inspection.cards.title.CardTitle
import inspections.management.pogos.pdf.structure.elements.KeyValueSection
import inspections.management.pogos.vehicles.CarVehicle
import org.apache.commons.text.WordUtils

@CompileStatic
class CarCard extends VehicleCard {

    CarCard(CarVehicle car, Set<SavedItem> headerItems) {
        super()
        this.title = new CardTitle("img/icons/car.svg", "Coche")
        this.sections = [
            new KeyValueSection("Matrícula", car.identifier.trim()),
            new KeyValueSection("Modelo", "${WordUtils.capitalizeFully(car.brand)} ${WordUtils.capitalizeFully(car.model)}"),
            new KeyValueSection("Cilindrada", car.cylinder ?: "-"),
            new KeyValueSection("Motor", car.engineCode ?: "-"),
            new KeyValueSection("Potencia", (String) (car.power ? "${car.power}cv" : "-")),
            new KeyValueSection("Matriculación", "${car.registrationYear ?: "-"}")
        ]
        headerItems.sort { it.item.printOrder }.each {
            this.sections << new KeyValueSection(it.item.name, it.findValue())
        }
    }

}

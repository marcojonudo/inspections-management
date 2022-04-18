package inspections.management.utils

import groovy.transform.CompileStatic
import inspections.management.domains.InspectionVehicle
import inspections.management.domains.fviberi.Centre
import inspections.management.domains.fviberi.Client
import inspections.management.domains.fviberi.Order
import inspections.management.domains.items.Item
import inspections.management.i18n.CustomMessageSource
import inspections.management.pogos.mails.MailSender
import inspections.management.pogos.vehicles.Vehicle
import org.apache.commons.text.WordUtils

import java.time.format.DateTimeFormatter

@CompileStatic
class Builder {

    static InspectionVehicle buildInspectionVehicle(
        InspectionVehicle inspectionVehicle, List<Item> items, boolean orderInspection = true
    ) {
        items.each {
            it.vehicleData = it.vehicleDataList.find { it.vehicle == inspectionVehicle.vehicle }
        }
        return new InspectionVehicle(
            inspectionVehicle.inspectionType, inspectionVehicle.vehicle, items.toSet(), orderInspection
        )
    }

    class Mail {

        static MailSender buildInspectionSender(String from, String centreName) {
            return new MailSender(from, "Feu Vert ${WordUtils.capitalizeFully(centreName)}")
        }

        static buildInspectionSubject(Order order) {
            String day = order.day.format(DateTimeFormatter.ofPattern(Constants.DateFormat.dd_MM_yyyy))
            return "Revisión Feu Vert Nº orden $order.number del día $day"
        }

        static buildInspectionBody(Centre centre, Client client, Vehicle vehicle) {
            String clientName = client.name ? " ${WordUtils.capitalizeFully(client.name)}" : ""
            Map<String, String> variables = [
                clientName: clientName,
                vehicleBrand: WordUtils.capitalizeFully(vehicle.brand),
                vehicleModel: WordUtils.capitalizeFully(vehicle.model),
                vehicleIdentifier: vehicle.identifier.trim(),
                centrePhoneNumber: centre.phoneNumber.trim()
            ]
            return CustomMessageSource.getMessage("mail.body.message", variables)
        }

    }

}

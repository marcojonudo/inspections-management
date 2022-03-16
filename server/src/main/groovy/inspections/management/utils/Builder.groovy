package inspections.management.utils

import groovy.transform.CompileStatic
import inspections.management.domains.InspectionVehicle
import inspections.management.domains.fviberi.Centre
import inspections.management.domains.fviberi.Client
import inspections.management.domains.fviberi.Order
import inspections.management.domains.items.Item
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
            StringBuilder builder = new StringBuilder("!Hola${client.name ? " ${WordUtils.capitalizeFully(client.name)}" : ""}!\n")
            builder.append("Y GRACIAS por tu visita, a todo nuestro equipo Feu Vert nos ha encantado recibirte en nuestra tienda.\n")
            builder.append("Te enviamos la REVISIÓN COMPLETA y detallada que hemos realizado en tu ${WordUtils.capitalizeFully(vehicle.brand)} ${WordUtils.capitalizeFully(vehicle.model)} con matrícula ${vehicle.identifier.trim()}.\n")
            builder.append("Si necesitas realizarnos alguna consulta adicional, puedes respondernos a esta misma dirección de correo electrónico o por teléfono: ${centre.phoneNumber.trim()}.\n")
            builder.append("Gracias por ayudarnos a contribuir con la conservación del medio ambiente eligiendo este medio electrónico.\n")
            builder.append("En Feu Vert, nos movemos contigo.")
            return builder.toString()
        }

    }

}

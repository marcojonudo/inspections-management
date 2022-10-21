package inspections.management.utils

import groovy.transform.CompileStatic
import inspections.management.domains.InspectionVehicle
import inspections.management.domains.SavedInspection
import inspections.management.domains.fviberi.Centre
import inspections.management.domains.fviberi.Client
import inspections.management.domains.fviberi.Order
import inspections.management.domains.items.Item
import inspections.management.i18n.CustomMessageSource
import inspections.management.pogos.mails.MailSender
import inspections.management.pogos.slack.messages.SlackBlocksMessage
import inspections.management.pogos.slack.messages.SlackMessage
import inspections.management.pogos.slack.structure.blocks.SlackBlock
import inspections.management.pogos.slack.structure.blocks.SlackContextBlock
import inspections.management.pogos.slack.structure.blocks.SlackDividerBlock
import inspections.management.pogos.slack.structure.blocks.SlackFieldsBlock
import inspections.management.pogos.slack.structure.blocks.SlackHeaderBlock
import inspections.management.pogos.slack.structure.blocks.SlackTextBlock
import inspections.management.pogos.slack.structure.elements.SlackBaseElem
import inspections.management.pogos.slack.structure.elements.SlackMarkdownElem
import inspections.management.pogos.slack.structure.elements.SlackPlainTextElem
import inspections.management.pogos.vehicles.Vehicle
import io.micronaut.http.HttpStatus
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
            Map<String, Object> variables = [
                orderNumber: order.number,
                day: day
            ] as Map<String, Object>
            return CustomMessageSource.getMessage("mail.subject", variables)
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


    class Slack {

        static SlackBlock buildExceptionBlock(Exception e) {
            new SlackFieldsBlock([
                new SlackMarkdownElem(":boom: *Exception:*\n${e.getClass().simpleName}"),
                new SlackMarkdownElem(":memo: *Error message:*\n$e.message")
            ] as List<SlackBaseElem>)
        }

        static List<SlackBlock> buildBaseInfoBlocks(
            String message,
            int centre,
            int orderNumber,
            String employeeCode,
            String numberPlate,
            List<SlackBlock> blocks = []
        ) {
            blocks << new SlackHeaderBlock(new SlackPlainTextElem(message))
            blocks << new SlackContextBlock([
                (SlackBaseElem) new SlackMarkdownElem("$centre | $orderNumber | $numberPlate | $employeeCode")
            ])
            blocks << new SlackDividerBlock()
            return blocks
        }

        static SlackMessage buildSentSmsMessage(
            String message, int centre, SavedInspection savedInspection, String employeeCode, int phoneNumber
        ) {
            String headerMessage = ":rocket: $message"
            List<SlackBlock> blocks = buildBaseInfoBlocks(
                headerMessage, centre, savedInspection.orderNumber, employeeCode, savedInspection.numberPlate)
            blocks << new SlackTextBlock(new SlackMarkdownElem(":phone: *Phone number*: $phoneNumber"))
            return new SlackBlocksMessage(blocks)
        }

        static SlackMessage buildSendSmsErrorMessage(
            String message, int centre, SavedInspection savedInspection, String employeeCode, int phoneNumber, Exception e
        ) {
            String headerMessage = ":boom: $message"
            List<SlackBlock> blocks = buildBaseInfoBlocks(
                headerMessage, centre, savedInspection.orderNumber, employeeCode, savedInspection.numberPlate)
            blocks << new SlackTextBlock(new SlackMarkdownElem(":phone: *Phone number*: $phoneNumber"))
            blocks << buildExceptionBlock(e)
            return new SlackBlocksMessage(blocks)
        }

        static SlackMessage buildSendSmsErrorMessage(
            String message, int centre, SavedInspection savedInspection, String employeeCode, int phoneNumber, HttpStatus status
        ) {
            String headerMessage = ":boom: $message"
            List<SlackBlock> blocks = buildBaseInfoBlocks(
                headerMessage, centre, savedInspection.orderNumber, employeeCode, savedInspection.numberPlate)
            blocks << new SlackTextBlock(new SlackMarkdownElem(":phone: *Phone number*: $phoneNumber"))
            blocks << new SlackTextBlock(new SlackMarkdownElem(":1234: *Sudoku response status*: $status.code"))
            return new SlackBlocksMessage(blocks)
        }

    }

}

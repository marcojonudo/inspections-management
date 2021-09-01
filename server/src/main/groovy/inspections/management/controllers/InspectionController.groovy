package inspections.management.controllers

import groovy.transform.CompileStatic
import inspections.management.domains.fviberi.Order
import inspections.management.pogos.OrderInspection
import inspections.management.services.InspectionService
import inspections.management.services.data.LanguageDataService
import inspections.management.services.data.OrderDataService
import inspections.management.utils.Constants
import io.micronaut.core.convert.format.Format
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.Post
import io.micronaut.http.annotation.QueryValue
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.ArraySchema
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse

import javax.inject.Inject
import java.time.LocalDate

@Controller("/inspection")
@CompileStatic
class InspectionController {

	@Inject private OrderDataService orderDataService
	@Inject private InspectionService inspectionService
	@Inject private LanguageDataService languageDataService

	@Get("/orders")
	@Operation(
		summary = "Obtiene las ordenes",
		description = "Obtiene las ordenes"
	)
	@ApiResponse(
		responseCode = "200",
		description = "Lista de ordenes",
		content = @Content(array = @ArraySchema(schema = @Schema(implementation = Order)))
	)
    List<Order> findOrders(
		@QueryValue @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate day,
		@QueryValue boolean to
	) {
		return to ? orderDataService.findAllTo(day) : orderDataService.findAll(day)
	}

	@Post("/orderInspection")
	@Operation(
		summary = "Obtiene las ordenes y revisiones",
		description = "Obtiene las ordenes y e información sobre la revisión asociada"
	)
	@ApiResponse(
		responseCode = "200",
		description = "Lista de ordenes y revisiones",
		content = @Content(array = @ArraySchema(schema = @Schema(implementation = OrderInspection)))
	)
    List<OrderInspection> findOrderInspectionInfo(@Body List<Order> orders) {
		return inspectionService.findOrderInspectionInfo(orders)
    }

	@Get("/language")
	@Operation(
		summary = "Obtiene el idioma de la aplicación",
		description = "Obtiene el código de idioma de la base de datos"
	)
	@ApiResponse(
		responseCode = "200",
		description = "Idioma encontrado",
		content = @Content(mediaType = "text/plain", schema = @Schema(type = "string"))
	)
	String findLanguage() {
		return languageDataService.findLanguageLang()
	}

}

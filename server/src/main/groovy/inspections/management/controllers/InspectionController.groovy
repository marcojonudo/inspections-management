package inspections.management.controllers

import groovy.transform.CompileStatic
import inspections.management.pogos.OrderInspection
import inspections.management.services.InspectionService
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.ArraySchema
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse

import javax.inject.Inject

@Controller("/inspection")
@CompileStatic
class InspectionController {

	@Inject private InspectionService inspectionService

	@Get("/orderInspection")
	@Operation(
		summary = "Obtiene las ordenes y revisiones",
		description = "Obtiene las ordenes y e información sobre la revisión asociada"
	)
	@ApiResponse(
		responseCode = "200",
		description = "Lista de ordenes y revisiones",
		content = @Content(array = @ArraySchema(schema = @Schema(implementation = OrderInspection)))
	)
    List<OrderInspection> findOrderInspectionInfo() {
		return inspectionService.findOrderInspectionInfo()
    }

}

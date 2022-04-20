package inspections.management.controllers

import groovy.transform.CompileStatic
import inspections.management.domains.ItemRelation
import inspections.management.services.data.ItemRelationDataService
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.ArraySchema
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse

import javax.inject.Inject

@Controller("/itemRelations")
@CompileStatic
class ItemRelationsController {

	@Inject private ItemRelationDataService itemRelationDataService

	@Get
	@Operation(summary = "Obtiene las relaciones de items", description = "Obtiene las relaciones de items")
	@ApiResponse(
		responseCode = "200",
		description = "Relaciones encontradas",
		content = @Content(array = @ArraySchema(schema = @Schema(implementation = ItemRelation)))
	)
	@ApiResponse(responseCode = "404", description = "Relaciones no encontrado")
	List<ItemRelation> get() {
		return itemRelationDataService.findAll()
	}

}

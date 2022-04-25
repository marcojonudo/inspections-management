package inspections.management.controllers

import groovy.transform.CompileStatic
import inspections.management.domains.items.SelectItemOptions
import inspections.management.services.data.SelectItemOptionsDataService
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.ArraySchema
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse

import javax.inject.Inject

@Controller("/selectItemOptions")
@CompileStatic
class SelectItemOptionsController {

    @Inject SelectItemOptionsDataService selectItemOptionsDataService

    @Get
    @Operation(
        summary = "Obtiene las opciones de items de selección",
        description = "Obtiene las opciones de items de selección"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Lista de opciones de items de selección",
        content = @Content(array = @ArraySchema(schema = @Schema(implementation = SelectItemOptions)))
    )
    List<SelectItemOptions> get() {
        return selectItemOptionsDataService.findAll()
    }

}

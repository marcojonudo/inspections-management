package inspections.management.controllers

import groovy.transform.CompileStatic
import inspections.management.domains.items.Item
import inspections.management.services.data.ItemDataService
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.ArraySchema
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse

import javax.inject.Inject

@Controller("/items")
@CompileStatic
class ItemController {

    @Inject private ItemDataService itemDataService

    @Get
    @Operation(summary = "Obtiene la lista de items", description = "Obtiene la lista de items")
    @ApiResponse(
        responseCode = "200",
        description = "Lista de items",
        content = @Content(array = @ArraySchema(schema = @Schema(implementation = Item)))
    )
    @ApiResponse(responseCode = "404", description = "Centro no encontrado")
    List<Item> get() {
        return itemDataService.findAll()
    }

}

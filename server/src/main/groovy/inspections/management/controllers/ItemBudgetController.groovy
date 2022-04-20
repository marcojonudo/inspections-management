package inspections.management.controllers

import groovy.transform.CompileStatic
import inspections.management.domains.ItemBudget
import inspections.management.services.data.*
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.ArraySchema
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse

import javax.inject.Inject

@Controller("/itemBudgets")
@CompileStatic
class ItemBudgetController {

    @Inject private ItemBudgetDataService itemBudgetDataService

    @Get
    @Operation(
        summary = "Obtiene la relación entre items y tipos de presupuesto",
        description = "Obtiene la relación entre items y tipos de presupuesto"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Lista de items y su tipo de presupuesto",
        content = @Content(array = @ArraySchema(schema = @Schema(implementation = ItemBudget)))
    )
    List<ItemBudget> findItemBudgets() {
        return itemBudgetDataService.findAll()
    }

}

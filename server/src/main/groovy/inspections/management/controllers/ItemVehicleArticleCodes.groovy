package inspections.management.controllers

import groovy.transform.CompileStatic
import inspections.management.domains.ItemVehicleArticleCode
import inspections.management.services.data.ItemVehicleArticleCodeDataService
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.ArraySchema
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse

import javax.inject.Inject

@Controller("/articleItems")
@CompileStatic
class ItemVehicleArticleCodes {

    @Inject private ItemVehicleArticleCodeDataService itemVehicleArticleCodeDataService

    @Get
    @Operation(
        summary = "Obtiene la relación entre artículos e items",
        description = "Obtiene la relación entre artículos e items"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Lista de artículos e items",
        content = @Content(array = @ArraySchema(schema = @Schema(implementation = ItemVehicleArticleCode)))
    )
    List<ItemVehicleArticleCode> findArticleItems() {
        return itemVehicleArticleCodeDataService.findAll()
    }

}

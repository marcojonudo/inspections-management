package inspections.management.controllers

import groovy.transform.CompileStatic
import inspections.management.domains.fviberi.Order
import inspections.management.services.InspectionService
import inspections.management.utils.Constants
import io.micronaut.core.convert.format.Format
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.QueryValue
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.ArraySchema
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse

import javax.annotation.Nullable
import javax.inject.Inject
import java.time.LocalDate

@Controller("/orders")
@CompileStatic
class OrderController {

    @Inject private InspectionService inspectionService

    @Get
    @Operation(summary = "Obtiene las ordenes", description = "Obtiene las ordenes")
    @ApiResponse(
        responseCode = "200",
        description = "Lista de ordenes",
        content = @Content(array = @ArraySchema(schema = @Schema(implementation = Order)))
    )
    List<Order> findOrders(
        @QueryValue @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate day,
        @QueryValue @Nullable Boolean to
    ) {
        return inspectionService.findOrders(day, to)
    }

}

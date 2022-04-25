package inspections.management.controllers

import groovy.transform.CompileStatic
import inspections.management.domains.fviberi.Centre
import inspections.management.services.data.CentreDataService
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse

import javax.inject.Inject

@Controller("/centres")
@CompileStatic
class CentreController {

    @Inject private CentreDataService centreDataService

    @Get
    @Operation(summary = "Obtiene el centro", description = "Obtiene el centro")
    @ApiResponse(
        responseCode = "200",
        description = "Centro encontrado",
        content = @Content(mediaType = "application/json", schema = @Schema(implementation = Centre))
    )
    @ApiResponse(responseCode = "404", description = "Centro no encontrado")
    Centre findCentre() {
        return centreDataService.find()
    }

}

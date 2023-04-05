package inspections.management.controllers

import groovy.transform.CompileStatic
import inspections.management.domains.SavedInspection
import inspections.management.domains.SavedInspectionData
import inspections.management.domains.SavedInspectionData.Reason
import inspections.management.services.data.SavedInspectionDataDataService
import inspections.management.services.data.SavedInspectionDataService
import io.micronaut.http.HttpResponse
import io.micronaut.http.HttpStatus
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.PathVariable
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse

import javax.inject.Inject

@Controller("/savedInspectionDatas")
@CompileStatic
class SavedInspectionDataController {

    @Inject SavedInspectionDataService savedInspectionDataService
    @Inject SavedInspectionDataDataService savedInspectionDataDataService

    @Get("/{orderNumber}/{reason}")
    @Operation(
        summary = "Obtiene un registro de información de actualización de revisión",
        description = "Obtiene un registro de información de actualización de revisión"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Información de guardado",
        content = @Content(schema = @Schema(implementation = SavedInspectionData))
    )
    @ApiResponse(responseCode = "404", description = "Revisión no encontrada")
    @ApiResponse(responseCode = "406", description = "Revisión no finalizada")
    HttpResponse checkInspection(@PathVariable int orderNumber, @PathVariable Reason reason) {
        SavedInspection savedInspection = savedInspectionDataService.find(orderNumber, true)
        if (!savedInspection) {
            return HttpResponse.notFound()
        }
        if (savedInspection.state != SavedInspection.State.FINISHED) {
            return HttpResponse.status(HttpStatus.NOT_ACCEPTABLE)
        }
        SavedInspectionData data = savedInspectionDataDataService.find(savedInspection, reason)
        return HttpResponse.status(data ? HttpStatus.OK : HttpStatus.NOT_FOUND).body(data);
    }

}

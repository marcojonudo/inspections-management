package inspections.management.controllers

import groovy.transform.CompileStatic
import inspections.management.domains.SavedInspection
import inspections.management.services.InspectionService
import inspections.management.services.data.SavedInspectionDataService
import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Post
import io.micronaut.http.annotation.QueryValue
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse

import javax.inject.Inject

@Controller("/mails")
@CompileStatic
class MailController {

    @Inject InspectionService inspectionService
    @Inject SavedInspectionDataService savedInspectionDataService

    @Post
    @Operation(
        summary = "Envía un correo con una revisión",
        description = "Envía un correo con la revisión asociada al número de orden indicado"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Correo enviado",
        content = @Content(mediaType = "application/json", schema = @Schema(type = "string"))
    )
    HttpResponse sendMail(@QueryValue String to, @Body SavedInspection savedInspection) {
        SavedInspection existent = savedInspectionDataService.find(savedInspection.orderNumber, true)
        inspectionService.sendInspectionMail(existent, to)
        SavedInspection saved = savedInspectionDataService.addData(savedInspection, existent, true)
        return HttpResponse.ok(saved)
    }

}

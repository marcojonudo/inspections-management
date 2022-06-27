package inspections.management.controllers

import groovy.transform.CompileStatic
import inspections.management.domains.SavedInspection
import inspections.management.services.InspectionService
import io.micronaut.http.HttpResponse
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
    HttpResponse sendMail(@QueryValue Integer orderNumber, @QueryValue String to, @QueryValue String employeeCode) {
        SavedInspection savedInspection = inspectionService.sendInspectionMail(orderNumber, to, employeeCode)
        return HttpResponse.ok(savedInspection)
    }

}

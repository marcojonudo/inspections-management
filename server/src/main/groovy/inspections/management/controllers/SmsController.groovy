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
import io.swagger.v3.oas.annotations.responses.ApiResponse

import javax.inject.Inject

@Controller("/sms")
@CompileStatic
class SmsController {

    @Inject InspectionService inspectionService
    @Inject SavedInspectionDataService savedInspectionDataService

    @Post
    @Operation(
        summary = "Envía un sms con una revisión",
        description = "Envía un sms con la revisión asociada al número de orden indicado a través de un servicio REST de apolo"
    )
    @ApiResponse(responseCode = "200", description = "Sms enviado")
    @ApiResponse(responseCode = "500", description = "Error enviando sms")
    HttpResponse sendSms(@QueryValue int to, @QueryValue String employeeCode, @Body SavedInspection savedInspection) {
        SavedInspection existent = savedInspectionDataService.find(savedInspection.orderNumber, true)
        boolean sent = inspectionService.sendInspectionSms(existent, to, employeeCode)
        if (sent) {
            SavedInspection saved = savedInspectionDataService.addData(savedInspection, existent, true)
            return HttpResponse.ok(saved)
        } else {
            return HttpResponse.serverError()
        }
    }

}

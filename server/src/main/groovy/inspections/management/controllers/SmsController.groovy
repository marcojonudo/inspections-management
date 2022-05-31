package inspections.management.controllers

import groovy.transform.CompileStatic
import inspections.management.services.InspectionService
import io.micronaut.http.HttpResponse
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

    @Post
    @Operation(
        summary = "Envía un sms con una revisión",
        description = "Envía un sms con la revisión asociada al número de orden indicado a través de un servicio REST de apolo"
    )
    @ApiResponse(responseCode = "200", description = "Sms enviado")
    HttpResponse sendMail(@QueryValue Integer orderNumber, @QueryValue int to, @QueryValue String employeeCode) {
        inspectionService.sendInspectionSms(orderNumber, to, employeeCode)
        return HttpResponse.ok()
    }

}

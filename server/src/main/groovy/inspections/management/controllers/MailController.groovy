package inspections.management.controllers

import groovy.transform.CompileStatic
import inspections.management.services.InspectionService
import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Post
import io.micronaut.http.annotation.QueryValue

import javax.inject.Inject

@Controller("/mails")
@CompileStatic
class MailController {

    @Inject InspectionService inspectionService

    @Post
    HttpResponse sendMail(@QueryValue int orderNumber, @QueryValue String to) {
        inspectionService.sendInspectionMail(orderNumber, to)
        return HttpResponse.ok()
    }

}

package inspections.management.controllers

import groovy.transform.CompileStatic
import inspections.management.domains.BudgetNotification
import inspections.management.domains.SavedInspection
import inspections.management.domains.fviberi.Centre
import inspections.management.domains.fviberi.Order
import inspections.management.pogos.RealTimePublisher
import inspections.management.pogos.realTime.RealTimeSavedInspection
import inspections.management.services.InspectionService
import inspections.management.services.PdfService
import inspections.management.services.data.CentreDataService
import inspections.management.services.data.OrderDataService
import inspections.management.services.data.SavedInspectionDataService
import inspections.management.services.data.SavedItemDataService
import io.micronaut.http.HttpResponse
import io.micronaut.http.MediaType
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.Header
import io.micronaut.http.annotation.Patch
import io.micronaut.http.annotation.Post
import io.micronaut.http.server.types.files.SystemFile
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.ArraySchema
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse

import javax.inject.Inject

@Controller("/savedInspections")
@CompileStatic
class SavedInspectionController {

    @Inject SavedInspectionDataService savedInspectionDataService
    @Inject OrderDataService orderDataService
    @Inject CentreDataService centreDataService
    @Inject SavedItemDataService savedItemDataService
    @Inject PdfService pdfService
    @Inject InspectionService inspectionService

    @Get(value = "/{numberPlate}", consumes = MediaType.MULTIPART_FORM_DATA)
    SystemFile getPdf(String numberPlate) {
        Integer orderNumber = savedInspectionDataService.findSavedInspectionOrderNumber(
            numberPlate, [sort: 'saved', order: 'desc', max: 1]
        )
        SystemFile pdf = null
        if (orderNumber) {
            SavedInspection savedInspection = savedInspectionDataService.find(orderNumber, true)
            Centre centre = centreDataService.find()
            Order order = orderDataService.find(savedInspection.orderNumber)
            File pdfFile = pdfService.buildPdf(centre, order, savedInspection)
            pdf = new SystemFile(pdfFile).attach("${numberPlate}.pdf")
        }
        return pdf
    }

    @Get(value = "/{orderNumber}/{numberPlate}", consumes = MediaType.MULTIPART_FORM_DATA)
    SystemFile getPdf(Integer orderNumber, String numberPlate) {
        SystemFile pdf = null
        SavedInspection savedInspection = savedInspectionDataService.find(orderNumber, numberPlate, true)
        if (savedInspection) {
            Centre centre = centreDataService.find()
            Order order = orderDataService.find(savedInspection.orderNumber)
            File pdfFile = pdfService.buildPdf(centre, order, savedInspection)
            pdf = new SystemFile(pdfFile).attach("${numberPlate}.pdf")
        }
        return pdf
    }

    @Post
    @Operation(
        summary = "Obtiene las revisiones guardadas",
        description = "Obtiene las revisiones guardadas en base de datos"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Lista de revisiones guardadas",
        content = @Content(array = @ArraySchema(schema = @Schema(implementation = SavedInspection)))
    )
    List<SavedInspection> findSavedInspections(@Body List<Order> orders) {
        return savedInspectionDataService.findAll(orders)
    }

    @Patch
    @Operation(
        summary = "Actualiza una revisión",
        description = "Actualiza una revisión"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Revisión actualizada",
        content = @Content(schema = @Schema(implementation = BudgetNotification))
    )
    @ApiResponse(responseCode = "500", description = "Error actualizando la revisión")
    HttpResponse<SavedInspection> updateInspection(@Header String sessionId, @Body SavedInspection savedInspection) {
        SavedInspection newSavedInspection = inspectionService.saveInspection(
            savedInspection, savedInspection.orderNumber, savedInspection.sellerCode
        )
        HttpResponse<SavedInspection> response
        if (newSavedInspection) {
            RealTimePublisher.send(new RealTimeSavedInspection(savedInspection), sessionId)
            response = HttpResponse.ok(savedInspection)
        } else {
            response = HttpResponse.serverError()
        }
        return response
    }

}

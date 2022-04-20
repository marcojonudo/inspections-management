package inspections.management.controllers

import groovy.transform.CompileStatic
import inspections.management.domains.fviberi.Order
import inspections.management.pogos.OrderInspection
import inspections.management.pogos.RealTimePublisher
import inspections.management.pogos.realTime.RealTimeInfo
import inspections.management.services.InspectionService
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.Post
import io.micronaut.http.sse.Event
import io.reactivex.subjects.PublishSubject
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.ArraySchema
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse

import javax.inject.Inject

@Controller("/inspections")
@CompileStatic
class InspectionController {

    @Inject private InspectionService inspectionService

    @Get("/publisher")
    PublishSubject<Event<RealTimeInfo>> getCardsPublisher() {
        return RealTimePublisher.find()
    }

    @Post
    @Operation(
        summary = "Obtiene las revisiones",
        description = "Obtiene las revisiones asociadas a los números de orden"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Lista de revisiones",
        content = @Content(array = @ArraySchema(schema = @Schema(implementation = OrderInspection)))
    )
    List<OrderInspection> findInspections(@Body Map<String, List<Order>> orders) {
        List<OrderInspection> orderInspections = inspectionService.findOrderInspections(orders.orders)
        List<OrderInspection> detectedAnomaliesOrderInspections = inspectionService.findDetectedAnomaliesInspections(
            orders.detectedAnomaliesOrders
        )
        return orderInspections + detectedAnomaliesOrderInspections
    }

}

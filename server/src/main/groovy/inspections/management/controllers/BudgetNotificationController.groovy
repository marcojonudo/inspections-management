package inspections.management.controllers

import groovy.transform.CompileStatic
import inspections.management.domains.BudgetNotification
import inspections.management.services.data.BudgetNotificationDataService
import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.*
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.ArraySchema
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse

import javax.inject.Inject

@Controller("/budgetNotifications")
@CompileStatic
class BudgetNotificationController {

    @Inject private BudgetNotificationDataService budgetNotificationDataService

    @Get
    @Operation(
        summary = "Obtiene las notificaciones de presupuestos a clientes",
        description = "Obtiene las notificaciones de presupuestos a clientes"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Lista de información de BD",
        content = @Content(array = @ArraySchema(schema = @Schema(implementation = BudgetNotification)))
    )
    HttpResponse<List<BudgetNotification>> findBudgetNotifications(@QueryValue List<Integer> orderNumbers) {
        return HttpResponse.ok(budgetNotificationDataService.findAll(orderNumbers))
    }

    @Post
    @Operation(
        summary = "Crea una notificación de cliente avisado",
        description = "Crea una notificación de cliente avisado de presupuesto"
    )
    @ApiResponse(
        responseCode = "201",
        description = "Notificación creada",
        content = @Content(schema = @Schema(implementation = BudgetNotification))
    )
    HttpResponse<List<BudgetNotification>> createBudgetNotification(
        @Body List<BudgetNotification> budgetNotifications
    ) {
        budgetNotifications = budgetNotifications.collect { budgetNotificationDataService.save(it) }
        return HttpResponse.created(budgetNotifications)
    }

    @Delete("/{orderNumber}")
    @Operation(
        summary = "Borra una notificación a cliente",
        description = "Borra una notificación a cliente"
    )
    @ApiResponse(responseCode = "200", description = "Notificación borrada")
    void deleteBudgetNotification(@QueryValue int orderNumber) {
        budgetNotificationDataService.delete(orderNumber)
    }

}

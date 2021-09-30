package inspections.management.controllers

import groovy.transform.CompileStatic
import inspections.management.domains.BudgetNotification
import inspections.management.domains.ItemArticleCode
import inspections.management.domains.ItemBudget
import inspections.management.domains.fviberi.Order
import inspections.management.domains.schedules.EmployeeData
import inspections.management.pogos.OrderInspection
import inspections.management.services.InspectionService
import inspections.management.services.data.*
import inspections.management.utils.Constants
import io.micronaut.core.convert.format.Format
import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.*
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.ArraySchema
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse

import javax.inject.Inject
import java.time.LocalDate

@Controller("/inspection")
@CompileStatic
class InspectionController {

    @Inject private OrderDataService orderDataService
    @Inject private InspectionService inspectionService
    @Inject private LanguageDataService languageDataService
    @Inject private ItemArticleCodeDataService itemArticleCodeDataService
    @Inject private ItemBudgetDataService itemBudgetDataService
    @Inject private BudgetNotificationDataService budgetNotificationDataService
    @Inject private EmployeeDataDataService employeeDataDataService

    @Get("/language")
    @Operation(
        summary = "Obtiene el idioma de la aplicación",
        description = "Obtiene el código de idioma de la base de datos"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Idioma encontrado",
        content = @Content(mediaType = "text/plain", schema = @Schema(type = "string"))
    )
    String findLanguage() {
        return languageDataService.findLanguageLang()
    }

    @Get("/employees")
    @Operation(
        summary = "Obtiene los empleados",
        description = "Obtiene todos los empleados"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Lista de empleados",
        content = @Content(array = @ArraySchema(schema = @Schema(implementation = EmployeeData)))
    )
    List<EmployeeData> getEmployees() {
        return employeeDataDataService.findAll()
    }

    @Get("/orders")
    @Operation(
        summary = "Obtiene las ordenes",
        description = "Obtiene las ordenes"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Lista de ordenes",
        content = @Content(array = @ArraySchema(schema = @Schema(implementation = Order)))
    )
    List<Order> findOrders(
        @QueryValue @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate day,
        @QueryValue boolean to
    ) {
        List<Order> a = to ? orderDataService.findAllTo(day) : orderDataService.findAll(day)
        return a
    }

    @Post("/orderInspection")
    @Operation(
        summary = "Obtiene las ordenes y revisiones",
        description = "Obtiene las ordenes y e información sobre la revisión asociada"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Lista de ordenes y revisiones",
        content = @Content(array = @ArraySchema(schema = @Schema(implementation = OrderInspection)))
    )
    List<OrderInspection> findOrderInspectionInfo(@Body List<Order> orders) {
        return inspectionService.findOrderInspectionInfo(orders)
    }

    @Post("/articleItems")
    @Operation(
        summary = "Obtiene la relación entre artículos e items",
        description = "Obtiene la relación entre artículos e items"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Lista de artículos e items",
        content = @Content(array = @ArraySchema(schema = @Schema(implementation = ItemArticleCode)))
    )
    List<ItemArticleCode> findArticleItems(@Body List<Integer> articleCodes) {
        return articleCodes ? itemArticleCodeDataService.findAll(articleCodes) : []
    }

    @Get("/itemBudgets")
    @Operation(
        summary = "Obtiene la relación entre items y tipos de presupuesto",
        description = "Obtiene la relación entre items y tipos de presupuesto"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Lista de items y su tipo de presupuesto",
        content = @Content(array = @ArraySchema(schema = @Schema(implementation = ItemBudget)))
    )
    List<ItemBudget> findItemBudgets() {
        return itemBudgetDataService.findAll()
    }

    @Get("/budgetNotification")
    @Operation(
        summary = "Obtiene las notificaciones de presupuestos a clientes",
        description = "Obtiene las notificaciones de presupuestos a clientes"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Lista de información de BD",
        content = @Content(array = @ArraySchema(schema = @Schema(implementation = BudgetNotification)))
    )
    List<BudgetNotification> findBudgetNotifications(@QueryValue List<Integer> orderNumbers) {
        return orderNumbers ? budgetNotificationDataService.findAll(orderNumbers) : []
    }

    @Post("/budgetNotification")
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

    @Delete("/budgetNotification")
    @Operation(
        summary = "Borra una notificación a cliente",
        description = "Borra una notificación a cliente"
    )
    @ApiResponse(responseCode = "200", description = "Notificación borrada")
    void deleteBudgetNotification(@QueryValue int orderNumber) {
        budgetNotificationDataService.delete(orderNumber)
    }

    @Patch("/budgetNotification")
    @Operation(
        summary = "Actualiza un presupuesto aceptado",
        description = "Actualiza un presupuesto aceptado"
    )
    @ApiResponse(responseCode = "200", description = "Presupuesto actualizado")
    void deleteBudgetNotification(@Body BudgetNotification budgetNotification) {
        budgetNotificationDataService.update(
            budgetNotification.orderNumber, budgetNotification.itemCode, budgetNotification.accepted
        )
    }

}

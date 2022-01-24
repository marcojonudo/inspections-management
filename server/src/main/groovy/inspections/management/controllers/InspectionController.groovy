package inspections.management.controllers

import groovy.transform.CompileStatic
import inspections.management.domains.*
import inspections.management.domains.fviberi.Centre
import inspections.management.domains.fviberi.Order
import inspections.management.domains.schedules.EmployeeData
import inspections.management.pogos.OrderInspection
import inspections.management.pogos.RealTimePublisher
import inspections.management.pogos.realTime.RealTimeInfo
import inspections.management.pogos.realTime.RealTimeSavedInspection
import inspections.management.services.InspectionService
import inspections.management.services.data.*
import inspections.management.utils.Constants
import io.micronaut.core.convert.format.Format
import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.*
import io.micronaut.http.sse.Event
import io.reactivex.subjects.PublishSubject
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.ArraySchema
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import org.slf4j.Logger
import org.slf4j.LoggerFactory

import javax.annotation.Nullable
import javax.inject.Inject
import java.time.LocalDate

@Controller("/inspection")
@CompileStatic
class InspectionController {

    private static final Logger LOG = LoggerFactory.getLogger(InspectionController)

    @Inject private InspectionService inspectionService
    @Inject private LanguageDataService languageDataService
    @Inject private ItemVehicleArticleCodeDataService itemVehicleArticleCodeDataService
    @Inject private ItemBudgetDataService itemBudgetDataService
    @Inject private BudgetNotificationDataService budgetNotificationDataService
    @Inject private EmployeeDataDataService employeeDataDataService
    @Inject private SavedInspectionDataService savedInspectionDataService
    @Inject private CentreDataService centreDataService
    @Inject private ImageDataService imageDataService

    @Get("/publisher")
    PublishSubject<Event<RealTimeInfo>> getCardsPublisher() {
        return RealTimePublisher.find()
    }

    @Get("/centre")
    @Operation(
        summary = "Obtiene el centro",
        description = "Obtiene el centro"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Centro encontrado",
        content = @Content(mediaType = "application/json", schema = @Schema(implementation = Centre))
    )
    @ApiResponse(
        responseCode = "404", description = "Centro no encontrado"
    )
    Centre findCentre() {
        return centreDataService.find()
    }

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
        @QueryValue @Nullable Boolean to
    ) {
        return inspectionService.findOrders(day, to)
    }

    @Post("/inspections")
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
        List<OrderInspection> orderInspections = inspectionService.findOrderInspections(orders.openedOrders)
        List<OrderInspection> detectedAnomaliesOrderInspections = inspectionService.findDetectedAnomaliesInspections(
            orders.detectedAnomaliesOrders
        )
        return orderInspections + detectedAnomaliesOrderInspections

    }

    @Post("/savedInspections")
    @Operation(
        summary = "Obtiene las revisiones guardadas",
        description = "Obtiene las revisiones guardadas en base de datos"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Lista de revisiones guardadas",
        content = @Content(array = @ArraySchema(schema = @Schema(implementation = SavedInspection)))
    )
    List<SavedInspection> findSavedInspections(@Body List<Integer> orders) {
        return savedInspectionDataService.findAll(orders)
    }

    @Get("/articleItems")
    @Operation(
        summary = "Obtiene la relación entre artículos e items",
        description = "Obtiene la relación entre artículos e items"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Lista de artículos e items",
        content = @Content(array = @ArraySchema(schema = @Schema(implementation = ItemVehicleArticleCode)))
    )
    List<ItemVehicleArticleCode> findArticleItems() {
        return itemVehicleArticleCodeDataService.findAll()
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
    HttpResponse<List<BudgetNotification>> findBudgetNotifications(@QueryValue List<Integer> orderNumbers) {
        return HttpResponse.ok(budgetNotificationDataService.findAll(orderNumbers))
    }

    @Get("/image")
    @Operation(
        summary = "Obtiene una imágen",
        description = "Obtiene una imágen"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Imagen obtenida correctamente",
        content = @Content(schema = @Schema(implementation = Image))
    )
    Image findImage(@QueryValue int id) {
        return imageDataService.get(id)
    }

    @Get("/images")
    @Operation(
        summary = "Obtiene una lista de imágenes",
        description = "Obtiene una lista de imágenes"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Imagen obtenida correctamente",
        content = @Content(array = @ArraySchema(schema = @Schema(implementation = Image)))
    )
    List<Image> findImages(@QueryValue List<Long> ids) {
        return imageDataService.getAll(ids)
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
        budgetNotificationDataService.update(budgetNotification.orderNumber, budgetNotification.itemCode)
    }

    @Patch("/savedInspection")
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

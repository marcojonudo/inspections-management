package inspections.management.tasks

import groovy.transform.CompileStatic
import inspections.management.domains.SavedInspection
import inspections.management.domains.fviberi.Order
import inspections.management.pogos.OrderInspection
import inspections.management.pogos.RealTimePublisher
import inspections.management.pogos.realTime.RealTimeOrders
import inspections.management.services.InspectionService
import inspections.management.services.data.SavedInspectionDataService
import io.micronaut.scheduling.annotation.Scheduled
import org.slf4j.Logger
import org.slf4j.LoggerFactory

import javax.inject.Inject
import java.time.LocalDate

@CompileStatic
class SyncOrdersTask {

    private static final Logger LOG = LoggerFactory.getLogger(SyncOrdersTask)

    @Inject private InspectionService inspectionService
    @Inject private SavedInspectionDataService savedInspectionDataService

    @Scheduled(cron = "\${cron.sync-orders}")
    void execute() {
        List<Order> orders = inspectionService.findOrders(LocalDate.now(), false)
        List<SavedInspection> savedInspections = savedInspectionDataService.findAllSavedInspections(
            orders.number as List<Integer>
        )
        List<Order> detectedAnomaliesOrders = savedInspections
            .findAll { !it.orderInspection }
            .collect { SavedInspection savedInspection ->
                orders.find { it.number == savedInspection.orderNumber }
            }

        List<OrderInspection> orderInspections = inspectionService.findOrderInspections(orders).findAll {
            it.inspectionVehicle
        } + inspectionService.findDetectedAnomaliesInspections(detectedAnomaliesOrders)
        RealTimePublisher.send(new RealTimeOrders(orderInspections))
    }

}

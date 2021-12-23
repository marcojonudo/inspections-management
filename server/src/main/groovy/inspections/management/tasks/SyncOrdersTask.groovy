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
import java.time.LocalTime
import java.time.temporal.ChronoUnit

@CompileStatic
class SyncOrdersTask {

    private static final Logger LOG = LoggerFactory.getLogger(SyncOrdersTask)

    @Inject private InspectionService inspectionService
    @Inject private SavedInspectionDataService savedInspectionDataService

    @Scheduled(cron = "\${cron.sync-orders}")
    void execute() {
        LocalTime refTime = LocalTime.now()
        List<Order> orders = inspectionService.findOrders(LocalDate.now())
        List<SavedInspection> savedInspections = savedInspectionDataService.findAll(orders.collect { it.number })
        List<Order> detectedAnomaliesOrders = savedInspections
            .findAll { !it.orderInspection }
            .collect { SavedInspection savedInspection ->
                orders.find { it.number == savedInspection.orderNumber }
            }
        List<Order> orderInspectionOrders = orders.findAll { !(it.number in detectedAnomaliesOrders.number) }

        List<OrderInspection> orderInspections = inspectionService.findOrderInspections(orderInspectionOrders) +
            inspectionService.findDetectedAnomaliesInspections(detectedAnomaliesOrders)
//        orderInspections.each { OrderInspection orderInspection ->
//            orderInspection.savedInspection = savedInspections.find { it.orderNumber == orderInspection.order.number }
//        }
        LOG.info("Sync JPDV task: ${ChronoUnit.MILLIS.between(refTime, LocalTime.now())}")
        RealTimePublisher.send(new RealTimeOrders(orderInspections))
    }

}

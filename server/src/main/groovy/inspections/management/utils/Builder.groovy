package inspections.management.utils

import groovy.transform.CompileStatic
import inspections.management.domains.InspectionVehicle
import inspections.management.domains.items.Item

@CompileStatic
class Builder {

    static InspectionVehicle buildInspectionVehicle(InspectionVehicle inspectionVehicle, List<Item> items) {
        items.each {
            it.vehicleData = it.vehicleDataList.find { it.vehicle == inspectionVehicle.vehicle }
        }
        return new InspectionVehicle(
            inspectionVehicle.inspectionType, inspectionVehicle.vehicle, items.toSet()
        )
    }

}

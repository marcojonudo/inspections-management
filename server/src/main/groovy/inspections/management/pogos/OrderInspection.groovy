package inspections.management.pogos

import groovy.transform.CompileStatic
import groovy.transform.TupleConstructor
import inspections.management.domains.InspectionVehicle
import inspections.management.domains.SavedInspection
import inspections.management.domains.fviberi.Order

@TupleConstructor
@CompileStatic
class OrderInspection {

    Order order
    InspectionVehicle inspectionVehicle
    SavedInspection savedInspection

}

package inspections.management.pogos

import groovy.transform.CompileStatic
import groovy.transform.TupleConstructor
import inspections.management.domains.Inspection
import inspections.management.domains.ItemBudget
import inspections.management.domains.SavedInspection
import inspections.management.domains.fviberi.Order

@TupleConstructor
@CompileStatic
class OrderInspection {

    Order order
    Inspection inspection
    SavedInspection.State state = SavedInspection.State.PENDING
    List<ItemBudget> itemBudgets

}

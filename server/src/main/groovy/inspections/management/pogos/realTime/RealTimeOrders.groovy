package inspections.management.pogos.realTime

import com.fasterxml.jackson.annotation.JsonInclude
import groovy.transform.CompileStatic
import inspections.management.pogos.OrderInspection

@CompileStatic
class RealTimeOrders extends RealTimeInfo {

	@JsonInclude
	List<OrderInspection> orderInspections

    RealTimeOrders(List<OrderInspection> orderInspections) {
		super(Type.ORDER_INSPECTIONS)
		this.orderInspections = orderInspections
	}

}

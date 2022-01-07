package inspections.management.pogos.realTime

import groovy.transform.CompileStatic
import groovy.transform.TupleConstructor

@TupleConstructor
@CompileStatic
class RealTimeInfo {

	Type type

	enum Type {

        ORDER_INSPECTIONS,
        SAVED_INSPECTION

	}

}

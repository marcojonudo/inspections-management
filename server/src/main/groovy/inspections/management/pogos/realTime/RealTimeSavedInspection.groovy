package inspections.management.pogos.realTime

import com.fasterxml.jackson.annotation.JsonInclude
import groovy.transform.CompileStatic
import inspections.management.domains.SavedInspection

@CompileStatic
class RealTimeSavedInspection extends RealTimeInfo {

	@JsonInclude
	SavedInspection savedInspection

	RealTimeSavedInspection(SavedInspection savedInspection) {
		super(Type.SAVED_INSPECTION)
		this.savedInspection = savedInspection
	}

}

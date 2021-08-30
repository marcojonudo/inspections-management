package inspections.management.domains

import com.fasterxml.jackson.annotation.JsonIgnore
import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class InspectionInternalCode implements GormEntity<InspectionInternalCode> {

	@JsonIgnore
	Inspection inspection
	int code

}

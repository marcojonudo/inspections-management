package inspections.management.domains

import com.fasterxml.jackson.annotation.JsonIgnore
import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class ArticleCodeInspection implements GormEntity<ArticleCodeInspection> {

	int articleCode

	@JsonIgnore
	InspectionVehicle inspectionVehicle

}

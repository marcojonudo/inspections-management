package inspections.management.domains

import com.fasterxml.jackson.annotation.JsonIgnore
import grails.gorm.annotation.Entity
import groovy.transform.TupleConstructor
import inspections.management.domains.items.Item
import org.grails.datastore.gorm.GormEntity

@Entity
@TupleConstructor
class InspectionVehicle implements GormEntity<InspectionVehicle> {

	InspectionType inspectionType
	String vehicle
	Set<Item> items

	@JsonIgnore
	Set<ArticleCodeInspection> articleCodes

	static hasMany = [items: Item, articleCodes: ArticleCodeInspection]

	static mapping = {
		inspectionType lazy: false
		items fetch: 'join'
		articleCodes fetch: 'join'
	}

}

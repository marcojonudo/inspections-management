package inspections.management.domains

import com.fasterxml.jackson.annotation.JsonIgnore
import grails.gorm.annotation.Entity
import groovy.transform.TupleConstructor
import inspections.management.domains.items.Item
import org.grails.datastore.gorm.GormEntity

@Entity
@TupleConstructor
class Inspection implements GormEntity<Inspection> {

	String code
	String name

	@JsonIgnore
	Set<Item> items

	static hasMany = [items: Item, internalCodes: InspectionInternalCode]

	static constraints = {
		code maxSize: 15
		name maxSize: 45
	}

	static mapping = {
		items fetch: 'join'
	}

}

package inspections.management.domains.items

import com.fasterxml.jackson.annotation.JsonIgnore
import grails.gorm.annotation.Entity
import inspections.management.domains.Inspection
import org.grails.datastore.gorm.GormEntity

@Entity
class Item implements GormEntity<Item> {

	Type type
	String code

	@JsonIgnore
	Set<Inspection> inspections

	static hasMany = [inspections: Inspection]

	static belongsTo = Inspection

	static constraints = {
		type maxSize: 25
	}

	static mapping = {
		tablePerHierarchy false
	}

	enum Type {

		TEXT,
		SELECT,
		TEXT_AREA

	}

}

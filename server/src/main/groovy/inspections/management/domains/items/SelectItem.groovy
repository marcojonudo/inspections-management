package inspections.management.domains.items

import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class SelectItem extends Item implements GormEntity<SelectItem> {

	static hasMany = [options: SelectItemOption]

	static mapping = {
		options fetch: 'join', joinTable: [name: 'select_item_options']
	}

}

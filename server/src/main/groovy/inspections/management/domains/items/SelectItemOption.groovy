package inspections.management.domains.items

import com.fasterxml.jackson.annotation.JsonIgnore
import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class SelectItemOption implements GormEntity<SelectItemOption> {

	String code
	String name
	String icon
	String printIcon
	int order

	@JsonIgnore
	Set<SelectItem> items

	static hasMany = [items: SelectItem]
	static belongsTo = SelectItem

	static mapping = {
		order column: '`order`'
		items joinTable: [name: 'select_item_options', key: 'option_id']
	}

}

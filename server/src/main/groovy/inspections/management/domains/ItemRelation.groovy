package inspections.management.domains

import com.fasterxml.jackson.annotation.JsonIgnore
import grails.gorm.annotation.Entity
import inspections.management.domains.items.Item
import org.grails.datastore.gorm.GormEntity

@Entity
class ItemRelation implements GormEntity<ItemRelation> {

	@JsonIgnore
	Item item
	String matchText
	Item targetItem
	Action action

	static mapping = {
		targetItem fetch: 'join'
	}

	enum Action {

		HIDE,
		REPLICATE

	}

}

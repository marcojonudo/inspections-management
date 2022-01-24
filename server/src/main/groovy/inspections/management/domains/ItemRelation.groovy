package inspections.management.domains

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import grails.gorm.annotation.Entity
import inspections.management.deserializers.ItemDeserializer
import inspections.management.domains.items.Item
import org.grails.datastore.gorm.GormEntity

@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
class ItemRelation implements GormEntity<ItemRelation> {

	@JsonIgnore
	@JsonDeserialize(using = ItemDeserializer)
	Item item
	String matchText

	@JsonDeserialize(using = ItemDeserializer)
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

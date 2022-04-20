package inspections.management.domains


import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
class ItemRelation implements GormEntity<ItemRelation> {

	String itemCode
	String matchText
	String targetItemCode
	Action action

	enum Action {

		HIDE,
		REPLICATE

	}

}

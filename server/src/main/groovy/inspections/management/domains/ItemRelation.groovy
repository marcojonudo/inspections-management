package inspections.management.domains


import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
class ItemRelation implements GormEntity<ItemRelation> {

	String triggerType
	String triggerItemCode
	String matchText
	boolean differentMatchText
	String targetItemCode
	Action actionType
	String targetText

	enum Action {

		HIDE,
		SHOW,
		SET,
		REMOVE_TEXT

	}

}

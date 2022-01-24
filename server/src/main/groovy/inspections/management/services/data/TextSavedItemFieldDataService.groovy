package inspections.management.services.data

import grails.gorm.services.Query
import grails.gorm.services.Service
import inspections.management.domains.savedItems.TextSavedItem
import inspections.management.domains.savedItems.TextSavedItemField

@Service(TextSavedItemField)
interface TextSavedItemFieldDataService {

	@Query("""
		update ${TextSavedItemField field}
		set $field.text = $text
		where $field.textSavedItem = $textSavedItem and $field.order = $order
	""")
	Number update(TextSavedItem textSavedItem, int order, String text)

}

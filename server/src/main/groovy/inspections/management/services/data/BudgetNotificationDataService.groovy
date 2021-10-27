package inspections.management.services.data

import grails.gorm.services.Query
import grails.gorm.services.Service
import grails.gorm.services.Where
import inspections.management.domains.BudgetNotification

import java.time.LocalDateTime

@Service(BudgetNotification)
interface BudgetNotificationDataService {

	@Where({ orderNumber in orderNumbers })
	List<BudgetNotification> findAll(List<Integer> orderNumbers)

	BudgetNotification save(BudgetNotification budgetNotification)

	void delete(int orderNumber)

	@Query("""
		update ${BudgetNotification budgetNotification}
		set $budgetNotification.accepted = $accepted
		where $budgetNotification.orderNumber = $orderNumber and $budgetNotification.itemCode = $itemCode
	""")
	Number update(int orderNumber, String itemCode, LocalDateTime accepted)

}

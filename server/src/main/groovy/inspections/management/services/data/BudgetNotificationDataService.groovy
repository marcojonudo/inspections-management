package inspections.management.services.data


import grails.gorm.services.Service
import grails.gorm.services.Where
import inspections.management.domains.BudgetNotification

@Service(BudgetNotification)
interface BudgetNotificationDataService {

	@Where({ orderNumber in orderNumbers })
	List<BudgetNotification> findAll(List<Integer> orderNumbers)

	BudgetNotification save(BudgetNotification budgetNotification)

	void delete(int orderNumber)

}

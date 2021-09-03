package inspections.management.services.data

import grails.gorm.services.Service
import grails.gorm.services.Where
import grails.gorm.transactions.Transactional
import inspections.management.domains.fviberi.Budget
import inspections.management.utils.Constants

@Service(Budget)
@Transactional(connection = Constants.DataSource.FVIBERI)
interface BudgetDataService {

	@Where({ number in numbers })
	List<Budget> findAll(List<Integer> numbers)

}

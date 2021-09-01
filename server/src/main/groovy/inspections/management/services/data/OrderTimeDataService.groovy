package inspections.management.services.data


import grails.gorm.services.Service
import grails.gorm.services.Where
import grails.gorm.transactions.Transactional
import inspections.management.domains.fviberi.OrderTime
import inspections.management.utils.Constants

@Service(OrderTime)
@Transactional(connection = Constants.DataSource.FVIBERI)
interface OrderTimeDataService {

	@Where({ orderNumber in orderNumbers })
	List<OrderTime> findAll(List<Integer> orderNumbers)

}

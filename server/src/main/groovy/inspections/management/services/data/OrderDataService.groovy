package inspections.management.services.data

import grails.gorm.services.Service
import grails.gorm.services.Where
import grails.gorm.transactions.Transactional
import inspections.management.domains.fviberi.Order
import inspections.management.utils.Constants

import java.time.LocalDate

@Service(Order)
@Transactional(connection = Constants.DataSource.FVIBERI)
interface OrderDataService {

	@Where({ day == day && !(state in Constants.CLOSED_ORDER_STATES) })
	List<Order> findAll(LocalDate day)

}

package inspections.management.services.data

import grails.gorm.services.Service
import grails.gorm.transactions.Transactional
import inspections.management.domains.schedules.EmployeeData
import inspections.management.utils.Constants

@Service(EmployeeData)
@Transactional(connection = Constants.DataSource.SCHEDULES)
interface EmployeeDataDataService {

	List<EmployeeData> findAll()

}


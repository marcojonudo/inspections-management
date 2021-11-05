package inspections.management.services.data

import grails.gorm.services.Service
import grails.gorm.transactions.Transactional
import inspections.management.domains.fviberi.Centre
import inspections.management.utils.Constants

@Service(Centre)
@Transactional(connection = Constants.DataSource.FVIBERI)
interface CentreDataService {

	Centre find()

}

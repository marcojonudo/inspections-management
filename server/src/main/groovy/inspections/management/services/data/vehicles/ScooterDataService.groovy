package inspections.management.services.data.vehicles

import grails.gorm.services.Service
import grails.gorm.transactions.Transactional
import inspections.management.domains.fviberi.vehicle.Scooter
import inspections.management.utils.Constants

@Service(Scooter)
@Transactional(connection = Constants.DataSource.FVIBERI)
interface ScooterDataService {

	Scooter find(String serialNumber)

}

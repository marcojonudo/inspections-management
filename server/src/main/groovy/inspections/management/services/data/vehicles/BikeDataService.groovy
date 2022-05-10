package inspections.management.services.data.vehicles

import grails.gorm.services.Service
import grails.gorm.transactions.Transactional
import inspections.management.domains.fviberi.vehicle.Bike
import inspections.management.utils.Constants

@Service(Bike)
@Transactional(connection = Constants.DataSource.FVIBERI)
interface BikeDataService {

	Bike find(String serialNumber)

}

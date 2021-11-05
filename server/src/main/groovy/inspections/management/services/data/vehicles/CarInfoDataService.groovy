package inspections.management.services.data.vehicles

import grails.gorm.services.Service
import grails.gorm.transactions.Transactional
import inspections.management.domains.fviberi.vehicle.CarInfo
import inspections.management.utils.Constants

@Service(CarInfo)
@Transactional(connection = Constants.DataSource.FVIBERI)
interface CarInfoDataService {

	CarInfo find(String numberPlate)

}

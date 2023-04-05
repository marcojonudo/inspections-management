package inspections.management.services.data.vehicles

import grails.gorm.services.Service
import grails.gorm.transactions.Transactional
import inspections.management.domains.fviberi.vehicle.Car
import inspections.management.domains.fviberi.vehicle.CarInfo
import inspections.management.pogos.logs.Log
import inspections.management.utils.Constants
import inspections.management.utils.Utils
import org.slf4j.Logger
import org.slf4j.LoggerFactory

import javax.inject.Inject

@Service(Car)
@Transactional(connection = Constants.DataSource.FVIBERI)
abstract class CarDataService {

	private static final Logger LOG = LoggerFactory.getLogger(CarDataService)

	@Inject private CarInfoDataService carInfoDataService

	abstract Car findCar(String numberPlate)

	Car find(String numberPlate) {
		Car car = findCar(numberPlate)
		if (car) {
			CarInfo carInfo = carInfoDataService.find(numberPlate)
			if (carInfo) {
				car.engineCode = carInfo.engineCode
				try {
					car.power = carInfo.power ? Utils.kwToCv(carInfo.power as float) as String : carInfo.power
				} catch (all) {
					LOG.error(new Log((Map) [message: Constants.Message.CALC_POWER_ERROR, vehicleId: numberPlate]).toString(), all)
				}
			}
		}
		return car
	}

}

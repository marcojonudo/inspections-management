package inspections.management.services.data.vehicles

import grails.gorm.services.Service
import grails.gorm.transactions.Transactional
import inspections.management.domains.fviberi.vehicle.Car
import inspections.management.utils.Constants

import javax.inject.Inject

@Service(Car)
@Transactional(connection = Constants.DataSource.FVIBERI)
abstract class CarDataService {

	@Inject private CarInfoDataService carInfoDataService

	abstract Car findCar(String numberPlate)

	Car find(String numberPlate) {
		Car car = findCar(numberPlate)
		if (car) {
			car.extraInfo = carInfoDataService.find(numberPlate)
		}
		return car
	}

}

package inspections.management.services.data


import grails.gorm.services.Service
import inspections.management.domains.items.Item
import inspections.management.domains.items.ItemVehicleData

@Service(ItemVehicleData)
interface ItemVehicleDataDataService {

	Item find(String code)

}

package inspections.management.services.data


import grails.gorm.services.Service
import grails.gorm.services.Where
import inspections.management.domains.items.Item

@Service(Item)
interface ItemDataService {

    List<Item> findAll()

    @Where({ code in codes })
    List<Item> findAll(List<String> codes)

}

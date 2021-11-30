package inspections.management.services.data


import grails.gorm.services.Service
import grails.gorm.services.Where
import inspections.management.domains.Image

@Service(Image)
interface ImageDataService {

    Image get(Serializable id)

    @Where({ id in ids })
    List<Image> getAll(List<Long> ids)

}

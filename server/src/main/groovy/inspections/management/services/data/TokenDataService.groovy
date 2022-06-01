package inspections.management.services.data

import grails.gorm.services.Service
import inspections.management.domains.Token

@Service(Token)
interface TokenDataService {

	String findTokenToken()

}

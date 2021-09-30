package inspections.management.services.data

import grails.gorm.services.Service
import inspections.management.domains.Language

@Service(Language)
interface LanguageDataService {

	String findLanguageLang()

}

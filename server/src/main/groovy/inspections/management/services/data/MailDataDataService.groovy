package inspections.management.services.data

import grails.gorm.services.Service
import grails.gorm.transactions.Transactional
import inspections.management.domains.fviberi.MailData
import inspections.management.utils.Constants

@Service(MailData)
@Transactional(connection = Constants.DataSource.HESTIA_FVIBERI)
abstract class MailDataDataService {

	abstract MailData findMailData(String centreCode)

	MailData find(int centreCode) {
		return findMailData("$centreCode".padLeft(3, "0"))
	}
}

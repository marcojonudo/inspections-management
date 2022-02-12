package inspections.management.services.data

import grails.gorm.services.Query
import grails.gorm.services.Service
import grails.gorm.services.Where
import inspections.management.domains.SavedInspection
import inspections.management.domains.savedItems.SavedItem

import javax.inject.Inject
import java.time.LocalDate
import java.time.ZoneId

@Service(SavedInspection)
abstract class SavedInspectionDataService {

	@Inject SavedItemDataService savedItemDataService
	@Inject ItemVehicleDataDataService itemVehicleDataDataService

	abstract SavedInspection find(int orderNumber)

	abstract SavedInspection find(String numberPlate)

	@Where({ orderNumber in orderNumbers })
	abstract List<SavedInspection> findAll(List<Integer> orderNumbers)

	@Query("""
		select $savedInspection.orderNumber
		from ${SavedInspection savedInspection}
		where date(savedInspection.saved) = $day
	""")
	abstract List<Integer> findOrderNumbers(Date day)

	@Query("""
		select $savedInspection.orderNumber
		from ${SavedInspection savedInspection}
		where date(savedInspection.saved) >= $from and date(savedInspection.saved) < $to
	""")
	abstract List<Integer> findOrderNumbers(Date from, Date to)

	abstract SavedInspection update(Serializable id, SavedInspection.State state, String sellerCode)

	List<Integer> findOrderNumbers(LocalDate day) {
		return findOrderNumbers(Date.from(day.atStartOfDay(ZoneId.systemDefault()).toInstant()))
	}

	List<Integer> findOrderNumbers(LocalDate from, LocalDate to) {
		return findOrderNumbers(
			Date.from(from.atStartOfDay(ZoneId.systemDefault()).toInstant()),
			Date.from(to.atStartOfDay(ZoneId.systemDefault()).toInstant())
		)
	}

	SavedInspection update(SavedInspection savedInspection, SavedInspection existentSavedInspection) {
		savedInspection.items.each { SavedItem savedItem ->
			SavedItem existentSavedItem = existentSavedInspection.items.find { it.item.code == savedItem.item.code }
			if (!existentSavedItem) {
				fillSavedItem(savedItem, existentSavedInspection)
				savedItemDataService.save(savedItem)
			} else if (savedItem != existentSavedItem) {
				savedItemDataService.update(existentSavedItem, savedItem)
			}
		}
		SavedInspection.State state = SavedInspection.State.values().find {
			((Closure<Boolean>) it.check)(savedInspection.items)
		}
		return update(existentSavedInspection.id, state, savedInspection.sellerCode)
	}

	void fillSavedItem(SavedItem savedItem, SavedInspection savedInspection) {
		savedItem.savedInspection = savedInspection
		savedItem.item = itemVehicleDataDataService.find(savedItem.item.code)
	}

}

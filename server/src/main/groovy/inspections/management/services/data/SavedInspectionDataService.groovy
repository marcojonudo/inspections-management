package inspections.management.services.data

import grails.gorm.services.Query
import grails.gorm.services.Service
import grails.gorm.services.Where
import inspections.management.domains.SavedInspection

import java.time.LocalDate
import java.time.ZoneId

@Service(SavedInspection)
abstract class SavedInspectionDataService {

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

	List<Integer> findOrderNumbers(LocalDate day) {
		return findOrderNumbers(Date.from(day.atStartOfDay(ZoneId.systemDefault()).toInstant()))
	}

	List<Integer> findOrderNumbers(LocalDate from, LocalDate to) {
		return findOrderNumbers(
			Date.from(from.atStartOfDay(ZoneId.systemDefault()).toInstant()),
			Date.from(to.atStartOfDay(ZoneId.systemDefault()).toInstant())
		)
	}

}

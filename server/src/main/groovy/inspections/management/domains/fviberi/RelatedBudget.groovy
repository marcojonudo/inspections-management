package inspections.management.domains.fviberi


import com.fasterxml.jackson.annotation.JsonIgnore
import grails.gorm.annotation.Entity
import inspections.management.utils.Constants
import org.grails.datastore.gorm.GormEntity

@Entity
class RelatedBudget implements GormEntity<RelatedBudget> {

	@JsonIgnore
	Order order
	int number

	static mapping = {
		datasource Constants.DataSource.FVIBERI
		table 'fvpresor'

		order column: 'coordrep'
		number column: 'nupresup'

		id generator: 'assigned', name: 'number'
		version false
	}

}

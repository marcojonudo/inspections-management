package inspections.management.domains.fviberi

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import grails.gorm.annotation.Entity
import inspections.management.deserializers.BudgetLineDeserializer
import inspections.management.utils.Constants
import org.grails.datastore.gorm.GormEntity

@Entity
@JsonDeserialize(using = BudgetLineDeserializer)
class BudgetLine implements GormEntity<BudgetLine>, Serializable {

	@JsonIgnore
	Budget budget
	int line
	int articleCode

	static mapping = {
		datasource Constants.DataSource.FVIBERI
		table 'fvlinpto'

		budget column: 'nupresup'
		line column: 'nulinpto'
		articleCode column: 'coarticu'

		id composite: ['budget', 'line'], generator: 'assigned'
		version false
	}

	@Override
	boolean equals(Object object) {
		BudgetLine obj = (BudgetLine) object
		return this.budget.number == obj.budget.number && this.line == obj.line
	}

	@Override
	int hashCode() {
		return Objects.hash(budget.number, line)
	}

}

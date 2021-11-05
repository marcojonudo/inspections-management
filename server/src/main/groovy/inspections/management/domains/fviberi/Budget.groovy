package inspections.management.domains.fviberi


import grails.gorm.annotation.Entity
import inspections.management.utils.Constants
import org.grails.datastore.gorm.GormEntity

@Entity
class Budget implements GormEntity<Budget> {

	int number
	String state

	static hasMany = [lines: BudgetLine]

	static mapping = {
		datasource Constants.DataSource.FVIBERI
		table 'fvcabpto'

		number column: 'nupresup'
		state column: 'clsituac'
		lines fetch: 'join'

		id generator: 'assigned', name: 'number'
		version false
	}

}

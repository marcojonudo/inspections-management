package inspections.management.domains


import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class Language implements GormEntity<Language> {

	String lang

	static constraints = {
		lang maxSize: 5
	}

}

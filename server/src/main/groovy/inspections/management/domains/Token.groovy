package inspections.management.domains


import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class Token implements GormEntity<Token> {

	String token

}

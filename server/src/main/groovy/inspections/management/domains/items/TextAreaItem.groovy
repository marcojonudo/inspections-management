package inspections.management.domains.items


import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class TextAreaItem extends Item implements GormEntity<TextAreaItem> {

    boolean ownCategory

}

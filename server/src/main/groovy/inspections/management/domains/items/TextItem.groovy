package inspections.management.domains.items


import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class TextItem extends Item implements GormEntity<TextItem> {

    String placeholder

}

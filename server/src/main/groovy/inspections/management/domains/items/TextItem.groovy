package inspections.management.domains.items

import com.fasterxml.jackson.annotation.JsonInclude
import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class TextItem extends Item implements GormEntity<TextItem> {

    String unit

    @JsonInclude
    Set<TextItemField> fields

    static hasMany = [fields: TextItemField]

    static constraints = {
        unit nullable: true
    }

    static mapping = {
        fields fetch: 'join'
    }

}

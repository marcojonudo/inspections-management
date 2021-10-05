package inspections.management.domains.items

import com.fasterxml.jackson.annotation.JsonIgnore
import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class TextItemField implements GormEntity<TextItemField> {

    @JsonIgnore
    TextItem textItem

    String placeholder
    String prefix
    Integer maxLength
    int order

    static constraints = {
        placeholder nullable: true
        prefix nullable: true
        maxLength nullable: true
    }

    static mapping = {
        order column: '`order`'
    }

}

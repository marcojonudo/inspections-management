package inspections.management.domains.items

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
class TextItemField implements GormEntity<TextItemField> {

    @JsonIgnore
    TextItem textItem

    String placeholder
    String separator
    String prefix
    Integer maxLength
    int order

    static constraints = {
        placeholder nullable: true
        separator nullable: true
        prefix nullable: true
        maxLength nullable: true
    }

    static mapping = {
        order column: '`order`'
    }

}

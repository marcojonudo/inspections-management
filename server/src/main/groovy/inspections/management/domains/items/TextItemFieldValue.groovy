package inspections.management.domains.items

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
class TextItemFieldValue implements GormEntity<TextItemFieldValue> {

    @JsonIgnore
    TextItemField textItemField
    String value
    int order

    static mapping = {
        order column: '`order`'
    }

}

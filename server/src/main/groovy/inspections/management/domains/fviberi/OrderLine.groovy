package inspections.management.domains.fviberi

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import grails.gorm.annotation.Entity
import inspections.management.deserializers.OrderLineDeserializer
import inspections.management.utils.Constants
import org.grails.datastore.gorm.GormEntity

@Entity
@JsonDeserialize(using = OrderLineDeserializer)
class OrderLine implements GormEntity<OrderLine>, Serializable {

	@JsonIgnore
	Order order
	int line
	int articleCode
	String articleName
	float units

	static mapping = {
		datasource Constants.DataSource.FVIBERI
		table 'fvlinord'

		order column: 'nuordrep'
		line column: 'nulinord'
		articleCode column: 'coarticu'
		articleName column: 'noarticu'
		units column: 'caordrep'

		id composite: ['order', 'line'], generator: 'assigned'
		version false
	}

	@Override
	boolean equals(Object object) {
		OrderLine obj = (OrderLine) object
		return this.order.number == obj.order.number && this.line == obj.line
	}

	@Override
	int hashCode() {
		return Objects.hash(order.number, line)
	}

}

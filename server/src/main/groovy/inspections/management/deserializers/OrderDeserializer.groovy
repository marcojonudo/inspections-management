package inspections.management.deserializers

import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.core.JsonProcessingException
import com.fasterxml.jackson.databind.DeserializationContext
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.deser.std.StdDeserializer
import com.fasterxml.jackson.databind.node.ObjectNode
import groovy.transform.CompileStatic
import inspections.management.domains.fviberi.Order
import inspections.management.domains.fviberi.OrderLine

@CompileStatic
class OrderDeserializer extends StdDeserializer<Order> {

	OrderDeserializer() {
		this(null)
	}

    OrderDeserializer(Class<Order> clazz) {
		super(clazz)
	}

	@Override
	Order deserialize(JsonParser parser, DeserializationContext deserializationContext)
			throws IOException, JsonProcessingException {
		JsonNode node = (JsonNode) parser.getCodec().readTree(parser)
		Order order = new Order(number: node.get("number").asInt())
		order.lines = (node.get("lines").asList() as List<ObjectNode>).collect {
			new OrderLine(order: order, articleCode: it.get("articleCode").asInt())
		}.toSet()
		return order
	}

}

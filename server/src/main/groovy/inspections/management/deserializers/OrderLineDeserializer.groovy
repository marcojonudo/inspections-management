package inspections.management.deserializers

import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.core.JsonProcessingException
import com.fasterxml.jackson.databind.DeserializationContext
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.deser.std.StdDeserializer
import groovy.transform.CompileStatic
import inspections.management.domains.fviberi.Order
import inspections.management.domains.fviberi.OrderLine

@CompileStatic
class OrderLineDeserializer extends StdDeserializer<OrderLine> {

	OrderLineDeserializer() {
		this(null)
	}

	OrderLineDeserializer(Class<OrderLine> orderLineClass) {
		super(orderLineClass)
	}

	@Override
	OrderLine deserialize(JsonParser parser, DeserializationContext deserializationContext)
			throws IOException, JsonProcessingException {
		JsonNode node = (JsonNode) parser.getCodec().readTree(parser)
		int orderNumber = node.get("orderNumber").asInt()
		int line = node.get("line").asInt()
		int articleCode = node.get("articleCode").asInt()
		return new OrderLine(order: new Order(number: orderNumber), line: line, articleCode: articleCode)
	}

}

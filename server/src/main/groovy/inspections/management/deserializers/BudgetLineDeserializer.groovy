package inspections.management.deserializers

import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.core.JsonProcessingException
import com.fasterxml.jackson.databind.DeserializationContext
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.deser.std.StdDeserializer
import groovy.transform.CompileStatic
import inspections.management.domains.fviberi.Budget
import inspections.management.domains.fviberi.BudgetLine

@CompileStatic
class BudgetLineDeserializer extends StdDeserializer<BudgetLine> {

	BudgetLineDeserializer() {
		this(null)
	}

    BudgetLineDeserializer(Class<BudgetLine> clazz) {
		super(clazz)
	}

	@Override
	BudgetLine deserialize(JsonParser parser, DeserializationContext deserializationContext)
			throws IOException, JsonProcessingException {
		JsonNode node = (JsonNode) parser.getCodec().readTree(parser)
		int budgetNumber = node.get("budgetNumber").asInt()
		int line = node.get("line").asInt()
		int articleCode = node.get("articleCode").asInt()
		Float units = (Float) node.get("units")?.asDouble()
		Float price = (Float) node.get("price")?.asDouble()
		return new BudgetLine(
			budget: new Budget(number: budgetNumber), line: line, articleCode: articleCode, units: units, price: price
		)
	}

}

package inspections.management.deserializers

import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.core.JsonProcessingException
import com.fasterxml.jackson.databind.DeserializationContext
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.deser.std.StdDeserializer
import groovy.transform.CompileStatic
import inspections.management.domains.items.Item
import inspections.management.domains.savedItems.SavedItem
import inspections.management.pogos.logs.Jackson

@CompileStatic
class ItemDeserializer extends StdDeserializer<Item> {

	ItemDeserializer() {
		this(null)
	}

    ItemDeserializer(Class<SavedItem> savedItemClass) {
		super(savedItemClass)
	}

	@Override
	Item deserialize(JsonParser parser, DeserializationContext deserializationContext)
			throws IOException, JsonProcessingException {
		JsonNode node = (JsonNode) parser.getCodec().readTree(parser)
		Item.Type type = Item.Type.valueOf(node.get("type").asText())
		return (Item) Jackson.convertValue(node, type.clazz)
	}

}

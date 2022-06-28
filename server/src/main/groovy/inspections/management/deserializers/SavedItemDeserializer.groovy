package inspections.management.deserializers

import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.core.JsonProcessingException
import com.fasterxml.jackson.databind.DeserializationContext
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.deser.std.StdDeserializer
import com.fasterxml.jackson.databind.node.ArrayNode
import groovy.transform.CompileStatic
import inspections.management.domains.items.Item
import inspections.management.domains.savedItems.SavedItem
import inspections.management.domains.savedItems.SavedItemData
import inspections.management.pogos.logs.Jackson

@CompileStatic
class SavedItemDeserializer extends StdDeserializer<SavedItem> {

	SavedItemDeserializer() {
		this(null)
	}

	SavedItemDeserializer(Class<SavedItem> clazz) {
		super(clazz)
	}

	@Override
	SavedItem deserialize(JsonParser parser, DeserializationContext deserializationContext)
		throws IOException, JsonProcessingException {
		JsonNode node = (JsonNode) parser.getCodec().readTree(parser)
		Item.Type type = Item.Type.valueOf(node.get("type").asText())
		List<SavedItemData> data = ((ArrayNode) node.get("data")).collect {
			(SavedItemData) Jackson.convertValue(it, type.savedItemDataClazz)
		}
		return new SavedItem(
			type,
			node.get("code").asText(),
			data.toSet()
		)
	}

}

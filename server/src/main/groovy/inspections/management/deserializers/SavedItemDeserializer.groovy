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
class SavedItemDeserializer extends StdDeserializer<SavedItem> {

	SavedItemDeserializer() {
		this(null)
	}

    SavedItemDeserializer(Class<SavedItem> savedItemClass) {
		super(savedItemClass)
	}

	@Override
	SavedItem deserialize(JsonParser parser, DeserializationContext deserializationContext)
			throws IOException, JsonProcessingException {
		JsonNode node = (JsonNode) parser.getCodec().readTree(parser)
		Item.Type type = Item.Type.valueOf(node.get("item").get("type").asText())
		SavedItem savedItem = ((Closure<SavedItem>) type.buildSavedItem)(Jackson.convertValue(node))
		return savedItem
	}

}

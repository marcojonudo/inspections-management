package inspections.management.deserializers

import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.core.JsonProcessingException
import com.fasterxml.jackson.databind.DeserializationContext
import com.fasterxml.jackson.databind.deser.std.StdDeserializer
import com.fasterxml.jackson.databind.node.ArrayNode
import groovy.transform.CompileStatic
import inspections.management.domains.items.Item
import inspections.management.domains.savedItems.SavedItem
import inspections.management.pogos.logs.Jackson

@CompileStatic
class SavedItemsDeserializer extends StdDeserializer<List<SavedItem>> {

	SavedItemsDeserializer() {
		this(null)
	}

	SavedItemsDeserializer(Class<SavedItem> savedItemClass) {
		super(savedItemClass)
	}

	@Override
	List<SavedItem> deserialize(JsonParser parser, DeserializationContext deserializationContext)
		throws IOException, JsonProcessingException {
		ArrayNode node = (ArrayNode) parser.getCodec().readTree(parser)
		List<SavedItem> savedItems = node.collect {
			Item.Type type = Item.Type.valueOf(it.get("type").asText())
			return (SavedItem) Jackson.convertValue(it, type.savedItemClazz)
		}
		return savedItems
	}

}

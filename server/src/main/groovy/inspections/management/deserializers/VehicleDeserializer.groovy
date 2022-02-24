package inspections.management.deserializers

import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.core.JsonProcessingException
import com.fasterxml.jackson.databind.DeserializationContext
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.deser.std.StdDeserializer
import groovy.transform.CompileStatic
import inspections.management.domains.fviberi.vehicle.IVehicle
import inspections.management.pogos.logs.Jackson
import inspections.management.pogos.vehicles.Vehicle

@CompileStatic
class VehicleDeserializer extends StdDeserializer<Vehicle> {

	VehicleDeserializer() {
		this(null)
	}

    VehicleDeserializer(Class<Vehicle> clazz) {
		super(clazz)
	}

	@Override
	Vehicle deserialize(JsonParser parser, DeserializationContext deserializationContext)
		throws IOException, JsonProcessingException {
		JsonNode node = (JsonNode) parser.getCodec().readTree(parser)
		IVehicle.Type type = IVehicle.Type.valueOf(node.get("type").asText())
		return (Vehicle) Jackson.convertValue(node, type.clazz)
	}

}

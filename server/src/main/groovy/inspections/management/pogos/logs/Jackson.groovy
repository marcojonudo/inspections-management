package inspections.management.pogos.logs

import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.CompileStatic

@CompileStatic
class Jackson {

	static ObjectMapper mapper

	static ObjectMapper getMapper() {
		mapper = mapper ?: new ObjectMapper()
		return mapper
	}

	static Object convertValue(Object object, Class clazz = Object) {
		return getMapper().convertValue(object, clazz)
	}

	static String writeValueAsString(Object object) {
		return getMapper().writeValueAsString(object)
	}

}

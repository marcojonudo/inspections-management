package inspections.management.utils

import groovy.transform.CompileStatic
import inspections.management.domains.items.Item

@CompileStatic
class Utils {

	static Item findItem(String itemCode, List<Item> items) {
		return items.find { it.code == itemCode }
	}

	static float kwToCv(float power) {
		return power * Constants.KW_TO_CV_FACTOR
	}


}

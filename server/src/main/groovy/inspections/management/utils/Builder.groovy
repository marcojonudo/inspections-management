package inspections.management.utils

import groovy.transform.CompileStatic
import inspections.management.domains.InspectionVehicle
import inspections.management.domains.ItemCategory
import inspections.management.domains.items.Item
import inspections.management.domains.savedItems.SavedItem
import inspections.management.domains.savedItems.SelectSavedItem
import inspections.management.domains.savedItems.TextSavedItem

import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

@CompileStatic
class Builder {

    static InspectionVehicle buildInspectionVehicle(
        InspectionVehicle inspectionVehicle, List<Item> items, boolean orderInspection = true
    ) {
        items.each {
            it.vehicleData = it.vehicleDataList.find { it.vehicle == inspectionVehicle.vehicle }
        }
        return new InspectionVehicle(
            inspectionVehicle.inspectionType, inspectionVehicle.vehicle, items.toSet(), orderInspection
        )
    }

    static TextSavedItem buildTextSavedItem(Map<String, Object> item) {
        TextSavedItem savedItem = new TextSavedItem(text: (String) item.text)
        return (TextSavedItem) fillSavedItem(savedItem, item)
    }

    static SelectSavedItem buildSelectSavedItem(Map<String, Object> item) {
        SelectSavedItem savedItem = new SelectSavedItem(value: (String) item.value)
        return (SelectSavedItem) fillSavedItem(savedItem, item)
    }

    private static fillSavedItem(SavedItem savedItem, Map<String, Object> item) {
        Map<String, Object> category = (Map<String, Object>) ((Map<String, Object>) item.item).category
        savedItem.item = new Item(
            type: Item.Type.valueOf((String) ((Map<String, Object>) item.item).type),
            code: (String) ((Map<String, Object>) item.item).code,
            category: category ? new ItemCategory(code: (String) category.code, name: (String) category.name) : null,
            required: (boolean) ((Map<String, Object>) item.item).required,
        )
        savedItem.employeeCode = item.employeeCode
        savedItem.sellerCode = item.sellerCode
        savedItem.hidden = item.hidden
        savedItem.filled = (LocalDateTime) (item.filled ? LocalDateTime.parse(
            (String) item.filled, DateTimeFormatter.ofPattern(Constants.DateTimeFormat.yyyy_MM_dd_HH_mm_ss)
        ) : null)
        return savedItem
    }

}

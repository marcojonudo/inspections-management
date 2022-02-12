package inspections.management.pogos.pdf

import groovy.transform.CompileStatic
import inspections.management.domains.ItemCategory
import inspections.management.domains.savedItems.SavedItem

@CompileStatic
class CategoryItems {

    ItemCategory category
    List<SavedItem> items

    CategoryItems(SavedItem savedItem, ItemCategory category = null) {
        this.category = category
        this.items = [savedItem]
    }

}

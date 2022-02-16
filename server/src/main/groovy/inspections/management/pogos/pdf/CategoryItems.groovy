package inspections.management.pogos.pdf

import groovy.transform.CompileStatic
import inspections.management.domains.ItemCategory
import inspections.management.domains.savedItems.SavedItem
import inspections.management.utils.Constants

@CompileStatic
class CategoryItems {

    ItemCategory category
    List<SavedItem> items
    List<List<SavedItem>> rows = []

    CategoryItems(List<SavedItem> savedItems, ItemCategory category = null) {
        this.category = category
        this.items = savedItems
        this.items.collate(Constants.ROW_IMAGES).each {
            this.rows << it
        }
    }

    void addItem(SavedItem savedItem) {
        this.items << savedItem
        if (this.items.size() > Constants.ROW_IMAGES) {
            this.rows << [savedItem]
        } else {
            this.rows.last() << savedItem
        }
    }

    CategoryItems clone(List<SavedItem> savedItems) {
        return new CategoryItems(savedItems, category)
    }

}

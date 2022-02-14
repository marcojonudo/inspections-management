package inspections.management.pogos.pdf.inspection.cards

import groovy.transform.CompileStatic
import inspections.management.domains.savedItems.SavedItem
import inspections.management.pogos.pdf.inspection.cards.title.CardTitle
import inspections.management.pogos.pdf.structure.cards.ItemCard

@CompileStatic
class ItemCategoryCard extends ItemCard {

    ItemCategoryCard(SavedItem savedItem) {
        super(
            new CardTitle("img/icons/right-arrow.svg", savedItem.item.name),
            savedItem.findValue()
        )
        this.classes.addAll(["category", "item-category"])
    }

}

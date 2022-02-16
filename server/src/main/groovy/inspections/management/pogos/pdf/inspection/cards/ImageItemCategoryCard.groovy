package inspections.management.pogos.pdf.inspection.cards

import groovy.transform.CompileStatic
import inspections.management.domains.savedItems.SavedItem
import inspections.management.pogos.pdf.inspection.cards.title.CardTitle
import inspections.management.pogos.pdf.inspection.items.PdfImageItem
import inspections.management.pogos.pdf.structure.cards.ImagesCard
import inspections.management.pogos.pdf.structure.elements.PdfItem
import inspections.management.pogos.pdf.structure.elements.Title

@CompileStatic
class ImageItemCategoryCard extends ImagesCard {

    ImageItemCategoryCard(SavedItem savedItem) {
        super(
            ((Title) new CardTitle("img/icons/right-arrow.svg", savedItem.item.name)),
            [((PdfItem) new PdfImageItem(savedItem, false))]
        )
        this.classes.addAll(["category", "image-category"])
    }

}

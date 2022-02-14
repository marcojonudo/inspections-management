package inspections.management.pogos.pdf.inspection.cards

import groovy.transform.CompileStatic
import inspections.management.pogos.pdf.CategoryItems
import inspections.management.pogos.pdf.inspection.cards.title.CardTitle
import inspections.management.pogos.pdf.inspection.items.PdfImageItem
import inspections.management.pogos.pdf.structure.cards.ImagesCard
import inspections.management.pogos.pdf.structure.elements.items.PdfItem

@CompileStatic
class ImageCategoryCard extends ImagesCard {

    ImageCategoryCard(CategoryItems categoryItems) {
        super(
            new CardTitle("img/icons/right-arrow.svg", categoryItems.category.name),
            categoryItems.items.sort { it.item.printOrder }.collect { (PdfItem) new PdfImageItem(it) }
        )
        this.classes.addAll(["category", "image-category"])
    }

}

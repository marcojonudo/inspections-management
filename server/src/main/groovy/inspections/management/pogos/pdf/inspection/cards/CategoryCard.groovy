package inspections.management.pogos.pdf.inspection.cards

import groovy.transform.CompileStatic
import groovy.transform.TupleConstructor
import inspections.management.pogos.pdf.CategoryItems
import inspections.management.pogos.pdf.inspection.cards.title.CardTitle
import inspections.management.pogos.pdf.structure.cards.RowsCard

@CompileStatic
@TupleConstructor
class CategoryCard extends RowsCard {

    CategoryCard(CategoryItems categoryItems) {
        super(
            new CardTitle("img/icons/right-arrow.svg", categoryItems.category.name),
            categoryItems.items.sort { it.item.printOrder }.collect { it.buildPdfItem() }
        )
        this.classes << "category"
    }

}

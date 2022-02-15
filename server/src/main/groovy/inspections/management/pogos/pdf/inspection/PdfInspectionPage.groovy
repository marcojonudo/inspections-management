package inspections.management.pogos.pdf.inspection

import groovy.transform.CompileStatic
import inspections.management.domains.SavedInspection
import inspections.management.domains.fviberi.Centre
import inspections.management.domains.fviberi.Order
import inspections.management.pogos.pdf.CategoryItems
import inspections.management.pogos.pdf.inspection.cards.CategoryCard
import inspections.management.pogos.pdf.inspection.cards.ImageCategoryCard
import inspections.management.pogos.pdf.inspection.cards.ImageItemCategoryCard
import inspections.management.pogos.pdf.inspection.cards.ItemCategoryCard
import inspections.management.pogos.pdf.inspection.header.PdfHeader
import inspections.management.pogos.pdf.structure.IPdf
import inspections.management.pogos.pdf.structure.cards.Card

@CompileStatic
class PdfInspectionPage extends IPdf {

    PdfHeader header
    List<Card> categories
    Order.VehicleType vehicleType

    PdfInspectionPage(
        Centre centre,
        Order order,
        String inspectionName,
        SavedInspection savedInspection,
        List<CategoryItems> categories,
        boolean images = false
    ) {
        classes = ["page"]
        this.vehicleType = Order.VehicleType.values().find { it.type == order.vehicleType } ?:
            Order.VehicleType.CAR
        header = new PdfHeader(centre, order, inspectionName, savedInspection, this.vehicleType)
        if (images) {
            this.categories = categories.collect {
                (Card) (it.category ? new ImageCategoryCard(it) : new ImageItemCategoryCard(it.items[0]))
            }
        } else {
            this.categories = categories.collect {
                it.category ? new CategoryCard(it) : new ItemCategoryCard(it.items[0])
            }
        }
    }

    String toHtml() {
        return """
            <div class="${findClasses()}">
                ${header.toHtml()}
                <div class="categories-container" style="background-image: url(img/backgrounds/${vehicleType.backgroundImage})">
                    ${categories.collect { it.toHtml() }.join("\n")}
                </div>
            </div>
        """
    }

}

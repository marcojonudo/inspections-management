package inspections.management.pogos.pdf.inspection.pages

import groovy.transform.CompileStatic
import inspections.management.domains.SavedInspection
import inspections.management.domains.fviberi.Order
import inspections.management.pogos.pdf.CategoryItems
import inspections.management.pogos.pdf.inspection.cards.CategoryCard
import inspections.management.pogos.pdf.inspection.cards.ItemCategoryCard
import inspections.management.pogos.pdf.inspection.header.PdfHeader
import inspections.management.utils.Constants

@CompileStatic
class ItemsPage extends PdfInspectionPage {

    ItemsPage(
        PdfHeader header,
        SavedInspection savedInspection,
        List<CategoryItems> categories,
        Order.VehicleType vehicleType,
        boolean onePage
    ) {
        super(header, vehicleType, onePage)
        /* Si la revisión es de neumáticos, no se hace un page-break para que las imágenes salgan en la misma hoja */
        this.classes = savedInspection.inspectionTypeCode == Constants.InspectionType.N ? (List<String>) [] : this.classes
        this.categories = categories.collect { it.category ? new CategoryCard(it) : new ItemCategoryCard(it.items[0])}
    }

}

package inspections.management.pogos.pdf.inspection.pages

import groovy.transform.CompileStatic
import inspections.management.domains.SavedInspection
import inspections.management.domains.fviberi.Order.VehicleType
import inspections.management.pogos.pdf.CategoryItems
import inspections.management.pogos.pdf.inspection.cards.ImageCategoryCard
import inspections.management.pogos.pdf.inspection.cards.ImageItemCategoryCard
import inspections.management.pogos.pdf.inspection.header.PdfHeader
import inspections.management.pogos.pdf.structure.cards.Card
import inspections.management.utils.Constants

@CompileStatic
class ImagesPage extends PdfInspectionPage {

    ImagesPage(
        PdfHeader header, SavedInspection savedInspection, List<CategoryItems> categories, VehicleType vehicleType
    ) {
        super(header, vehicleType)
        this.categories = categories.collect {
            (Card) (it.category ? new ImageCategoryCard(it) : new ImageItemCategoryCard(it.items[0]))
        }
        /* La hoja de imágenes de la revisión de neumáticos se muestra en la primera página junto con los items, por lo
         * que en este caso no se pinta el cabecero */
        this.printHeader = savedInspection.inspectionTypeCode != Constants.InspectionType.N
    }

}

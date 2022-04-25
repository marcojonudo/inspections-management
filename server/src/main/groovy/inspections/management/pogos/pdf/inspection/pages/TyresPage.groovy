package inspections.management.pogos.pdf.inspection.pages

import groovy.transform.CompileStatic
import inspections.management.domains.SavedInspection
import inspections.management.domains.fviberi.Order.VehicleType
import inspections.management.domains.items.SelectItemOption
import inspections.management.domains.savedItems.SavedItem
import inspections.management.pogos.pdf.CategoryItems
import inspections.management.pogos.pdf.inspection.cards.TyresCard
import inspections.management.pogos.pdf.inspection.header.PdfHeader
import inspections.management.pogos.pdf.structure.cards.Card
import inspections.management.utils.Constants

@CompileStatic
class TyresPage extends PdfInspectionPage {

    TyresPage(
        PdfHeader header,
        SavedInspection savedInspection,
        List<CategoryItems> categories,
        VehicleType vehicleType,
        List<SelectItemOption> options
    ) {
        super(header, vehicleType, false)
        SavedItem visualControlSavedItem = savedInspection.items.find { it.code == Constants.ItemCode.CVGN }
        SavedItem measurementSavedItem = savedInspection.items.find { it.code == Constants.ItemCode.PN }
        SavedItem pressureSavedItem = savedInspection.items.find { it.code == Constants.ItemCode.PPN }
        this.categories = [
            (Card) new TyresCard(categories, visualControlSavedItem, measurementSavedItem, pressureSavedItem, options)
        ]
        this.tyrePage = true
    }

}

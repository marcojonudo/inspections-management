package inspections.management.pogos.pdf.inspection

import groovy.transform.CompileStatic
import inspections.management.domains.SavedInspection
import inspections.management.domains.fviberi.Centre
import inspections.management.domains.fviberi.Order
import inspections.management.domains.items.SelectItemOption
import inspections.management.pogos.pdf.CategoryItems
import inspections.management.pogos.pdf.inspection.header.PdfHeader
import inspections.management.pogos.pdf.inspection.pages.ImagesPage
import inspections.management.pogos.pdf.inspection.pages.ItemsPage
import inspections.management.pogos.pdf.inspection.pages.PdfInspectionPage
import inspections.management.pogos.pdf.inspection.pages.TyresPage
import inspections.management.pogos.pdf.structure.IPdf
import inspections.management.utils.Constants

@CompileStatic
class PdfInspection extends IPdf {

    List<PdfInspectionPage> pages = []

    PdfInspection(
        Centre centre,
        Order order,
        String inspectionName,
        SavedInspection savedInspection,
        List<CategoryItems> tyreCategories,
        List<List<CategoryItems>> groupedCategories,
        List<List<CategoryItems>> groupedImageCategories,
        List<SelectItemOption> options
    ) {
        Order.VehicleType vehicleType = Order.VehicleType.values().find { it.type == order.vehicleType } ?:
            Order.VehicleType.CAR
        PdfHeader header = new PdfHeader(centre, order, inspectionName, savedInspection, vehicleType)

        /* Si en una revisión de neumáticos no hay hoja de neumáticos, pero sí imágenes, debe haber una sola página */
        boolean onePage = savedInspection.inspectionTypeCode ==
            Constants.InspectionType.N && !tyreCategories && groupedImageCategories

        if (tyreCategories) {
            pages << new TyresPage(header, savedInspection, tyreCategories, vehicleType, options)
        }
        groupedCategories.each {
            pages << (PdfInspectionPage) new ItemsPage(header, savedInspection, it, vehicleType, options, onePage)
        }
        groupedImageCategories.each {
            pages << (PdfInspectionPage) new ImagesPage(header, savedInspection, it, vehicleType, onePage)
        }
    }

    String toHtml() {
        return """
            <!doctype html>
            <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <title>Revisiones</title>
                    <link rel="stylesheet" href="css/inspection.css">
                    <link rel="stylesheet" href="css/fonts.css">
                </head>
                <body>
                    ${pages.collect { it.toHtml() }.join("\n")}
                </body>
            </html>
        """
    }

}

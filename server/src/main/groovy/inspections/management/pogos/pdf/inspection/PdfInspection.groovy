package inspections.management.pogos.pdf.inspection

import groovy.transform.CompileStatic
import inspections.management.domains.SavedInspection
import inspections.management.domains.fviberi.Centre
import inspections.management.domains.fviberi.Order
import inspections.management.pogos.pdf.CategoryItems
import inspections.management.pogos.pdf.structure.IPdf

@CompileStatic
class PdfInspection extends IPdf {

    List<PdfInspectionPage> pages

    PdfInspection(
        Centre centre,
        Order order,
        String inspectionName,
        SavedInspection savedInspection,
        List<List<CategoryItems>> groupedCategories,
        List<CategoryItems> imageCategories
    ) {
        pages = groupedCategories.collect {
            new PdfInspectionPage(centre, order, inspectionName, savedInspection, it)
        }
        if (imageCategories) {
            pages << new PdfInspectionPage(centre, order, inspectionName, savedInspection, imageCategories)
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

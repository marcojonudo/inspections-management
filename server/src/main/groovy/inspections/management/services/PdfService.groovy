package inspections.management.services

import com.itextpdf.html2pdf.ConverterProperties
import com.itextpdf.html2pdf.HtmlConverter
import groovy.transform.CompileStatic
import inspections.management.domains.Image
import inspections.management.domains.SavedInspection
import inspections.management.domains.fviberi.Centre
import inspections.management.domains.fviberi.Order
import inspections.management.services.data.CentreDataService
import inspections.management.services.data.ImageDataService
import inspections.management.services.data.InspectionTypeDataService
import inspections.management.services.data.OrderDataService
import inspections.management.services.data.SavedInspectionDataService
import inspections.management.utils.HtmlBuilder
import io.micronaut.context.annotation.Property

import javax.inject.Inject
import javax.inject.Singleton

@Singleton
@CompileStatic
class PdfService {

	private static final String HTML_FILE_NAME = "inspection.html"
	private static final String PDF_FILE_NAME = "inspection.pdf"

	@Property(name = "pdf.resources.url")
	String resourcesUrl

	@Inject SavedInspectionDataService savedInspectionDataService
	@Inject CentreDataService centreDataService
	@Inject OrderDataService orderDataService
	@Inject ImageDataService imageDataService
	@Inject InspectionTypeDataService inspectionTypeDataService

	File buildPdf(Centre centre, Order order, SavedInspection savedInspection) {
		List<Image> images = imageDataService.getAll((List<Long>) savedInspection.items.findAll { it.imageId }*.imageId)
		String inspectionName = inspectionTypeDataService.findInspectionTypeName(savedInspection.inspectionTypeCode)
		String html = HtmlBuilder.buildHtml(centre, order, inspectionName, savedInspection, images)
		File htmlFile = createTempFile(HTML_FILE_NAME, html)
		File pdf = createTempFile(PDF_FILE_NAME)

		ConverterProperties properties = new ConverterProperties()
		properties.setBaseUri(resourcesUrl)
		HtmlConverter.convertToPdf(htmlFile, pdf, properties)

		return pdf
	}

	static File createTempFile(String name, String content = "") {
		File file = File.createTempFile(name, "")
		file.deleteOnExit()
		file.write(content)
		return file
	}

}

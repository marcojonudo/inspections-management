package inspections.management.services

import com.itextpdf.html2pdf.ConverterProperties
import com.itextpdf.html2pdf.HtmlConverter
import groovy.transform.CompileStatic
import inspections.management.domains.Image
import inspections.management.domains.SavedInspection
import inspections.management.domains.fviberi.Centre
import inspections.management.domains.fviberi.Order
import inspections.management.domains.items.Item
import inspections.management.domains.savedItems.SavedItem
import inspections.management.domains.savedItems.SelectSavedItem
import inspections.management.pogos.pdf.CategoryItems
import inspections.management.pogos.pdf.inspection.PdfInspection
import inspections.management.services.data.*
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

		List<CategoryItems> categories = buildPrintCategories(savedInspection.items)
		List<List<CategoryItems>> groupedCategories = buildGroupedCategories(categories)
		List<CategoryItems> imageCategories = buildImageCategories(savedInspection.items, images)
		PdfInspection pdfInspection = new PdfInspection(
			centre, order, inspectionName, savedInspection, groupedCategories, imageCategories
		)
		File htmlFile = createTempFile(HTML_FILE_NAME, pdfInspection.toHtml())
		File pdf = createTempFile(PDF_FILE_NAME)

		ConverterProperties properties = new ConverterProperties()
		properties.setBaseUri(resourcesUrl)
		HtmlConverter.convertToPdf(htmlFile, pdf, properties)

		return pdf
	}

	static List<CategoryItems> buildPrintCategories(Set<SavedItem> savedItems) {
		List<CategoryItems> categories = []
		savedItems = savedItems.findAll {
			!it.item.header && (it.item.type == Item.Type.SELECT ? ((SelectSavedItem) it).value != 'NA' : true)
		}
		savedItems.each { SavedItem savedItem ->
			if (savedItem.item.category) {
				def existent = categories.find { it.category && it.category.code == savedItem.item.category.code }
				if (existent) {
					existent.items << savedItem
				} else {
					categories << new CategoryItems(savedItem, savedItem.item.category)
				}
			} else {
				categories << new CategoryItems(savedItem)
			}
		}
		return categories
	}

	static List<List<CategoryItems>> buildGroupedCategories(List<CategoryItems> categories) {
		categories = categories.sort { it.category ? it.category.order : 999 }
		int i = categories.findIndexOf { it.category?.code == "F" }
		return (List<List<CategoryItems>>) (i != -1 ? [categories[0..i], categories[i+1..-1]] : [categories])
	}

	static List<CategoryItems> buildImageCategories(Set<SavedItem> savedItems, List<Image> images) {
		List<CategoryItems> imageCategories = []
		if (images) {
			Set<SavedItem> imageSavedItems = images.collect { Image i ->
				savedItems.find { it.imageId == i.id }.tap { image = i }
			}.toSet()
			imageCategories = buildPrintCategories(imageSavedItems)
		}
		return imageCategories
	}

	static File createTempFile(String name, String content = "") {
		File file = File.createTempFile(name, "")
		file.deleteOnExit()
		file.write(content)
		return file
	}

}

package inspections.management.services

import com.itextpdf.html2pdf.ConverterProperties
import com.itextpdf.html2pdf.HtmlConverter
import groovy.transform.CompileStatic
import inspections.management.domains.Image
import inspections.management.domains.ItemCategory
import inspections.management.domains.SavedInspection
import inspections.management.domains.fviberi.Centre
import inspections.management.domains.fviberi.Order
import inspections.management.domains.items.Item
import inspections.management.domains.items.SelectItemOption
import inspections.management.domains.savedItems.SavedItem
import inspections.management.domains.savedItems.SelectSavedItem
import inspections.management.pogos.logs.Log
import inspections.management.pogos.pdf.CategoryItems
import inspections.management.pogos.pdf.inspection.PdfInspection
import inspections.management.services.data.*
import inspections.management.utils.Constants
import io.micronaut.context.annotation.Property
import org.slf4j.Logger
import org.slf4j.LoggerFactory

import javax.inject.Inject
import javax.inject.Singleton
import java.time.LocalTime
import java.time.temporal.ChronoUnit

@Singleton
@CompileStatic
class PdfService {

	private static final Logger LOG = LoggerFactory.getLogger(PdfService)

	private static final String HTML_FILE_NAME = "inspection.html"
	private static final int IMAGES_ROW_ITEMS = 3
	private static final List<String> TYRE_ITEM_CODES = ['EN', 'FN', 'PN']

	@Property(name = "pdf.resources.url")
	String resourcesUrl

	@Inject SavedInspectionDataService savedInspectionDataService
	@Inject CentreDataService centreDataService
	@Inject OrderDataService orderDataService
	@Inject ImageDataService imageDataService
	@Inject InspectionTypeDataService inspectionTypeDataService
	@Inject SelectItemOptionDataService selectItemOptionDataService

	File buildPdf(Centre centre, Order order, SavedInspection savedInspection) {
		List<Image> images = imageDataService.getAll((List<Long>) savedInspection.items.findAll { it.imageId }*.imageId)
		String inspectionName = inspectionTypeDataService.findInspectionTypeName(savedInspection.inspectionTypeCode)

		Set<SavedItem> savedItems = savedInspection.items
			.findAll { !it.item.header }
			.each { SavedItem savedItem -> savedItem.image = images.find { it.id == savedItem.imageId } }

		Set<SavedItem> depthImageItems = findTyreDepthItems(savedItems).findAll { it.imageId }
		List<CategoryItems> tyreCategories = depthImageItems ? buildTyreCategories(savedItems) : null
		List<SelectItemOption> options = selectItemOptionDataService.findAll()

		Set<SavedItem> existentSavedItems = savedItems.findAll {
			(it.item.type == Item.Type.SELECT ? ((SelectSavedItem) it).value != Constants.SelectItemOption.NA : true)
		}
		List<CategoryItems> categories = buildPrintCategories(existentSavedItems)
		List<List<CategoryItems>> groupedCategories = buildGroupedCategories(categories)

		Set<SavedItem> imageItems = findImageItems(savedItems)
		List<CategoryItems> imageCategories = buildPrintCategories(imageItems)
		List<List<CategoryItems>> groupedImageCategories = buildGroupedImageCategories(imageCategories)

		PdfInspection pdfInspection = new PdfInspection(
			centre,
			order,
			inspectionName,
			savedInspection,
			tyreCategories,
			groupedCategories,
			groupedImageCategories,
			options
		)
		File htmlFile = createTempFile(HTML_FILE_NAME, pdfInspection.toHtml())
		File pdf = createTempFile("${savedInspection.numberPlate}.pdf")

		LocalTime refTime = LocalTime.now()
		ConverterProperties properties = new ConverterProperties()
		properties.setBaseUri(resourcesUrl)
		LOG.info(new Log((Map) [message: "Generating inspection PDF..."]).toString())
		HtmlConverter.convertToPdf(htmlFile, pdf, properties)
		LOG.info(new Log((Map) [message: "Inspection PDF generated!", millis: ChronoUnit.MILLIS.between(refTime, LocalTime.now())]).toString())

		return pdf
	}

	static List<CategoryItems> buildTyreCategories(Set<SavedItem> savedItems) {
		return Constants.CAR_POSITION.collect { String position ->
			List<SavedItem> positionSavedItems = savedItems.findAll {
				it.item.code in TYRE_ITEM_CODES.collect { (String) "$it$position" }
			}.toList()
			return new CategoryItems(positionSavedItems, new ItemCategory(name: position))
		}
	}

	static List<CategoryItems> buildPrintCategories(Set<SavedItem> savedItems) {
		List<CategoryItems> categories = []
		savedItems.each { SavedItem savedItem ->
			if (savedItem.item.category) {
				CategoryItems existent = categories.find {
					it.category && it.category.code == savedItem.item.category.code
				}
				if (existent) {
					existent.addItem(savedItem)
				} else {
					categories << new CategoryItems([savedItem], savedItem.item.category)
				}
			} else {
				categories << new CategoryItems([savedItem])
			}
		}
		return categories
	}

	static List<List<CategoryItems>> buildGroupedCategories(List<CategoryItems> categories) {
		categories = categories.sort { it.category ? it.category.order : 999 }
		int i = categories.findIndexOf { it.category?.code == "F" }
		return (List<List<CategoryItems>>) (i != -1 ? [categories[0..i], categories[i+1..-1]] : [categories])
	}

	static Set<SavedItem> findImageItems(Set<SavedItem> savedItems) {
		Set<SavedItem> depthImageItems = findTyreDepthItems(savedItems).findAll { it.imageId }
		return savedItems.findAll { it.image && !(it.item.code in depthImageItems*.item.code) }
	}

	static Set<SavedItem> findTyreDepthItems(Set<SavedItem> savedItems) {
		List<String> depthCodes = Constants.CAR_POSITION.collect { (String) "$Constants.DEPTH_ITEM_PREFIX$it" }
		return savedItems.findAll { it.item.code in depthCodes }
	}

	static List<List<CategoryItems>> buildGroupedImageCategories(List<CategoryItems> categories) {
		List<List<CategoryItems>> groupedCategories = []
		categories.sort { it.category ? it.category.order : 999 }.eachWithIndex { CategoryItems categoryItems, int i = 0 ->
			if (i == 0) {
				groupedCategories << []
			}
			int rows = (int) (((List<CategoryItems>) groupedCategories.last()).collect {
				Math.ceil((float) (it.items.size() / Constants.ROW_IMAGES))
			}.sum() ?: 0)
			int newRows = rows + categoryItems.rows.size()
			int pageRows = rows < IMAGES_ROW_ITEMS ? (newRows - IMAGES_ROW_ITEMS > 0 ? newRows - IMAGES_ROW_ITEMS : newRows) : 0
			int newPageRows = categoryItems.rows.size() - pageRows
			if (newPageRows > 0) {
				if (pageRows) {
					List<SavedItem> samePageItems = ((List<SavedItem>) categoryItems.rows[0..pageRows-1].flatten())
					CategoryItems samePageCategoryItems = categoryItems.clone(samePageItems)
					List<SavedItem> newPageItems = ((List<SavedItem>) categoryItems.rows[pageRows..-1].flatten())
					CategoryItems newPageCategoryItems = categoryItems.clone(newPageItems)

					groupedCategories.last() << samePageCategoryItems
					groupedCategories << [newPageCategoryItems]
				} else {
					groupedCategories << [categoryItems]
				}
			} else {
				groupedCategories.last() << categoryItems
			}
		}
		return groupedCategories
	}

	static File createTempFile(String name, String content = "") {
		File file = File.createTempFile(name, "")
		file.deleteOnExit()
		file.write(content)
		return file
	}

	static String buildImageUrl(SavedItem savedItem) {
		String base64Code = new String(Base64.encoder.encode(savedItem.image.image))
		return "data:image/png;base64,$base64Code"
	}

}

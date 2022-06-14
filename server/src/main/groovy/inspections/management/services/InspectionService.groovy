package inspections.management.services

import groovy.transform.CompileStatic
import inspections.management.domains.InspectionType
import inspections.management.domains.InspectionVehicle
import inspections.management.domains.SavedInspection
import inspections.management.domains.fviberi.Centre
import inspections.management.domains.fviberi.MailData
import inspections.management.domains.fviberi.Order
import inspections.management.domains.fviberi.OrderLine
import inspections.management.domains.items.Item
import inspections.management.domains.savedItems.SavedItem
import inspections.management.domains.savedItems.SelectSavedItemData
import inspections.management.pogos.OrderInspection
import inspections.management.pogos.SendMethod
import inspections.management.pogos.logs.Log
import inspections.management.pogos.mails.MailSender
import inspections.management.services.data.*
import inspections.management.utils.Builder
import inspections.management.utils.Constants
import org.slf4j.Logger
import org.slf4j.LoggerFactory

import javax.inject.Inject
import javax.inject.Singleton
import java.time.LocalDate

@Singleton
@CompileStatic
class InspectionService {

	private static final Logger LOG = LoggerFactory.getLogger(InspectionService)

	private static final int DAYS_OFFSET = 7

	@Inject private ItemBudgetDataService itemBudgetDataService
	@Inject private InspectionVehicleDataService inspectionVehicleDataService
	@Inject private SavedInspectionDataService savedInspectionDataService
	@Inject private OrderDataService orderDataService
	@Inject private CentreDataService centreDataService
	@Inject private MailDataDataService mailDataDataService
	@Inject private PdfService pdfService
	@Inject private MailService mailService

	/**
	 * Obtiene las órdenes según los parámetros recibidos
	 * @param day Día
	 * @param to Booleano que indica si el día se refiere al actual, o al 'to'
	 * @return Lista de órdenes
	 */
	List<Order> findOrders(LocalDate day, Boolean to = null) {
		List<Order> orders
		if (to == false) {
			orders = orderDataService.findAll(day)
		} else {
			LocalDate toDay = to ? day : day.plusDays(1)
			orders = orderDataService.findAll(day.minusDays(DAYS_OFFSET), toDay)
		}
		return orders
	}

	/**
	 * Se añade a las órdenes encontradas, aquellas que
	 * @param orders
	 * @param savedOrderNumbers
	 * @return
	 */
	List<Order> handleNotInspectionOrders(List<Order> orders, List<Integer> savedOrderNumbers) {
		/* Se buscan los números de orden guardados en revisiones, que no figuren en la lista de ordenes. Esto significa
		 * que no tienen ningún código de artículo de revisión, pero se guardó alguna anomalía */
		List<Integer> notInspectionOrderNumbers = []
		savedOrderNumbers.each { Integer orderNumber ->
			boolean existent = orders.find { it.number == orderNumber }
			if (!existent) {
				notInspectionOrderNumbers << orderNumber
			}
		}
		List<Order> notInspectionOrders = notInspectionOrderNumbers ?
			orderDataService.findAll(notInspectionOrderNumbers) : []
		return orders + notInspectionOrders
	}

	/**
	 * Busca las revisiones asociadas a las órdenes con código de revisión
	 * @param orders Lista de ordenes
	 * @return Lista de órdenes con su revisión
	 */
	List<OrderInspection> findOrderInspections(List<Order> orders) {
		List<Integer> articleCodes = ((List<OrderLine>) orders.lines.flatten()).articleCode.unique()
		List<InspectionVehicle> inspectionsVehicle = inspectionVehicleDataService.findAll(articleCodes)
		return orders.collect {
			InspectionVehicle inspectionVehicle = findOrderInspection(it, inspectionsVehicle)
			return new OrderInspection(it, inspectionVehicle)
		}
	}

	/**
	 * Busca y construye la revisión asociada a una orden
	 * @param order Orden
	 * @return Revisión
	 */
	static InspectionVehicle findOrderInspection(Order order, List<InspectionVehicle> inspectionsVehicle) {
		List<Integer> orderArticleCodes = order.lines*.articleCode as List<Integer>
		List<InspectionVehicle> orderInspectionVehicle = inspectionsVehicle.findAll {
			it.articleCodes.find { it.articleCode in orderArticleCodes }
		}
		return orderInspectionVehicle ? buildGroupedInspection(orderInspectionVehicle) : null
	}

	/**
	 * Construye una revisión agrupada con todos los items de las recibidas como parámetro
	 * @param inspections Lista de revisiones
	 * @return Revisión con items agrupados
	 */
	static InspectionVehicle buildGroupedInspection(List<InspectionVehicle> inspectionsVehicle) {
		/* Se obtienen el código y nombre de la revisión con mayor número de items */
		InspectionVehicle maxInspection = inspectionsVehicle.max { it.items.size() }
		List<Item> items = ((List<Item>) inspectionsVehicle.items.flatten()).unique { it.code }
		return Builder.buildInspectionVehicle(maxInspection, items)
	}

	/**
	 * Busca las revisiones asociadas a las órdenes con anomalías detectadas
	 * @param orders Lista de ordenes
	 * @return Lista de órdenes con su revisión
	 */
	List<OrderInspection> findDetectedAnomaliesInspections(List<Order> orders) {
		InspectionVehicle securityInspectionVehicle = inspectionVehicleDataService.find(
			InspectionType.Code.SE.toString(), InspectionVehicle.Vehicle.CAR.toString()
		)
		return orders.collect {
			InspectionVehicle inspectionVehicle = Builder.buildInspectionVehicle(
				securityInspectionVehicle, securityInspectionVehicle.items.toList(), false
			)
			return new OrderInspection(it, inspectionVehicle)
		}
	}

	/**
	 * Guarda o actualiza una revisión
	 * @param inspection Revisión
	 * @param orderNumber Número de orden
	 * @param employeeCode Código del empleado que guarda la revisión
	 * @return Revisión guardada
	 */
	SavedInspection saveInspection(SavedInspection savedInspection, Integer orderNumber, String employeeCode) {
		LOG.info(new Log((Map) [sellerCode: employeeCode, orderNumber: orderNumber, inspectionTypeCode: savedInspection.inspectionTypeCode, vehicle: savedInspection.vehicle, message: Constants.Message.SAVING_INSPECTION]).toString())
		SavedInspection newSavedInspection = null
		try {
			/* En la app de revisiones sólo aparecen revisiones guardadas previamente, por lo que siempre se va a
			 * encontrar en DB */
			SavedInspection existent = savedInspectionDataService.find(orderNumber)
			newSavedInspection = savedInspectionDataService.update(savedInspection, existent)
			LOG.info(new Log((Map) [employeeCode: employeeCode, orderNumber: orderNumber, inspectionTypeCode: savedInspection.inspectionTypeCode, vehicle: savedInspection.vehicle, message: Constants.Message.SAVED_INSPECTION]).toString())
		} catch (all) {
			all.printStackTrace()
			LOG.error(new Log((Map) [employeeCode: employeeCode, orderNumber: orderNumber, inspectionTypeCode: savedInspection.inspectionTypeCode, vehicle: savedInspection.vehicle, exceptionMessage: all.message, message: Constants.Message.ERROR_SAVING_INSPECTION]).toString())
		}
		return newSavedInspection
	}

	/**
	 * Envía un correo con la revisión
	 * @param orderNumber Número de orden
	 * @param to Destinatario
	 * @param employeeCode Código de empleado
	 */
	SavedInspection sendInspectionMail(Integer orderNumber, String to, String employeeCode) {
		SavedInspection savedInspection = savedInspectionDataService.find(orderNumber, true)
		Centre centre = centreDataService.find()
		Order order = orderDataService.find(savedInspection.orderNumber)
		MailData mailData = mailDataDataService.find(centre.code as int)
		File pdfFile = pdfService.buildPdf(centre, order, savedInspection)

		MailSender sender = Builder.Mail.buildInspectionSender(mailData.email, centre.name)
		String subject = Builder.Mail.buildInspectionSubject(order)
		String body = Builder.Mail.buildInspectionBody(centre, order.client, order.vehicle)
		mailService.sendMail(mailData, sender, to, subject, body, pdfFile)
		savedInspectionDataService.updateSent(savedInspection, employeeCode, SendMethod.MAIL)
	}

	/**
	 * Encuentra los items erróneos de una revisión
	 * @param orderNumber Número de orden
	 * @return
	 */
	static List<SavedItem> findWrongItems(List<SavedItem> items) {
		return items.findAll {
			it.type == Item.Type.SELECT && it.findData().filled && it.findValue() != SelectSavedItemData.Value.C.toString()
		}
	}

}

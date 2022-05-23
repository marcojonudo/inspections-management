package inspections.management.services

import inspections.management.domains.fviberi.Order
import inspections.management.domains.items.Item
import inspections.management.domains.savedItems.SavedItem
import inspections.management.domains.savedItems.SelectSavedItem
import inspections.management.domains.savedItems.TextSavedItem
import inspections.management.services.data.*
import io.micronaut.test.annotation.MicronautTest
import io.micronaut.test.annotation.MockBean
import spock.lang.Specification

import javax.inject.Inject
import java.time.LocalDateTime

@MicronautTest
class InspectionServiceSpec extends Specification {

    @Inject InspectionService inspectionService
    @Inject OrderDataService orderDataService
    @Inject ItemBudgetDataService itemBudgetDataService
    @Inject SavedInspectionDataService savedInspectionDataService
    @Inject InspectionVehicleDataService inspectionVehicleDataService
    @Inject CentreDataService centreDataService
    @Inject MailDataDataService mailDataDataService
    @Inject ImageDataService imageDataService
    @Inject InspectionTypeDataService inspectionTypeDataService
    @Inject SelectItemOptionDataService selectItemOptionDataService

    @MockBean(SelectItemOptionDataService)
    SelectItemOptionDataService selectItemOptionDataService() {
        Mock(SelectItemOptionDataService)
    }

    @MockBean(InspectionTypeDataService)
    InspectionTypeDataService inspectionTypeDataService() {
        Mock(InspectionTypeDataService)
    }

    @MockBean(ImageDataService)
    ImageDataService imageDataService() {
        Mock(ImageDataService)
    }

    @MockBean(MailDataDataService)
    MailDataDataService mailDataDataService() {
        Mock(MailDataDataService)
    }

    @MockBean(OrderDataService)
    OrderDataService orderDataService () {
        Mock(OrderDataService)
    }

    @MockBean(ItemBudgetDataService)
    ItemBudgetDataService itemBudgetDataService () {
        Mock(ItemBudgetDataService)
    }

    @MockBean(SavedInspectionDataService)
    SavedInspectionDataService savedInspectionDataService() {
        Mock(SavedInspectionDataService)
    }

    @MockBean(InspectionVehicleDataService)
    InspectionVehicleDataService inspectionVehicleDataService() {
        Mock(InspectionVehicleDataService)
    }

    @MockBean(CentreDataService)
    CentreDataService centreDataService() {
        Mock(CentreDataService)
    }

    // region Handle not inspection orders

    void "test handle not inspection orders no more orders"() {
        given:
        List<Order> orders = [new Order(number: 1, lines: []), new Order(number: 2, lines: [])]
        List<Integer> savedOrderNumbers = []
        orderDataService.findAll(savedOrderNumbers) >> []

        when:
        List<Order> allOrders = inspectionService.handleNotInspectionOrders(orders, savedOrderNumbers)

        then:
        allOrders.size() == orders.size()
    }

    void "test handle not inspection orders more orders"() {
        given:
        List<Order> orders = [new Order(number: 1, lines: []), new Order(number: 2, lines: [])]
        List<Integer> savedOrderNumbers = [3]
        orderDataService.findAll(savedOrderNumbers) >> [new Order(number: savedOrderNumbers[0])]

        when:
        List<Order> allOrders = inspectionService.handleNotInspectionOrders(orders, savedOrderNumbers)

        then:
        allOrders.size() == orders.size() + 1
    }

    // endregion

//    // region test find order inspections
//
//    void "test find order inspections orders without inspections"() {
//        given:
//        List<Order> orders = [new Order(number: 1, lines: []), new Order(number: 2, lines: [])]
//        inspectionDataService.findAll((List<Integer>) _) >> []
//
//        when:
//        List<OrderInspection> orderInspections = inspectionService.findOrderInspections(orders)
//
//        then:
//        !orderInspections
//    }
//
//    void "test find order inspections orders with inspections"() {
//        given:
//        List<Order> orders = [new Order(number: 1), new Order(number: 2)]
//        InspectionService inspectionServiceSpy = Spy(InspectionService) {
//            findOrderInspection((Order) _) >> new Inspection(code: 'C') >> null
//        }
//
//        when:
//        List<OrderInspection> orderInspections = inspectionServiceSpy.findOrderInspections(orders)
//
//        then:
//        orderInspections
//        orderInspections.size() == 1
//        orderInspections[0].order.number == orders[0].number
//        orderInspections[0].inspection.code == 'C'
//    }
//
//    // endregion
//
//    // region Fill order inspections
//
//    void "test fill order inspections no saved inspections"() {
//        given:
//        List<OrderInspection> orderInspections = [new OrderInspection(new Order(number: 1), new Inspection(code: 'C'))]
//        List<SavedInspection> savedInspections = []
//        List<ItemBudget> itemBudgets = []
//
//        when:
//        inspectionService.fillOrderInspections(orderInspections, savedInspections, itemBudgets)
//
//        then:
//        orderInspections
//        orderInspections.size() == 1
//        orderInspections[0].state == SavedInspection.State.PENDING
//    }
//
//    void "test fill order inspections no item budgets"() {
//        given:
//        List<OrderInspection> orderInspections = [new OrderInspection(new Order(number: 1), new Inspection(code: 'C'))]
//        List<SavedInspection> savedInspections = [new SavedInspection(orderNumber: 1, state: SavedInspection.State.STARTED)]
//        List<ItemBudget> itemBudgets = []
//
//        when:
//        inspectionService.fillOrderInspections(orderInspections, savedInspections, itemBudgets)
//
//        then:
//        orderInspections
//        orderInspections.size() == 1
//        orderInspections[0].state == SavedInspection.State.STARTED
//        !orderInspections[0].itemBudgets
//    }
//
//    void "test fill order inspections no coincident item budgets"() {
//        given:
//        List<OrderInspection> orderInspections = [new OrderInspection(new Order(number: 1), new Inspection(code: 'C'))]
//        List<SavedInspection> savedInspections = [
//            new SavedInspection(
//                orderNumber: 1,
//                state: SavedInspection.State.FINISHED,
//                items: [new SelectSavedItem(item: new Item(code: 'N'), value: '')]
//            )
//        ]
//        List<ItemBudget> itemBudgets = [new ItemBudget(itemCode: 'H', budgetType: ItemBudget.BudgetType.URGENT)]
//
//        when:
//        inspectionService.fillOrderInspections(orderInspections, savedInspections, itemBudgets)
//
//        then:
//        orderInspections
//        orderInspections.size() == 1
//        orderInspections[0].state == SavedInspection.State.FINISHED
//        !orderInspections[0].itemBudgets
//    }
//
//    void "test fill order inspections coincident item budgets correct item"() {
//        given:
//        List<OrderInspection> orderInspections = [new OrderInspection(new Order(number: 1), new Inspection(code: 'C'))]
//        List<SavedInspection> savedInspections = [
//            new SavedInspection(
//                orderNumber: 1,
//                state: SavedInspection.State.FINISHED,
//                items: [new SelectSavedItem(item: new Item(code: 'N'), value: 'C')]
//            )
//        ]
//        List<ItemBudget> itemBudgets = [new ItemBudget(itemCode: 'N', budgetType: ItemBudget.BudgetType.URGENT)]
//
//        when:
//        inspectionService.fillOrderInspections(orderInspections, savedInspections, itemBudgets)
//
//        then:
//        orderInspections
//        orderInspections.size() == 1
//        orderInspections[0].state == SavedInspection.State.FINISHED
//        !orderInspections[0].itemBudgets
//    }
//
//    void "test fill order inspections coincident item budgets wrong item"() {
//        given:
//        List<OrderInspection> orderInspections = [new OrderInspection(new Order(number: 1), new Inspection(code: 'C'))]
//        List<SavedInspection> savedInspections = [
//            new SavedInspection(
//                orderNumber: 1,
//                state: SavedInspection.State.FINISHED,
//                items: [new SelectSavedItem(item: new Item(code: 'N'), value: 'PC')]
//            )
//        ]
//        List<ItemBudget> itemBudgets = [new ItemBudget(itemCode: 'N', budgetType: ItemBudget.BudgetType.URGENT)]
//
//        when:
//        inspectionService.fillOrderInspections(orderInspections, savedInspections, itemBudgets)
//
//        then:
//        orderInspections
//        orderInspections.size() == 1
//        orderInspections[0].state == SavedInspection.State.FINISHED
//        orderInspections[0].itemBudgets
//        orderInspections[0].itemBudgets.size() == 1
//        orderInspections[0].itemBudgets[0].budgetType == ItemBudget.BudgetType.URGENT
//    }
//
//    void "test fill order inspections coincident item budgets text item"() {
//        given:
//        List<OrderInspection> orderInspections = [new OrderInspection(new Order(number: 1), new Inspection(code: 'C'))]
//        List<SavedInspection> savedInspections = [
//            new SavedInspection(
//                orderNumber: 1,
//                state: SavedInspection.State.FINISHED,
//                items: [new SelectSavedItem(item: new Item(code: 'N'), value: 'PC')]
//            )
//        ]
//        List<ItemBudget> itemBudgets = [new ItemBudget(itemCode: 'N', budgetType: ItemBudget.BudgetType.URGENT)]
//
//        when:
//        inspectionService.fillOrderInspections(orderInspections, savedInspections, itemBudgets)
//
//        then:
//        orderInspections
//        orderInspections.size() == 1
//        orderInspections[0].state == SavedInspection.State.FINISHED
//        !orderInspections[0].itemBudgets
//    }
//
//    // endregion
//
//    // region Find order inspection info
//
//    void "test find order inspections info no orders"() {
//        given:
//        orderDataService.findAll(LocalDate.now()) >> []
//
//        when:
//        List<OrderInspection> orderInspections = inspectionService.findOrderInspectionInfo()
//
//        then:
//        !orderInspections
//    }

//    void "test build grouped inspection one inspection"() {
//        given:
//        List<Inspection> inspections = [new Inspection(name: "Name", items: [new Item(name: "Item")])]
//
//        when:
//        Inspection inspection = inspectionService.buildGroupedInspection(inspections)
//
//        then:
//        inspection.name == inspections[0].name
//        inspection.items.size() == inspections[0].items.size()
//        inspection.items[0].name == inspections[0].items[0].name
//    }
//
//    void "test build grouped inspection several inspections"() {
//        given:
//        List<Inspection> inspections = [
//            new Inspection(name: "Name 1", items: [new Item(name: "Item 1")]),
//            new Inspection(name: "Name 2", items: [new Item(name: "Item 2"), new Item(name: "Item 3")]),
//            new Inspection(name: "Name 3", items: [new Item(name: "Item 4")])
//        ]
//
//        when:
//        Inspection inspection = inspectionService.buildGroupedInspection(inspections)
//
//        then:
//        inspection.name == inspections[1].name
//        inspection.items.size() == inspections.items.flatten().size()
//    }

    // endregion

    // region Find wrong items

    void "test find wrong no items"() {
        given:
        List<SavedItem> items = []

        when:
        List<SavedItem> wrongItems = inspectionService.findWrongItems(items)

        then:
        !wrongItems
    }

    void "test find wrong items select and text items no wrong items"() {
        given:
        List<SavedItem> items = [
            new TextSavedItem(type: Item.Type.TEXT),
            new SelectSavedItem(type: Item.Type.SELECT, value: SelectSavedItem.Value.C.toString()),
            new SelectSavedItem(type: Item.Type.SELECT, value: SelectSavedItem.Value.C.toString())
        ]

        when:
        List<SavedItem> wrongItems = inspectionService.findWrongItems(items)

        then:
        !wrongItems
    }

    void "test find wrong items select and text items wrong items"() {
        given:
        List<SavedItem> items = [
            new TextSavedItem(type: Item.Type.TEXT),
            new SelectSavedItem(type: Item.Type.SELECT, filled: LocalDateTime.now(), value: SelectSavedItem.Value.C.toString()),
            new SelectSavedItem(type: Item.Type.SELECT, filled: LocalDateTime.now(), value: SelectSavedItem.Value.SN.toString())
        ]

        when:
        List<SavedItem> wrongItems = inspectionService.findWrongItems(items)

        then:
        wrongItems
        wrongItems.size() == 1
        (wrongItems[0] as SelectSavedItem).value == SelectSavedItem.Value.SN.toString()
    }

    // endregion

}

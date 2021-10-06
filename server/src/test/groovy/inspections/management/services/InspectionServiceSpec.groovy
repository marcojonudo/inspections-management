package inspections.management.services


import io.micronaut.test.annotation.MicronautTest
import spock.lang.Specification

@MicronautTest
class InspectionServiceSpec extends Specification {

//    @Inject InspectionService inspectionService
//    @Inject OrderDataService orderDataService
//    @Inject ItemBudgetDataService itemBudgetDataService
//    @Inject InspectionDataService inspectionDataService
//    @Inject SavedInspectionDataService savedInspectionDataService
//
//    @MockBean(OrderDataService)
//    OrderDataService orderDataService () {
//        Mock(OrderDataService)
//    }
//
//    @MockBean(ItemBudgetDataService)
//    ItemBudgetDataService itemBudgetDataService () {
//        Mock(ItemBudgetDataService)
//    }
//
//    @MockBean(InspectionDataService)
//    InspectionDataService inspectionDataService() {
//        Mock(InspectionDataService)
//    }
//
//    @MockBean(SavedInspectionDataService)
//    SavedInspectionDataService savedInspectionDataService() {
//        Mock(SavedInspectionDataService)
//    }
//
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

}

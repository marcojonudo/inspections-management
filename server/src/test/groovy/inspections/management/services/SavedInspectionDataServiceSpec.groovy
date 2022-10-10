package inspections.management.services

import inspections.management.domains.savedItems.SavedItemData
import inspections.management.domains.savedItems.SelectSavedItemData
import inspections.management.services.data.ItemDataService
import inspections.management.services.data.ItemVehicleDataDataService
import inspections.management.services.data.SavedInspectionDataDataService
import inspections.management.services.data.SavedInspectionDataService
import inspections.management.services.data.SavedItemDataDataService
import inspections.management.services.data.SavedItemDataService
import io.micronaut.test.annotation.MicronautTest
import io.micronaut.test.annotation.MockBean
import spock.lang.Specification

import javax.inject.Inject
import java.time.LocalDateTime

@MicronautTest
class SavedInspectionDataServiceSpec extends Specification {

    @Inject SavedInspectionDataService savedInspectionDataService

    @Inject ItemDataService itemDataService
    @Inject SavedInspectionDataDataService savedInspectionDataDataService
    @Inject SavedItemDataService savedItemDataService
    @Inject ItemVehicleDataDataService itemVehicleDataDataService
    @Inject SavedItemDataDataService savedItemDataDataService

    @MockBean(SavedItemDataDataService)
    SavedItemDataDataService savedItemDataDataService() {
        Mock(SavedItemDataDataService)
    }

    @MockBean(ItemVehicleDataDataService)
    ItemVehicleDataDataService itemVehicleDataDataService() {
        Mock(ItemVehicleDataDataService)
    }

    @MockBean(SavedItemDataService)
    SavedItemDataService savedItemDataService() {
        Mock(SavedItemDataService)
    }

    @MockBean(SavedInspectionDataDataService)
    SavedInspectionDataDataService savedInspectionDataDataService() {
        Mock(SavedInspectionDataDataService)
    }

    @MockBean(ItemDataService)
    ItemDataService itemDataService() {
        Mock(ItemDataService)
    }

    // region Check new item data

    void "test check new item data same length same items"() {
        given:
        LocalDateTime now = LocalDateTime.now()
        Set<SavedItemData> data = [new SelectSavedItemData(saved: now)]
        Set<SavedItemData> existentData = [new SelectSavedItemData(saved: now)]

        when:
        boolean newItemData = savedInspectionDataService.checkNewItemData(data, existentData)

        then:
        !newItemData
    }

    void "test check new item data same length more recent data"() {
        given:
        LocalDateTime now = LocalDateTime.now()
        Set<SavedItemData> data = [new SelectSavedItemData(saved: now.plusMinutes(1))]
        Set<SavedItemData> existentData = [new SelectSavedItemData(saved: now)]

        when:
        boolean newItemData = savedInspectionDataService.checkNewItemData(data, existentData)

        then:
        newItemData
    }

    void "test check new item data same length existent more recent saved"() {
        given:
        LocalDateTime now = LocalDateTime.now()
        Set<SavedItemData> data = [new SelectSavedItemData(saved: now)]
        Set<SavedItemData> existentData = [new SelectSavedItemData(saved: now.plusMinutes(1))]

        when:
        boolean newItemData = savedInspectionDataService.checkNewItemData(data, existentData)

        then:
        !newItemData
    }

    void "test check new item data different length same items"() {
        given:
        LocalDateTime now = LocalDateTime.now()
        Set<SavedItemData> data = [new SelectSavedItemData(saved: now), new SelectSavedItemData(saved: now)]
        Set<SavedItemData> existentData = [new SelectSavedItemData(saved: now)]

        when:
        boolean newItemData = savedInspectionDataService.checkNewItemData(data, existentData)

        then:
        !newItemData
    }

    void "test check new item data different length new saved data"() {
        given:
        LocalDateTime now = LocalDateTime.now()
        Set<SavedItemData> data = [
            new SelectSavedItemData(saved: now), new SelectSavedItemData(saved: now.plusMinutes(1))
        ]
        Set<SavedItemData> existentData = [new SelectSavedItemData(saved: now)]

        when:
        boolean newItemData = savedInspectionDataService.checkNewItemData(data, existentData)

        then:
        newItemData
    }

    void "test check new item more existent than new data length"() {
        given:
        LocalDateTime now = LocalDateTime.now()
        Set<SavedItemData> data = [new SelectSavedItemData(saved: now)]
        Set<SavedItemData> existentData = [
            new SelectSavedItemData(saved: now), new SelectSavedItemData(saved: now.plusMinutes(10))
        ]

        when:
        boolean newItemData = savedInspectionDataService.checkNewItemData(data, existentData)

        then:
        !newItemData
    }

    // endregion

}

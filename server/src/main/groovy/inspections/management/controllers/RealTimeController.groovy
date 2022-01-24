package inspections.management.controllers

import groovy.transform.CompileStatic
import inspections.management.domains.SavedInspection
import inspections.management.pogos.RealTimePublisher
import inspections.management.pogos.realTime.RealTimeSavedInspection
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Patch
import io.swagger.v3.oas.annotations.Operation

@Controller("/realTime")
@CompileStatic
class RealTimeController {

    @Patch("/inspection")
    @Operation(
        summary = "Sincroniza una revisión",
        description = "Sincroniza una revisión"
    )
    void syncInspection(@Body SavedInspection savedInspection) {
        RealTimePublisher.send(new RealTimeSavedInspection(savedInspection))
    }

}

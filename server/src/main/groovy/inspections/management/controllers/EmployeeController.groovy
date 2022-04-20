package inspections.management.controllers

import groovy.transform.CompileStatic
import inspections.management.domains.schedules.EmployeeData
import inspections.management.services.data.EmployeeDataDataService
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.ArraySchema
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse

import javax.inject.Inject

@Controller("/employees")
@CompileStatic
class EmployeeController {

    @Inject private EmployeeDataDataService employeeDataDataService

    @Get
    @Operation(summary = "Obtiene los empleados", description = "Obtiene todos los empleados")
    @ApiResponse(
        responseCode = "200",
        description = "Lista de empleados",
        content = @Content(array = @ArraySchema(schema = @Schema(implementation = EmployeeData)))
    )
    List<EmployeeData> getEmployees() {
        return employeeDataDataService.findAll()
    }

}

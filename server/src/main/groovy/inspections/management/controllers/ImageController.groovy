package inspections.management.controllers

import groovy.transform.CompileStatic
import inspections.management.domains.Image
import inspections.management.services.data.ImageDataService
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.PathVariable
import io.micronaut.http.annotation.QueryValue
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.ArraySchema
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse

import javax.inject.Inject

@Controller("/images")
@CompileStatic
class ImageController {

    @Inject ImageDataService imageDataService

    @Get("/{id}")
    @Operation(
        summary = "Obtiene una imagen",
        description = "Obtiene una imagen"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Imagen obtenida correctamente",
        content = @Content(array = @ArraySchema(schema = @Schema(implementation = Image)))
    )
    Image getImage(@PathVariable Long id) {
        return imageDataService.get(id)
    }

    @Get
    @Operation(
        summary = "Obtiene una lista de imágenes",
        description = "Obtiene una lista de imágenes"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Imágenes obtenidas correctamente",
        content = @Content(array = @ArraySchema(schema = @Schema(implementation = Image)))
    )
    List<Image> findImages(@QueryValue List<Long> ids) {
        return imageDataService.getAll(ids)
    }

}

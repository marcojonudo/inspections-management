package inspections.management.controllers

import groovy.transform.CompileStatic
import inspections.management.services.data.*
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse

import javax.inject.Inject

@Controller("/languages")
@CompileStatic
class LanguageController {

    @Inject private LanguageDataService languageDataService

    @Get
    @Operation(
        summary = "Obtiene el idioma de la aplicación",
        description = "Obtiene el código de idioma de la base de datos"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Idioma encontrado",
        content = @Content(mediaType = "text/plain", schema = @Schema(type = "string"))
    )
    String findLanguage() {
        return languageDataService.findLanguageLang()
    }

}

package inspections.management.init


import groovy.transform.CompileStatic
import inspections.management.i18n.CustomMessageSource
import inspections.management.services.data.LanguageDataService
import io.micronaut.context.MessageSource
import io.micronaut.context.annotation.Requires
import io.micronaut.context.env.Environment
import io.micronaut.context.event.ApplicationEventListener
import io.micronaut.context.event.StartupEvent

import javax.inject.Inject
import javax.inject.Singleton

@CompileStatic
@Singleton
@Requires(notEnv = Environment.TEST)
class Bootstrap implements ApplicationEventListener<StartupEvent> {

    @Inject LanguageDataService languageDataService
    @Inject MessageSource messageSource

    @Override
    void onApplicationEvent(StartupEvent event) {
        String lang = languageDataService.findLanguageLang()
        CustomMessageSource.setMessageSource(messageSource, lang)
    }

}

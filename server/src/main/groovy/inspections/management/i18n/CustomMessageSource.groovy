package inspections.management.i18n

import groovy.transform.CompileStatic
import io.micronaut.context.MessageSource
import io.micronaut.context.MessageSource.MessageContext

@CompileStatic
class CustomMessageSource {

    static MessageSource messageSource
    static Locale locale

    static void setMessageSource(MessageSource messageSource, String lang) {
        this.messageSource = messageSource
        locale = new Locale(lang)
    }

    static String getMessage(String key, Map variables = [:]) {
        MessageContext messageContext = MessageContext.of(locale, variables)
        String template = messageSource.getMessage(key, messageContext, "")
        return messageSource.interpolate(template, messageContext)
    }

}

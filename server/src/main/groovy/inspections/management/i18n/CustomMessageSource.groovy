package inspections.management.i18n

import groovy.transform.CompileStatic
import io.micronaut.context.MessageSource
import io.micronaut.context.MessageSource.MessageContext

@CompileStatic
class CustomMessageSource {

    static MessageSource messageSource
    static MessageContext messageContext

    static void setMessageSource(MessageSource messageSource, String lang) {
        this.messageSource = messageSource
        messageContext = MessageContext.of(new Locale(lang))
    }

    static String getMessage(String key) {
        return messageSource.getMessage(key, messageContext).isPresent() ?
            messageSource.getMessage(key, messageContext).get() : null
    }

}

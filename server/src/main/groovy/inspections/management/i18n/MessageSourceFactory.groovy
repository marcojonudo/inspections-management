package inspections.management.i18n

import io.micronaut.context.MessageSource
import io.micronaut.context.annotation.Factory
import io.micronaut.context.i18n.ResourceBundleMessageSource

import javax.inject.Singleton

@Factory
class MessageSourceFactory {

    @Singleton
    MessageSource createMessageSource() {
        new ResourceBundleMessageSource("i18n.messages")
    }

}

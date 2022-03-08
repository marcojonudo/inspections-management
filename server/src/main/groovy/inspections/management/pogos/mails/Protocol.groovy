package inspections.management.pogos.mails

import inspections.management.domains.fviberi.MailData

enum Protocol {

    SMTP([
        "mail.smtp.host": { MailData data -> data.host },
        "mail.smtp.port": { MailData data -> data.port }
    ])

    final Map<String, Closure<String>> sessionProperties

    Protocol(Map<String, Closure<String>> sessionProperties) {
        this.sessionProperties = sessionProperties
    }

}

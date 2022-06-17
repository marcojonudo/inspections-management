package inspections.management.pogos.slack.structure.elements

import groovy.transform.CompileStatic

@CompileStatic
class SlackPlainTextElem extends SlackBaseElem {

    String text

    SlackPlainTextElem(String text) {
        super("plain_text")
        this.text = text
    }

}

package inspections.management.pogos.slack.structure.elements

import groovy.transform.CompileStatic

@CompileStatic
class SlackTextButton extends SlackBaseElem {

    SlackBaseElem text
    String style
    String value

    SlackTextButton(SlackBaseElem textElem) {
        super("button")
        text = textElem
        style = "primary"
        value = "retry"
    }

}

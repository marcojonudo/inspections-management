package inspections.management.pogos.slack.structure.blocks

import groovy.transform.CompileStatic
import inspections.management.pogos.slack.structure.elements.SlackBaseElem

@CompileStatic
class SlackHeaderBlock extends SlackBlock {

    SlackBaseElem text

    SlackHeaderBlock(SlackBaseElem textElem, SlackBaseElem accessory = null) {
        super("header")
        this.text = textElem
        this.accessory = accessory
    }

}

package inspections.management.pogos.slack.structure.blocks

import groovy.transform.CompileStatic
import inspections.management.pogos.slack.structure.elements.SlackBaseElem

@CompileStatic
class SlackContextBlock extends SlackBlock {

    List<SlackBaseElem> elements

    SlackContextBlock(List<SlackBaseElem> elements) {
        super("context")
        this.elements = elements
    }

}

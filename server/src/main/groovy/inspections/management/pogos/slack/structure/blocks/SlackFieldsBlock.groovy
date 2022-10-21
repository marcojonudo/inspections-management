package inspections.management.pogos.slack.structure.blocks

import groovy.transform.CompileStatic
import groovy.transform.TupleConstructor
import inspections.management.pogos.slack.structure.elements.SlackBaseElem

@CompileStatic
@TupleConstructor(includeSuperProperties = true, callSuper = true)
class SlackFieldsBlock extends SlackBlock {

    List<SlackBaseElem> fields

    SlackFieldsBlock(List<SlackBaseElem> elements) {
        super("section")
        this.fields = elements
    }

}

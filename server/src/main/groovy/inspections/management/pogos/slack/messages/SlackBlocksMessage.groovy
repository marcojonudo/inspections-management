package inspections.management.pogos.slack.messages

import groovy.transform.CompileStatic
import groovy.transform.TupleConstructor
import inspections.management.pogos.slack.structure.blocks.SlackBlock

@CompileStatic
@TupleConstructor
class SlackBlocksMessage extends SlackMessage {

    List<SlackBlock> blocks

}

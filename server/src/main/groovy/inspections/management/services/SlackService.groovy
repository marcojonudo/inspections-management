package inspections.management.services

import groovy.transform.CompileStatic
import inspections.management.clients.SlackClient
import inspections.management.pogos.logs.Log
import inspections.management.pogos.slack.SlackAction
import inspections.management.pogos.slack.messages.SlackMessage
import inspections.management.utils.Constants
import io.micronaut.http.HttpResponse
import org.slf4j.Logger
import org.slf4j.LoggerFactory

import javax.inject.Inject
import javax.inject.Singleton

@Singleton
@CompileStatic
class SlackService {

    private static final Logger LOG = LoggerFactory.getLogger(SlackService)

    @Inject SlackClient slackClient

    HttpResponse sendMessage(SlackMessage message) {
        HttpResponse response = null
        try {
            response = slackClient.sendMessage(SlackAction.POST_MESSAGE.value, message)
        } catch(all) {
            all.printStackTrace()
            LOG.error(new Log(Constants.Message.SLACK_WRONG_REQUEST).toString())
        }
        return response
    }

}

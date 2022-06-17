package inspections.management.clients

import groovy.transform.CompileStatic
import inspections.management.pogos.slack.messages.SlackMessage
import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.PathVariable
import io.micronaut.http.annotation.Post
import io.micronaut.http.client.annotation.Client

import javax.inject.Singleton

@Singleton
@CompileStatic
@Client("https://slack.com/api")
interface SlackClient {

	@Post("/{action}")
    HttpResponse sendMessage(@PathVariable String action, @Body SlackMessage message)

}

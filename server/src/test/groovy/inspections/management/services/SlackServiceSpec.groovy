package inspections.management.services


import io.micronaut.test.annotation.MicronautTest
import spock.lang.Specification

import javax.inject.Inject

@MicronautTest
class SlackServiceSpec extends Specification {

	// region Collaborators

	@Inject SlackService slackService

	// endregion

	// region Send message

	void "test send message"() {
//		given:
//		SlackMessage message = Builder.Slack.buildSentSmsMessage(
//			Constants.Message.SENT_SMS, 13, new SavedInspection(orderNumber: 11532, numberPlate: "4592DKE"), "0482235", 667839562
//		)
//
//		when:
//		HttpResponse response = slackService.sendMessage(message)
//
//		then:
//		response
//		response.status == HttpStatus.OK
//		Map<String, Object> body = (Map<String, Object>) response.body()
//		body["ok"] == true
	}

	// endregion

}

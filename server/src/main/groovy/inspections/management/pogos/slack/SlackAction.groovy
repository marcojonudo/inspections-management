package inspections.management.pogos.slack

enum SlackAction {

    POST_MESSAGE('chat.postMessage')

    final String value

    SlackAction(String value) {
        this.value = value
    }

}

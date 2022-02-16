package inspections.management.pogos

import groovy.transform.CompileStatic
import inspections.management.pogos.realTime.RealTimeInfo
import io.micronaut.http.sse.Event
import io.reactivex.subjects.PublishSubject

@CompileStatic
class RealTimePublisher {

	private static PublishSubject<Event<RealTimeInfo>> processor

	static PublishSubject<Event<RealTimeInfo>> find() {
		processor = processor ?: (PublishSubject.create() as PublishSubject<Event<RealTimeInfo>>)
		return processor
	}

	static void send(RealTimeInfo realTimeInfo, String sessionId = "") {
		find().onNext(Event.of(realTimeInfo).id(sessionId))
	}

}

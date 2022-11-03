package inspections.management.domains

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer
import grails.gorm.annotation.Entity
import groovy.transform.TupleConstructor
import inspections.management.pogos.SendMethod
import inspections.management.utils.Constants
import org.grails.datastore.gorm.GormEntity

import java.time.LocalDateTime

@Entity
@TupleConstructor
class SavedInspectionData implements GormEntity<SavedInspectionData> {

	@JsonIgnore
	SavedInspection savedInspection
	String employeeCode
	Reason reason
	SendMethod sendMethod

	@JsonFormat(pattern = Constants.DateTimeFormat.yyyy_MM_dd_HH_mm_ss, timezone = Constants.SPAIN_TIMEZONE)
	@JsonDeserialize(using = LocalDateTimeDeserializer)
	@JsonSerialize(using = LocalDateTimeSerializer)
	LocalDateTime saved

	static belongsTo = SavedInspection

	static constraints = {
		sendMethod nullable: true
	}

	enum Reason {

		SAVED,
		UPDATED,
		UPDATED_ORDER,
		SENT

	}

}

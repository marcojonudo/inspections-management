package inspections.management.utils

import groovy.transform.CompileStatic

@CompileStatic
class Constants {

    static final String SPAIN_TIMEZONE = "Europe/Madrid"
    static final List<String> CLOSED_ORDER_STATES = ['V', 'X']
    static final String APPOINTMENT_IDENTIFIER = "C"

    static class DataSource {

        static final String FVIBERI = "fviberi"
        static final String SCHEDULES = "schedules"

    }

    static class DateFormat {

        static final String yyyy_MM_dd = "yyyy-MM-dd"

    }

    static class DateTimeFormat {

        static final String yyyy_MM_dd_HH_mm_ss = "yyyy-MM-dd HH:mm:ss"

    }

    static class Message {

        static final String SAVING_INSPECTION = "Saving inspection"
        static final String ERROR_SAVING_INSPECTION = "Error saving inspection"
        static final String SAVED_INSPECTION = "Saved inspection!"

    }

}

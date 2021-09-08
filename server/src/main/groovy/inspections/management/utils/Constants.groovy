package inspections.management.utils

import groovy.transform.CompileStatic

@CompileStatic
class Constants {

    static final String SPAIN_TIMEZONE = "Europe/Madrid"
    static final List<String> CLOSED_ORDER_STATES = ['V', 'F', 'X']
    static final String SELECT_CORRECT_OPTION_CODE = 'C'

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

}

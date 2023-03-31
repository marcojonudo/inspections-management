package inspections.management.utils

import groovy.transform.CompileStatic

@CompileStatic
class Constants {

    static final String SPAIN_TIMEZONE = "Europe/Madrid"
    static final List<String> CLOSED_ORDER_STATES = ['V', 'X', 'F']
    static final String CANCELED_ORDER_STATE = 'X'
    static final String APPOINTMENT_IDENTIFIER = "C"
    static final int ROW_IMAGES = 4
    static final List<String> CAR_POSITION = ['DI', 'DD', 'TI', 'TD']
    static final String DEPTH_ITEM_PREFIX = 'PN'
    static final float KW_TO_CV_FACTOR = 1.35962

    static class DataSource {

        static final String FVIBERI = "fviberi"
        static final String HESTIA_FVIBERI = "hestia-fviberi"
        static final String SCHEDULES = "schedules"

    }

    static class DateFormat {

        static final String yyyy_MM_dd = "yyyy-MM-dd"
        static final String dd_MM_yyyy = "dd/MM/yyyy"

    }

    static class DateTimeFormat {

        static final String yyyy_MM_dd_HH_mm_ss = "yyyy-MM-dd HH:mm:ss"

    }

    static class Message {

        static final String SAVING_INSPECTION = "Saving inspection"
        static final String EXISTENT_INSPECTION_SAVED = "Existent inspection saved values"
        static final String NEW_DATA_SAVED = "New inspection data saved value"
        static final String ERROR_SAVING_INSPECTION = "Error saving inspection"
        static final String ERROR_SENDING_MAIL = "Error sending mail!"
        static final String ERROR_SENDING_SMS = "Error sending SMS"
        static final String SAVED_INSPECTION = "Saved inspection!"
        static final String GENERATING_PDF = "Generating PDF..."
        static final String GENERATED_PDF = "PDF file generated!"
        static final String SENDING_MAIL = "Sending inspection mail..."
        static final String SENDING_SMS = "Sending inspection SMS..."
        static final String CONVERTING_PDF_IMAGE = "Converting PDF file to image..."
        static final String CONVERTED_PDF_IMAGE = "PDF converted to image!"
        static final String SENT_MAIL = "Mail sent!"
        static final String SENT_SMS = "SMS sent!"
        static final String FINISHED_SMS_PROCESS = "Finished SMS process!"
        static final String SLACK_WRONG_REQUEST = "Slack wrong request!"
        static final String CALC_POWER_ERROR = "Error calculating vehicle power"

    }

    static class SelectItemOption {

        static final String NA = "NA"

    }

    static class ItemCode {

        static final String CVGN = "CVGN"
        static final String PPN = "PPN"
        static final String PN = "PN"

    }

    static class InspectionType {

        static final String N = "N"

    }

}

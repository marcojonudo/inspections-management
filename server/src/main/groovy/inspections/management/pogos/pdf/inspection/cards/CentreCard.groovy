package inspections.management.pogos.pdf.inspection.cards

import groovy.transform.CompileStatic
import inspections.management.domains.fviberi.Centre
import inspections.management.i18n.CustomMessageSource
import inspections.management.pogos.pdf.inspection.cards.title.CardTitle
import inspections.management.pogos.pdf.structure.cards.KeyValueCard
import inspections.management.pogos.pdf.structure.elements.KeyValueSection
import org.apache.commons.text.WordUtils

@CompileStatic
class CentreCard extends KeyValueCard {

    CentreCard(Centre centre) {
        this.id = "centre-card"
        this.title = new CardTitle("img/icons/home.svg", CustomMessageSource.getMessage("print.centre.title"))
        this.sections = [new KeyValueSection("", WordUtils.capitalizeFully(centre.name.trim()))]
        if (centre.addressLine1) {
            this.sections << new KeyValueSection("", WordUtils.capitalizeFully(centre.addressLine1.trim()))
        }
        if (centre.addressLine2) {
            this.sections << new KeyValueSection("", WordUtils.capitalizeFully(centre.addressLine2.trim()))
        }
        if (centre.addressLine3) {
            this.sections << new KeyValueSection("", WordUtils.capitalizeFully(centre.addressLine3.trim()))
        }
        if (centre.phoneNumber) {
            this.sections << new KeyValueSection("", WordUtils.capitalizeFully(centre.phoneNumber.trim()))
        }
    }

}

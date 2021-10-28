package inspections.management.domains

import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class Image implements GormEntity<Image> {

	byte[] image
	boolean landscape

	@Override
	boolean equals(Object obj) {
		Image img = (Image) obj
		return image == img.image && landscape == img.landscape
	}

}

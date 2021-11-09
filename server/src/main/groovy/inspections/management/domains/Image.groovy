package inspections.management.domains

import grails.gorm.annotation.Entity
import groovy.transform.TupleConstructor
import org.grails.datastore.gorm.GormEntity

@Entity
@TupleConstructor
class Image implements GormEntity<Image> {

	byte[] image
	boolean landscape

	@Override
	boolean equals(Object obj) {
		Image img = (Image) obj
		return image == img.image && landscape == img.landscape
	}

}

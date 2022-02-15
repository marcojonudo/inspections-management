package inspections.management.pogos.pdf.structure.cards

import groovy.transform.CompileStatic
import inspections.management.pogos.pdf.structure.elements.Title

@CompileStatic
class ItemImageCard extends Card {

    String text

    ItemImageCard(Title title, String text) {
        this.title = title
        this.text = text
    }

    String toHtml() {
        return """
            <div class="${findClasses()}">
                ${title.toHtml()}
                <div class="card-content">
					<div class="image-category-content">
						<div class="image-item" [class.span]="findImage(elem.listElement.imageId)?.landscape">
							<img [src]="findImageUrl(elem.listElement.imageId)" class="item-image">
						</div>
					</div>
                </div>
            </div>
        """
    }

}

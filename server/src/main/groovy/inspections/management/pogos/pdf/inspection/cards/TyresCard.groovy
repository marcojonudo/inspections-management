package inspections.management.pogos.pdf.inspection.cards

import groovy.transform.CompileStatic
import groovy.transform.TupleConstructor
import inspections.management.domains.items.SelectItemOption
import inspections.management.domains.savedItems.SavedItem
import inspections.management.domains.savedItems.SelectSavedItem
import inspections.management.pogos.pdf.CategoryItems
import inspections.management.pogos.pdf.inspection.cards.title.CardTitle
import inspections.management.pogos.pdf.inspection.elements.ItemImage
import inspections.management.pogos.pdf.structure.cards.Card
import inspections.management.pogos.pdf.structure.elements.Image
import inspections.management.services.PdfService

@CompileStatic
@TupleConstructor
class TyresCard extends Card {

    private static float BAR_WIDTH = 192
    private static float BAR_WIDTH_MM = 7
    private static float DEPTH_THRESHOLD_MM = 1.6
    private static float DEPTH_BAR_MARGIN = 10
    private static float DEPTH_BAR_PADDING = 4
    private static String DEPTH_ITEM_PREFIX = 'PN'
    private static String STATE_ITEM_PREFIX = 'EN'
    private static String AGE_ITEM_PREFIX = 'FN'
    private static Map<String, String> VISUAL_CONTROL_COLOR = [
        C: 'green',
        SN: 'red'
    ]

    private float barWidth
    private List<List<CategoryItems>> groupedCategories
    private SelectSavedItem visualControlSavedItem
    private SavedItem measurementSavedItem
    private SelectSavedItem pressureSavedItem
    private List<SelectItemOption> options

    TyresCard(
        List<CategoryItems> categories,
        SavedItem visualControlSavedItem,
        SavedItem measurementSavedItem,
        SavedItem pressureSavedItem,
        List<SelectItemOption> options
    ) {
        super()
        title = new CardTitle("img/icons/right-arrow.svg", "Neumáticos")
        this.classes << "category"
        barWidth = (float) (BAR_WIDTH - (DEPTH_BAR_PADDING * 4) - (DEPTH_BAR_MARGIN * 2))
        groupedCategories = categories.collate(2)
        this.visualControlSavedItem = (SelectSavedItem) visualControlSavedItem
        this.measurementSavedItem = measurementSavedItem
        this.pressureSavedItem = (SelectSavedItem) pressureSavedItem
        this.options = options
    }

    String toHtml() {
        return """
            <div class="${findClasses()}">
                ${title.toHtml()}
                <div class="card-content">
                    ${groupedCategories.collect { buildRow(it) }.join("\n")}
                    ${buildCentralImage()}
                </div>
            </div>
        """
    }

    String buildRow(List<CategoryItems> categories) {
        int i = -1
        return """
            <div class="tyre-row">
                ${categories.collect { buildSection(it, ++i) }.join("\n")}
            </div>
        """
    }
    
    String buildCentralImage() {
        return """
            <div id="central-image">
                <div>
                    <img id="car-axis" src="img/car-axis.png"/>
                    <img id="steering-wheel" src="img/steering-wheel/${findVisualControlColorName(visualControlSavedItem.findValue())}-steering-wheel.png"/>
                    <div id="visual-control-item" class="item">
                        <div>Control visual geometría</div>
                        ${new ItemImage("img/icons/${visualControlSavedItem.findIcon()}.svg", SelectSavedItem.Value.valueOf(visualControlSavedItem.value).color).toHtml()}
                    </div>
                    <div id="pressure-item" class="item">
                        <div>Puesta a presión neumáticos</div>
                        ${new ItemImage("img/icons/${pressureSavedItem.findIcon()}.svg", SelectSavedItem.Value.valueOf(pressureSavedItem.value).color).toHtml()}
                    </div>
                </div>
            </div>
        """
    }
    
    String buildSection(CategoryItems categoryItems, int order) {
        SavedItem depthItem = categoryItems.items.find { it.item.code.startsWith(DEPTH_ITEM_PREFIX) }
        SavedItem ageItem = categoryItems.items.find { it.item.code.startsWith(AGE_ITEM_PREFIX) }
        SelectSavedItem stateItem = (SelectSavedItem) categoryItems.items.find {
            it.item.code.startsWith(STATE_ITEM_PREFIX)
        }
        return """
            <div class="tyre-section">
                ${order ? buildRightSection(depthItem, ageItem) : buildLeftSection(categoryItems.category.name, depthItem, stateItem)}
                ${order ? buildLeftSection(categoryItems.category.name, depthItem, stateItem) : buildRightSection(depthItem, ageItem)}                
            </div>
        """
    }

    String buildLeftSection(String name, SavedItem depthItem, SelectSavedItem stateItem) {
        return """
            <div class="tyre-section-wrapper">
                <div class="tyre-section-header">
                    <div class="measurement-name">
                        <span>Neumático</span>&nbsp;$name</div>
                    <div class="measurement-value">${measurementSavedItem.findValue()}</div>
                </div>
                <div class="photo-wrapper">
                    ${depthItem.imageId ? new Image([], null, PdfService.buildImageUrl(depthItem)).toHtml() : buildNoImageTemplate()}
                </div>
                <div class="tyre-state">
                    <div>Estado neumático</div>
                    ${new ItemImage("img/icons/${stateItem.findIcon()}.svg", SelectSavedItem.Value.valueOf(stateItem.value).color).toHtml()}
                </div>
                <div class="state-graph">
                    <div class="state-name">${options.find { it.code == stateItem.value}.name}</div>
                    <div class="state-graph-bar-wrapper">
                        <div
                            class="indicator ${depthItem.findValue() ? '' : 'hide'}"
                            style="left: ${findIndicatorLeft(depthItem.findValue())}px">
                            <div>${depthItem.findValue()}mm</div>
                            <img src="img/indicators/${findDepthColorName(depthItem.findValue())}-indicator.png"/>
                        </div>
                        <div class="bar-wrapper">
                            <div class="bar"></div>
                            <div class="bar-measurements">
                                <span class="hide">0mm</span>
                                <span class="hide">1mm</span>
                                <span class="hide">2mm</span>
                                <span>3mm</span>
                                <span class="hide">4mm</span>
                                <span>5mm</span>
                                <span class="hide">6mm</span>
                                <span>7mm</span>
                            </div>
                            <div class="threshold-indicator" style="left: ${findThresholdLeft()}px"></div>
                        </div>
                    </div>
                    <div class="threshold-text">1.6mm mínimo legal</div>
                </div>
            </div>
        """
    }

    static String buildRightSection(SavedItem depthItem, SavedItem ageItem) {
        return """
            <div class="depth-section">
                <div class="depth">
                    <div class="depth-section-title" translate>Profundidad neumático</div>
                    <div
                        class="depth-section-value ${depthItem.findValue() ? findDepthColorName(depthItem.findValue()) : 'white'}-background">
                        ${depthItem.findValue() ? "${depthItem.findValue()}mm" : '-'}
                    </div>
                </div>
                <img src="img/tyres/${findDepthColorName(depthItem.findValue())}-tyre.jpg"/>
                <div>
                    <div class="depth-section-title">Edad neumático</div>
                    <div class="depth-section-value">${ageItem.findValue() ?: '-'}</div>
                </div>
            </div>
        """
    }

    static String buildNoImageTemplate() {
        return """
            <div class="no-image">
                <img src="img/icons/no_photography.svg">
            </div>
        """
    }

    float findIndicatorLeft(String depth) {
        float d = depth?.isNumber() ? depth as float : 0
        d = d > BAR_WIDTH_MM ? BAR_WIDTH_MM : (d < 0 ? 0 : d)
        return DEPTH_BAR_MARGIN + (d * barWidth / BAR_WIDTH_MM) - 6
    }

    float findThresholdLeft() {
        return DEPTH_BAR_MARGIN + (DEPTH_THRESHOLD_MM * barWidth / BAR_WIDTH_MM) - 1.3
    }

    static String findDepthColorName(String depth) {
        float d = depth?.isNumber() ? depth as float : 0
        return d >= 4.1 ? 'green' : (d <= 2.09 ? 'red' : 'orange');
    }

    static String findVisualControlColorName(String value) {
        return VISUAL_CONTROL_COLOR.get(value, 'orange')
    }

}

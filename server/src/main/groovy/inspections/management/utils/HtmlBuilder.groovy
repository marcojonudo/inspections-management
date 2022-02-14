package inspections.management.utils

import groovy.transform.CompileStatic
import inspections.management.domains.Image
import inspections.management.domains.SavedInspection
import inspections.management.domains.fviberi.Centre
import inspections.management.domains.fviberi.Order
import inspections.management.domains.items.Item
import inspections.management.domains.items.SelectItem
import inspections.management.domains.items.TextItem
import inspections.management.domains.savedItems.SavedItem
import inspections.management.domains.savedItems.SelectSavedItem
import inspections.management.domains.savedItems.TextAreaSavedItem
import inspections.management.domains.savedItems.TextSavedItem
import inspections.management.pogos.pdf.CategoryItems
import inspections.management.pogos.pdf.inspection.PdfInspection
import inspections.management.pogos.vehicles.CarVehicle
import inspections.management.pogos.vehicles.ScooterVehicle
import org.apache.commons.text.WordUtils

import java.time.LocalDate
import java.time.format.DateTimeFormatter

@CompileStatic
class HtmlBuilder {

    private static final HEAD = """
        <head>
            <meta charset="UTF-8">
            <title>Revisiones</title>
            <link rel="stylesheet" href="css/inspection.css">
            <link rel="stylesheet" href="css/fonts.css">
        </head>
    """

    private static String buildAdviserDiv(Order order) {
        String text = ""
        if (order.sellerCode) {
            text = """
                <div>
                    <div>Asesor</div>
                    <div>$order.sellerCode</div>
                </div>
            """
        }
        return text
    }

    private static String buildInfoCard(Order order, SavedInspection savedInspection) {
        String card = """
            <div id="info-card" class="card">
                <div class="card-title">
                    <img src="img/icons/info.svg" class="icon"/>
                    <div>Información</div>
                </div>
                <div class="card-content">
                    <div class="key-value-section">
                        <div>
                            <div>Día</div>
                            <div>${LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))}</div>
                        </div>
                        ${buildAdviserDiv(order)}
                        <div>
                            <div>Nº orden</div>
                            <div>$order.code · $order.number</div>
                        </div>
                        <div>
                            <div>Mecánico</div>
                            <div class="column">
                                <div>$savedInspection.employeeCode</div>
                                <!--                            <div *ngFor="let mechanic of mechanics">-->
                                <!--                                {{mechanic.name | titlecase}}-->
                                <!--                            </div>-->
                            </div>
                        </div>
                    </div>
                    <div class="key-value-section">
                        <div>
                            <div>Cliente</div>
                            <div>$order.client.name</div>
                        </div>
                    </div>
                </div>
            </div>
        """
        return card
    }

    private static String buildCentreCard(Centre centre) {
        return """
            <div id="centre-card" class="card">
                <div class="card-title">
                    <img src="img/icons/home.svg" class="icon"/>
                    <div>Centro</div>
                </div>
                <div class="card-content">
                    <span>${centre.name ? WordUtils.capitalizeFully(centre.name.trim()) : ''}</span>
                    <span>${centre.addressLine1 ? WordUtils.capitalizeFully(centre.addressLine1.trim()) : ''}</span>
                    <span>${centre.addressLine2 ? WordUtils.capitalizeFully(centre.addressLine2.trim()) : ''}</span>
                    <span>${centre.addressLine3 ? WordUtils.capitalizeFully(centre.addressLine3.trim()) : ''}</span>
                    <span>${centre.phoneNumber ? WordUtils.capitalizeFully(centre.phoneNumber.trim()) : ''}</span>
                </div>
            </div>
        """
    }

    private static String buildVehicleCard(Order order, Set<SavedItem> items) {
        String text
        if (order.vehicleType == Order.VehicleType.E_SCOOTER.type) {
            text = buildScooter((ScooterVehicle) order.vehicle)
        } else {
            Set<SavedItem> headerItems = items.findAll { it.item.header }
            text = buildCar((CarVehicle) order.vehicle, headerItems)
        }
        return text
    }

    private static String buildCar(CarVehicle car, Set<SavedItem> headerItems) {
        return """
            <div id="vehicle-card" class="card">
                <div class="card-title">
                    <img src="img/icons/car.svg" class="icon"/>
                    <div>Vehículo</div>
                </div>
                <div class="card-content">
                    <div class="key-value-section">
                        <div>
                            <div>Matrícula</div>
                            <div>$car.identifier</div>
                        </div>
                        <div>
                            <div>Modelo</div>
                            <div>${WordUtils.capitalizeFully(car.brand)} ${WordUtils.capitalizeFully(car.model)}</div>
                        </div>
                        <div>
                            <div>Cilindrada</div>
                            <span>${car.cylinder ?: "-"}</span>
                        </div>
                        <div>
                            <div>Motor</div>
                            <div>${car.engineCode ?: "-"}</div>
                        </div>
                        <div>
                            <div>Potencia</div>
                            <div>${car.power ? "${car.power}cv" : ""}</div>
                        </div>
                        <div>
                            <div>Matriculación</div>
                            <div>${car.registrationYear ?: '-'}</div>
                        </div>
                        ${headerItems.sort { it.item.printOrder }.collect { buildHeaderItem(it) }.join("") }
                    </div>
                </div>
            </div>
        """
    }

    private static String buildScooter(ScooterVehicle scooter) {
        return """
            <div id="vehicle-card" class="card">
                <div class="card-title">
                    <img src="img/icons/scooter.svg" class="icon"/>
                    <div>Patinete</div>
                </div>
                <div class="card-content">
                    <div class="key-value-section">
                        <div>
                            <div>Número serie</div>
                            <div>$scooter.identifier</div>
                        </div>
                        <div>
                            <div>Modelo</div>
                            <div>$scooter.brand $scooter.model</div>
                        </div>
                    </div>
                </div>
            </div>
        """
    }

    private static String buildHeaderItem(SavedItem savedItem) {
        return """
            <div>
                <div>$savedItem.item.name</div>
                <div>${savedItem.findValue()}</div>
            </div>
        """
    }

    private static String buildSummaryCard() {
        return """
            <div id="summary-card" class="card">
                <div class="card-title">
                    <img src="img/icons/info.svg" class="icon"/>
                    <div>Resumen</div>
                </div>
                <div id="summary-container" class="card-content">
                    <div id="summary">
                        <!--                    <canvas-->
                        <!--                        baseChart-->
                        <!--                        width="1px"-->
                        <!--                        height="1px"-->
                        <!--                        [chartType]="chartType"-->
                        <!--                        [options]="options"-->
                        <!--                        [colors]="colors"-->
                        <!--                        [data]="findData()">-->
                        <!--                    </canvas>-->
                    </div>
                </div>
            </div>
        """
    }

    private static String buildLegend() {
        return """
            <div id="legend-card" class="card">
                <div id="legend">
                    <div class="label">
                        <div class="label-color" style="background-color: #7b7979"></div>
                        <span>Selección pendiente</span>
                    </div>
                    <div class="label">
                        <div class="label-color" style="background-color: #36d23d"></div>
                        <span>Correcto</span>
                    </div>
                    <div class="label">
                        <div class="label-color" style="background-color: #ff6a00"></div>
                        <span>Planificar sustitución</span>
                    </div>
                    <div class="label">
                        <div class="label-color" style="background-color: #d23636"></div>
                        <span>Sustitución necesaria</span>
                    </div>
                    <div class="label">
                        <div class="label-color" style="background-color: #3681d2"></div>
                        <span>Realizado ajuste/cambio</span>
                    </div>
                    <!--            <div *ngFor="let label of groupLabels(findLabels())" class="label">-->
                    <!--                <div class="label-color" [style.background-color]="findIconColor(label.code)"></div>-->
                    <!--                <span>inspection.selectItemOption.{{label.code}}</span>-->
                    <!--            </div>-->
                </div>
            </div>
        """
    }

    private static String buildHeaderHtml(Centre centre, Order order, SavedInspection savedInspection) {
        StringBuilder builder = new StringBuilder("<div id=\"header\">")
        builder.append("""
            <div id="title">
                Revisión seguridad
                <img id="logo" src="img/feuvert-logo.png">
            </div>
        """)
        builder.append("<div id=\"info\">")
        builder.append(buildInfoCard(order, savedInspection))
        builder.append(buildCentreCard(centre))
        builder.append(buildVehicleCard(order, savedInspection.items))
//        builder.append(buildSummaryCard())
        builder.append("</div>")
        builder.append(buildLegend())
        builder.append("</div>")
        return builder.toString()
    }

    private static buildCategory(CategoryItems category) {
        String text
        if (category.category) {
            text = """
                <div class="category">
                    <div class="card">
                        <div class="card-title">
                            <img src="img/icons/right-arrow.svg" class="icon"/>
                            <div>$category.category.name</div>
                        </div>
                        <div class="card-content">
                            ${buildCategoryItems(category.items)}
                        </div>
                    </div>
                </div>
            """
        } else {
//            String[] itemText = ((TextAreaSavedItem) category.items[0]).text.split("\n")
            text = """
                <div class="category item-category">
                    <div class="card">
                        <div class="card-title">
                            <img src="img/icons/right-arrow.svg" class="icon"/>
                            <div>${category.items[0].item.name}</div>
                        </div>
                        <div class="card-content">
                            ${((TextAreaSavedItem) category.items[0]).text}
                        </div>
                    </div>
                </div>
            """
        }
        return text
    }

    private static buildImageCategory(CategoryItems category) {
        String text
        if (category.category) {
            text = """
                <div class="category image-category">
                    <div class="card">
                        <div class="card-title">
                            <img src="img/icons/right-arrow.svg" class="icon"/>
                            <div>$category.category.name</div>
                        </div>
                        <div class="card-content">
                            ${category.items.sort { it.item.printOrder }.collect { buildImageItem(it) }.join("")}
                        </div>
                    </div>
                </div>
            """
        } else {
//            String[] itemText = ((TextAreaSavedItem) category.items[0]).text.split("\n")
            text = """
                <div class="category">
                    <div class="card">
                        <div class="card-title">
                            <img src="img/icons/right-arrow.svg" class="icon"/>
                            <div>${category.items[0].item.name}</div>
                        </div>
                        <div class="card-content">
                            ${buildImageItem(category.items[0])}
                        </div>
                    </div>
                </div>
            """
        }
        return text
        // TODO Element template
    }

    private static buildImageItem(SavedItem savedItem) {
        String base64Code = new String(Base64.encoder.encode(savedItem.image.image))
        return """
            <div class="image-item">
                <div>$savedItem.item.name</div>
                <img src="data:image/png;base64,$base64Code">
            </div>
        """
    }

    private static buildCategoryItems(List<SavedItem> savedItems) {
        return savedItems.sort { it.item.printOrder }.collate(4).collect {
            "<div class=\"item-row\">${it.collect { it.buildHtml() }.join("")}</div>"
        }.join("")
    }

    static buildSelectItem(SelectSavedItem savedItem) {
        //TODO highlight, checkmultiplefields, icon color
        """
       <div class="item ${savedItem.value != SelectSavedItem.Value.C.toString() ? 'highlight' : ''}">
            <div class="item-text">
                $savedItem.item.name
            </div>
            <img src="img/icons/${((SelectItem) savedItem.item).options.find { it.code == savedItem.value }.printIcon}.svg" class="item-icon" style="color: ${SelectSavedItem.Value.valueOf(savedItem.value).color}"/>
        </div>
        """
    }

    static buildTextItem(TextSavedItem savedItem) {
        String value = savedItem.findValue()
        TextItem item = ((TextItem) savedItem.item)
        //TODO checkmultiplefields
        """
       <div class="item">
            <div class="item-text">
                $savedItem.item.name
            </div>
            <span class="item-text-value">$value</span>
            <span class="item-unit">${value ? item.unit ?: '' : ''}</span>
        </div>
        """
    }

    static buildPage(Centre centre, Order order, SavedInspection savedInspection, List<CategoryItems> categories) {
        return """
            <div class="page">
                <img src="img/car-background.svg" class="background-image"/>
                ${buildHeaderHtml(centre, order, savedInspection)}
                ${categories.collect { buildCategory(it) }.join("")}
            </div>
        """
    }

    static buildImagePage(Centre centre, Order order, SavedInspection savedInspection, List<CategoryItems> categories) {
        return """
            <div class="page">
                ${buildHeaderHtml(centre, order, savedInspection)}
                ${categories.collect { buildImageCategory(it) }.join("")}
            </div>
        """
    }
    
    static String buildHtml(
        Centre centre, Order order, String inspectionName, SavedInspection savedInspection, List<Image> images
    ) {
        List<CategoryItems> categories = buildPrintCategories(savedInspection.items)
        List<List<CategoryItems>> groupedCategories = buildGroupedCategories(categories)

        List<CategoryItems> imageCategories = []
        if (images) {
            Set<SavedItem> imageSavedItems = images.collect { Image i ->
                savedInspection.items.find { it.imageId == i.id }.tap { image = i }
            }.toSet()
            imageCategories = buildPrintCategories(imageSavedItems)
        }
        PdfInspection inspection = new PdfInspection(
            centre, order, inspectionName, savedInspection, groupedCategories, imageCategories
        )
        return inspection.toHtml()
    }

    static List<CategoryItems> buildPrintCategories(Set<SavedItem> savedItems) {
        List<CategoryItems> categories = []
        savedItems = savedItems.findAll {
            !it.item.header && (it.item.type == Item.Type.SELECT ? ((SelectSavedItem) it).value != 'NA' : true)
        }
        savedItems.each { SavedItem savedItem ->
            if (savedItem.item.category) {
                def existent = categories.find { it.category && it.category.code == savedItem.item.category.code }
                if (existent) {
                    existent.items << savedItem
                } else {
                    categories << new CategoryItems(savedItem, savedItem.item.category)
                }
            } else {
                categories << new CategoryItems(savedItem)
            }
        }
        return categories
    }

    static List<List<CategoryItems>> buildGroupedCategories(List<CategoryItems> categories) {
        categories = categories.sort { it.category ? it.category.order : 999 }
        int i = categories.findIndexOf { it.category?.code == "F" }
        return (List<List<CategoryItems>>) (i != -1 ? [categories[0..i], categories[i+1..-1]] : [categories])
    }

}

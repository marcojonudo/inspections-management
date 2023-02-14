package inspections.management.services

import groovy.transform.CompileStatic
import org.apache.pdfbox.pdmodel.PDDocument
import org.apache.pdfbox.rendering.ImageType
import org.apache.pdfbox.rendering.PDFRenderer

import javax.imageio.ImageIO
import javax.inject.Singleton
import java.awt.*
import java.awt.image.BufferedImage

@Singleton
@CompileStatic
class ConverterService {

	byte[] convertPdfToJpg(File pdfFile) {
		PDDocument document = PDDocument.load(pdfFile)
		PDFRenderer pdfRenderer = new PDFRenderer(document)
		BufferedImage bufferedImage = new BufferedImage(10, 10,  BufferedImage.TYPE_INT_ARGB)
		for (int page = 0; page < document.getNumberOfPages(); ++page) {
			BufferedImage bi = pdfRenderer.renderImageWithDPI(page, 300, ImageType.RGB)
			bufferedImage = joinBufferedImage(bufferedImage, bi)
		}
		ByteArrayOutputStream baos = new ByteArrayOutputStream()
		ImageIO.write(bufferedImage, "jpg", baos)
		byte[] bytes = baos.toByteArray()
		document.close()
		return bytes
	}

	BufferedImage joinBufferedImage(BufferedImage img1, BufferedImage img2) {
		int offset = 5
		int wid = Math.max(img1.getWidth(), img2.getWidth()) + offset
		int height = img1.getHeight()+ img2.getHeight() + offset
		BufferedImage newImage = new BufferedImage(wid, height, BufferedImage.TYPE_INT_RGB)
		Graphics2D g2 = newImage.createGraphics()
		Color oldColor = g2.getColor()
		g2.setPaint(Color.WHITE)
		g2.fillRect(0, 0, wid, height)
		g2.setColor(oldColor)
		g2.drawImage(img1, null, 0, 0)
		g2.drawImage(img2, null, 0 , img1.getHeight() + offset)
		g2.dispose()
		return newImage
	}

}

package inspections.management.services

import groovy.transform.CompileStatic
import inspections.management.domains.fviberi.MailData
import inspections.management.pogos.mails.MailSender
import inspections.management.pogos.mails.Protocol

import javax.activation.DataHandler
import javax.activation.DataSource
import javax.activation.FileDataSource
import javax.inject.Singleton
import javax.mail.*
import javax.mail.internet.InternetAddress
import javax.mail.internet.MimeBodyPart
import javax.mail.internet.MimeMessage
import javax.mail.internet.MimeMultipart

@Singleton
@CompileStatic
class MailService {

	private static Properties buildMailProperties(Protocol protocol, MailData mailData) {
		Properties properties = new Properties()
		protocol.sessionProperties.each { String key, Closure<String> findValue ->
			properties.setProperty(key, findValue(mailData))
		}
		return properties
	}

	static void sendMail(
		MailData mailData, MailSender sender, String to, String subject, String text, File file = null
	) {
		Properties properties = buildMailProperties(Protocol.SMTP, mailData)
		Session session = Session.getInstance(properties, new Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(mailData.email, mailData.password)
			}
		})

		MimeMessage message = new MimeMessage(session)
		message.setFrom(new InternetAddress(sender.from, sender.name))
		message.addRecipient(Message.RecipientType.TO, new InternetAddress(to))
		message.setSubject(subject)

		if (file) {
			Multipart multipart = buildAttachment(text, file)
			message.setContent(multipart)
		} else {
			message.setText(text)
		}

		Transport.send(message, message.getAllRecipients())
	}

	static Multipart buildAttachment(String text, File file) {
		Multipart multipart = new MimeMultipart()

		BodyPart messageBodyPart = new MimeBodyPart()
		messageBodyPart.setText(text)

		BodyPart fileBodyPart = new MimeBodyPart()
		DataSource dataSource = new FileDataSource(file)
		fileBodyPart.setDataHandler(new DataHandler(dataSource))
		fileBodyPart.setFileName(file.name[0..file.name.indexOf(".")+3])

		multipart.addBodyPart(messageBodyPart)
		multipart.addBodyPart(fileBodyPart)
		return multipart
	}

}

package inspections.management.services

import groovy.transform.CompileStatic
import inspections.management.clients.SudokuClient
import io.micronaut.http.HttpResponse
import io.micronaut.http.client.multipart.MultipartBody

import javax.inject.Inject
import javax.inject.Singleton

@Singleton
@CompileStatic
class SudokuService {

	@Inject private SudokuClient sudokuClient

	HttpResponse sendSms(File file, String fileName, int phoneNumber, String text) {
		MultipartBody requestBody = MultipartBody.builder()
			.addPart("file", file)
			.addPart("filename", fileName)
			.addPart("phone", "$phoneNumber")
			.addPart("text", text)
			.build()
		return sudokuClient.sendSms(requestBody)
	}

}

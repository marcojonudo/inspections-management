package inspections.management.services

import groovy.transform.CompileStatic

@CompileStatic
class FileService {

	static String findFileName(String fileName, String extension, boolean setExtension = false) {
		String name = fileName.split(extension)[0]
		return setExtension ? "$name$extension" : name[0..-2]
	}

	static File createTempFile(String name, String content = "") {
		File file = File.createTempFile(name, "")
		file.deleteOnExit()
		file.write(content)
		return file
	}

	static File createTempFile(String name, byte[] bytes) {
		File file = File.createTempFile(name, "")
		file.deleteOnExit()
		file.setBytes(bytes)
		return file
	}

}

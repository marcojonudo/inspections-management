package inspections.management.services

import com.cloudmersive.client.ConvertDocumentApi
import com.cloudmersive.client.invoker.ApiClient
import com.cloudmersive.client.invoker.ApiException
import com.cloudmersive.client.invoker.Configuration
import com.cloudmersive.client.invoker.auth.ApiKeyAuth
import groovy.transform.CompileStatic
import io.micronaut.context.annotation.Property

import javax.inject.Singleton

@Singleton
@CompileStatic
class ConverterService {

	private static final int TIMEOUT = 30000

	@Property(name = "services.cloudmersive.token")
	private String token

	byte[] convertPdfToPng(File file) throws ApiException {
		ApiClient defaultClient = Configuration.getDefaultApiClient()
		defaultClient.setReadTimeout(TIMEOUT)
		defaultClient.setConnectTimeout(TIMEOUT)
		defaultClient.setWriteTimeout(TIMEOUT)

		ApiKeyAuth Apikey = (ApiKeyAuth) defaultClient.getAuthentication("Apikey")
		Apikey.setApiKey(token)

		ConvertDocumentApi apiInstance = new ConvertDocumentApi()
		return apiInstance.convertDocumentPdfToPngSingle(file)
	}

}

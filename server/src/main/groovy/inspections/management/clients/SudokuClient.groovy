package inspections.management.clients

import groovy.transform.CompileStatic
import io.micronaut.http.HttpResponse
import io.micronaut.http.MediaType
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Post
import io.micronaut.http.client.annotation.Client
import io.micronaut.http.client.multipart.MultipartBody
import io.micronaut.retry.annotation.Retryable

import javax.inject.Singleton

@Singleton
@CompileStatic
@Client("\${services.sudoku.url}")
interface SudokuClient {

    @Post(produces = MediaType.MULTIPART_FORM_DATA)
    @Retryable
    HttpResponse sendSms(@Body MultipartBody body)

}

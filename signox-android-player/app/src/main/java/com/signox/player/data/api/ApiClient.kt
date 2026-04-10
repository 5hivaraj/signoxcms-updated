package com.signox.player.data.api

import com.signox.player.BuildConfig
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object ApiClient {
    
    // HARDCODED SERVER URL - App will always connect to this URL
    // No server configuration screen will be shown
    // TEMP (local testing): point to your backend machine IP.
    // Change back to production domain before shipping APK.
    private const val FIXED_BASE_URL = "http://192.168.1.130:5000/api"
    private var baseUrl: String = FIXED_BASE_URL
    private var retrofit: Retrofit? = null
    
    fun setBaseUrl(url: String) {
        // Ignored - URL is permanently fixed to FIXED_BASE_URL
        // This method is kept for compatibility but does nothing
    }
    
    fun getBaseUrl(): String = baseUrl
    
    fun hasBaseUrl(): Boolean = true
    
    private fun getRetrofit(): Retrofit {
        if (retrofit == null) {
            val currentBaseUrl = baseUrl
            
            val logging = HttpLoggingInterceptor().apply {
                level = if (BuildConfig.DEBUG) {
                    HttpLoggingInterceptor.Level.BODY
                } else {
                    HttpLoggingInterceptor.Level.NONE
                }
            }
            
            val client = OkHttpClient.Builder()
                .addInterceptor(logging)
                .connectTimeout(30, TimeUnit.SECONDS)
                .readTimeout(30, TimeUnit.SECONDS)
                .writeTimeout(30, TimeUnit.SECONDS)
                .build()
            
            retrofit = Retrofit.Builder()
                .baseUrl("$currentBaseUrl/")
                .client(client)
                .addConverterFactory(GsonConverterFactory.create())
                .build()
        }
        return retrofit!!
    }
    
    val api: SignoXApi by lazy {
        getRetrofit().create(SignoXApi::class.java)
    }
    
    fun getMediaUrl(mediaUrl: String): String {
        return if (mediaUrl.startsWith("http")) {
            mediaUrl
        } else {
            // Media files are served from /uploads, not /api/uploads
            // Remove /api from base URL for media files
            val mediaBaseUrl = FIXED_BASE_URL.replace("/api", "")
            "$mediaBaseUrl${mediaUrl}"
        }
    }
}
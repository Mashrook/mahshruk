package com.mashrouk.travel.data

import retrofit2.http.GET

interface ApiService {
    @GET("destinations")
    suspend fun getDestinations(): List<Destination>

    @GET("hotels")
    suspend fun getHotels(): List<Hotel>

    @GET("packages")
    suspend fun getPackages(): List<TravelPackage>
}

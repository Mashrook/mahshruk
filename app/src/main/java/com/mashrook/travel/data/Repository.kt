package com.mashrouk.travel.data

class Repository {
    suspend fun fetchDestinations(): List<Destination> = ApiClient.api.getDestinations()
    suspend fun fetchHotels(): List<Hotel> = ApiClient.api.getHotels()
    suspend fun fetchPackages(): List<TravelPackage> = ApiClient.api.getPackages()
}

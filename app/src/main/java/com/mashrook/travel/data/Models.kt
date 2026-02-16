package com.mashrouk.travel.data

import com.google.gson.annotations.SerializedName

data class Destination(
    val id: Int,
    @SerializedName("name_ar") val nameAr: String,
    @SerializedName("name_en") val nameEn: String?,
    val country: String,
    val city: String,
    @SerializedName("short_description") val shortDescription: String,
    @SerializedName("main_image_url") val mainImageUrl: String?
)

data class Hotel(
    val id: Int,
    val name: String,
    @SerializedName("destination_id") val destinationId: Int,
    val stars: Int,
    val description: String,
    @SerializedName("price_per_night_from") val pricePerNightFrom: Double,
    val currency: String
)

data class TravelPackage(
    val id: Int,
    val title: String,
    val description: String,
    @SerializedName("destination_id") val destinationId: Int,
    val nights: Int,
    val price: Double,
    val currency: String
)

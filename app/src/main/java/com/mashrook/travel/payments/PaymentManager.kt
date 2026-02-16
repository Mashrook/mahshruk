package com.mashrouk.travel.payments

import android.content.Context

class PaymentManager(private val context: Context) {
    fun payWithSamsungPay(amount: Double, currency: String): String {
        return "Samsung Pay integration placeholder: $amount $currency"
    }

    fun payWithCard(amount: Double, currency: String): String {
        return "Card payment placeholder: $amount $currency"
    }
}

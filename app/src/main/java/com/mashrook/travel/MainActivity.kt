package com.mashrouk.travel

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import com.mashrouk.travel.ui.MashroukTravelApp
import com.mashrouk.travel.ui.theme.MashroukTravelTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MashroukTravelTheme {
                Surface(color = MaterialTheme.colorScheme.background) {
                    MashroukTravelApp()
                }
            }
        }
    }
}

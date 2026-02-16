package com.mashrouk.travel.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

private val LightColors = lightColorScheme(
    primary = BluePrimary,
    secondary = BlueSecondary,
    tertiary = TealAccent
)

private val DarkColors = darkColorScheme(
    primary = BluePrimary,
    secondary = BlueSecondary,
    tertiary = TealAccent
)

@Composable
fun MashroukTravelTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = LightColors,
        typography = Typography,
        content = content
    )
}

package com.mashrouk.travel.ui

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.mashrouk.travel.R
import com.mashrouk.travel.data.Destination

@Composable
fun HomeScreen(modifier: Modifier = Modifier, vm: TravelViewModel = viewModel()) {
    val uiState by vm.uiState.collectAsState()

    Column(modifier.padding(16.dp)) {
        Image(
            painter = painterResource(R.drawable.mashrouk_travel_logo),
            contentDescription = stringResource(R.string.logo_content_description),
            modifier = Modifier
                .fillMaxWidth()
                .height(96.dp)
        )
        Spacer(modifier = Modifier.height(12.dp))
        Text(text = stringResource(R.string.travel_title), style = MaterialTheme.typography.headlineSmall)
        Spacer(modifier = Modifier.height(6.dp))
        Text(text = stringResource(R.string.travel_intro), style = MaterialTheme.typography.bodyMedium)
        Spacer(modifier = Modifier.height(12.dp))
        Text(text = stringResource(R.string.travel_subtitle), style = MaterialTheme.typography.bodyMedium)
        Spacer(modifier = Modifier.height(16.dp))

        Text(text = stringResource(R.string.travel_sections_title), style = MaterialTheme.typography.titleMedium)
        Spacer(modifier = Modifier.height(8.dp))
        Text(text = stringResource(R.string.travel_section_1), style = MaterialTheme.typography.bodySmall)
        Text(text = stringResource(R.string.travel_section_2), style = MaterialTheme.typography.bodySmall)
        Text(text = stringResource(R.string.travel_section_3), style = MaterialTheme.typography.bodySmall)
        Text(text = stringResource(R.string.travel_section_4), style = MaterialTheme.typography.bodySmall)
        Text(text = stringResource(R.string.travel_section_5), style = MaterialTheme.typography.bodySmall)
        Spacer(modifier = Modifier.height(16.dp))

        when {
            uiState.isLoading -> CircularProgressIndicator()
            uiState.destinations.isNotEmpty() -> {
                if (!uiState.error.isNullOrBlank()) {
                    Text(text = uiState.error ?: "", style = MaterialTheme.typography.bodySmall)
                    Spacer(modifier = Modifier.height(8.dp))
                }
                LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    items(uiState.destinations) { destination ->
                        DestinationCard(destination)
                    }
                }
            }
            else -> Text(text = uiState.error ?: "No data")
        }

        Spacer(modifier = Modifier.height(16.dp))
        Text(text = stringResource(R.string.contact_title), style = MaterialTheme.typography.titleMedium)
        Spacer(modifier = Modifier.height(6.dp))
        Text(text = stringResource(R.string.contact_phone), style = MaterialTheme.typography.bodySmall)
        Text(text = stringResource(R.string.contact_whatsapp), style = MaterialTheme.typography.bodySmall)
        Text(text = stringResource(R.string.contact_email), style = MaterialTheme.typography.bodySmall)
    }
}

@Composable
private fun DestinationCard(destination: Destination) {
    Card {
        Column(Modifier.padding(16.dp)) {
            Text(destination.nameAr, style = MaterialTheme.typography.titleMedium)
            Spacer(Modifier.height(6.dp))
            Text(destination.shortDescription, style = MaterialTheme.typography.bodySmall)
            Spacer(Modifier.height(8.dp))
            Text("${destination.city}, ${destination.country}", style = MaterialTheme.typography.bodyMedium)
        }
    }
}

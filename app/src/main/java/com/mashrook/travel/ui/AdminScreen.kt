package com.mashrouk.travel.ui

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import com.mashrouk.travel.R

data class AdminDestinationItem(
    val name: String,
    val city: String,
    val country: String,
    val description: String,
    val priceFrom: String
)

@Composable
fun AdminScreen(modifier: Modifier = Modifier) {
    var selectedTab by remember { mutableStateOf(0) }
    var name by remember { mutableStateOf("") }
    var city by remember { mutableStateOf("") }
    var country by remember { mutableStateOf("") }
    var description by remember { mutableStateOf("") }
    var priceFrom by remember { mutableStateOf("") }
    var editingIndex by remember { mutableStateOf<Int?>(null) }

    val items = remember {
        mutableStateListOf(
            AdminDestinationItem("الرياض", "Riyadh", "Saudi Arabia", "وجهة أعمال وترفيه", "1200"),
            AdminDestinationItem("دبي", "Dubai", "UAE", "وجهة فاخرة للتسوق", "1800")
        )
    }

    Column(modifier.padding(16.dp)) {
        Text(text = stringResource(R.string.admin_title), style = MaterialTheme.typography.headlineSmall)
        Spacer(modifier = Modifier.height(6.dp))
        Text(text = stringResource(R.string.admin_subtitle), style = MaterialTheme.typography.bodySmall)
        Spacer(modifier = Modifier.height(16.dp))
        TabRow(selectedTabIndex = selectedTab) {
            Tab(
                selected = selectedTab == 0,
                onClick = { selectedTab = 0 },
                text = { Text(stringResource(R.string.admin_tab_destinations)) }
            )
            Tab(
                selected = selectedTab == 1,
                onClick = { selectedTab = 1 },
                text = { Text(stringResource(R.string.admin_tab_bookings)) }
            )
            Tab(
                selected = selectedTab == 2,
                onClick = { selectedTab = 2 },
                text = { Text(stringResource(R.string.admin_tab_settings)) }
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        when (selectedTab) {
            0 -> {
                AdminDestinationsSection(
                    name = name,
                    onNameChange = { name = it },
                    city = city,
                    onCityChange = { city = it },
                    country = country,
                    onCountryChange = { country = it },
                    description = description,
                    onDescriptionChange = { description = it },
                    priceFrom = priceFrom,
                    onPriceFromChange = { priceFrom = it },
                    editingIndex = editingIndex,
                    onEditingIndexChange = { editingIndex = it },
                    items = items
                )
            }
            1 -> AdminBookingsSection()
            else -> AdminSettingsSection()
        }
    }
}

@Composable
private fun AdminDestinationsSection(
    name: String,
    onNameChange: (String) -> Unit,
    city: String,
    onCityChange: (String) -> Unit,
    country: String,
    onCountryChange: (String) -> Unit,
    description: String,
    onDescriptionChange: (String) -> Unit,
    priceFrom: String,
    onPriceFromChange: (String) -> Unit,
    editingIndex: Int?,
    onEditingIndexChange: (Int?) -> Unit,
    items: MutableList<AdminDestinationItem>
) {
    var localName by remember { mutableStateOf(name) }
    var localCity by remember { mutableStateOf(city) }
    var localCountry by remember { mutableStateOf(country) }
    var localDescription by remember { mutableStateOf(description) }
    var localPriceFrom by remember { mutableStateOf(priceFrom) }

    LaunchedEffect(name, city, country, description, priceFrom) {
        localName = name
        localCity = city
        localCountry = country
        localDescription = description
        localPriceFrom = priceFrom
    }

    OutlinedTextField(
        value = localName,
        onValueChange = {
            localName = it
            onNameChange(it)
        },
        label = { Text(stringResource(R.string.admin_destination_name)) },
        modifier = Modifier.fillMaxWidth()
    )
    Spacer(modifier = Modifier.height(8.dp))
    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        OutlinedTextField(
            value = localCity,
            onValueChange = {
                localCity = it
                onCityChange(it)
            },
            label = { Text(stringResource(R.string.admin_destination_city)) },
            modifier = Modifier.weight(1f)
        )
        OutlinedTextField(
            value = localCountry,
            onValueChange = {
                localCountry = it
                onCountryChange(it)
            },
            label = { Text(stringResource(R.string.admin_destination_country)) },
            modifier = Modifier.weight(1f)
        )
    }
    Spacer(modifier = Modifier.height(8.dp))
    OutlinedTextField(
        value = localDescription,
        onValueChange = {
            localDescription = it
            onDescriptionChange(it)
        },
        label = { Text(stringResource(R.string.admin_destination_description)) },
        modifier = Modifier.fillMaxWidth()
    )
    Spacer(modifier = Modifier.height(8.dp))
    OutlinedTextField(
        value = localPriceFrom,
        onValueChange = {
            localPriceFrom = it
            onPriceFromChange(it)
        },
        label = { Text(stringResource(R.string.admin_destination_price_from)) },
        modifier = Modifier.fillMaxWidth()
    )
    Spacer(modifier = Modifier.height(12.dp))

    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        Button(onClick = {
            if (localName.isBlank()) return@Button
            val item = AdminDestinationItem(localName, localCity, localCountry, localDescription, localPriceFrom)
            val index = editingIndex
            if (index == null) {
                items.add(item)
            } else {
                items[index] = item
                onEditingIndexChange(null)
            }
            onNameChange("")
            onCityChange("")
            onCountryChange("")
            onDescriptionChange("")
            onPriceFromChange("")
        }) {
            Text(text = if (editingIndex == null) stringResource(R.string.admin_add) else stringResource(R.string.admin_update))
        }
        OutlinedButton(onClick = {
            onNameChange("")
            onCityChange("")
            onCountryChange("")
            onDescriptionChange("")
            onPriceFromChange("")
            onEditingIndexChange(null)
        }) {
            Text(text = stringResource(R.string.admin_clear))
        }
    }

    Spacer(modifier = Modifier.height(16.dp))
    Text(text = stringResource(R.string.admin_list_title), style = MaterialTheme.typography.titleMedium)
    Spacer(modifier = Modifier.height(8.dp))

    LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
        itemsIndexed(items) { index, item ->
            Card {
                Column(Modifier.padding(12.dp)) {
                    Text(item.name, style = MaterialTheme.typography.titleSmall)
                    Text(item.description, style = MaterialTheme.typography.bodySmall)
                    Text("${item.city}, ${item.country}", style = MaterialTheme.typography.bodySmall)
                    if (item.priceFrom.isNotBlank()) {
                        Text(stringResource(R.string.admin_destination_price_display, item.priceFrom), style = MaterialTheme.typography.bodySmall)
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        OutlinedButton(onClick = {
                            onNameChange(item.name)
                            onCityChange(item.city)
                            onCountryChange(item.country)
                            onDescriptionChange(item.description)
                            onPriceFromChange(item.priceFrom)
                            onEditingIndexChange(index)
                        }) {
                            Icon(Icons.Default.Edit, contentDescription = null)
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(stringResource(R.string.admin_edit))
                        }
                        OutlinedButton(onClick = {
                            items.removeAt(index)
                            if (editingIndex == index) {
                                onEditingIndexChange(null)
                            }
                        }) {
                            Icon(Icons.Default.Delete, contentDescription = null)
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(stringResource(R.string.admin_delete))
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun AdminBookingsSection() {
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text(text = stringResource(R.string.admin_bookings_title), style = MaterialTheme.typography.titleMedium)
        Card {
            Column(Modifier.padding(12.dp)) {
                Text(text = stringResource(R.string.admin_bookings_hint), style = MaterialTheme.typography.bodySmall)
                Spacer(modifier = Modifier.height(8.dp))
                Text(text = stringResource(R.string.admin_bookings_status), style = MaterialTheme.typography.bodySmall)
            }
        }
    }
}

@Composable
private fun AdminSettingsSection() {
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text(text = stringResource(R.string.admin_settings_title), style = MaterialTheme.typography.titleMedium)
        Card {
            Column(Modifier.padding(12.dp)) {
                Text(text = stringResource(R.string.admin_settings_contact), style = MaterialTheme.typography.bodySmall)
                Spacer(modifier = Modifier.height(6.dp))
                Text(text = stringResource(R.string.admin_settings_payments), style = MaterialTheme.typography.bodySmall)
                Spacer(modifier = Modifier.height(6.dp))
                Text(text = stringResource(R.string.admin_settings_notifications), style = MaterialTheme.typography.bodySmall)
            }
        }
    }
}
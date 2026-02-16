package com.mashrouk.travel.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.mashrouk.travel.data.Destination
import com.mashrouk.travel.data.Repository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class TravelUiState(
    val isLoading: Boolean = true,
    val destinations: List<Destination> = emptyList(),
    val error: String? = null
)

class TravelViewModel : ViewModel() {
    private val repository = Repository()

    private val _uiState = MutableStateFlow(TravelUiState())
    val uiState: StateFlow<TravelUiState> = _uiState

    init {
        loadDestinations()
    }

    private fun loadDestinations() {
        viewModelScope.launch {
            runCatching { repository.fetchDestinations() }
                .onSuccess { list ->
                    _uiState.value = if (list.isEmpty()) {
                        TravelUiState(
                            isLoading = false,
                            destinations = sampleDestinations(),
                            error = "No data from API"
                        )
                    } else {
                        TravelUiState(isLoading = false, destinations = list)
                    }
                }
                .onFailure { err ->
                    _uiState.value = TravelUiState(
                        isLoading = false,
                        destinations = sampleDestinations(),
                        error = err.message
                    )
                }
        }
    }

    private fun sampleDestinations(): List<Destination> = listOf(
        Destination(1, "الرياض", "Riyadh", "Saudi Arabia", "Riyadh", "وجهة أعمال وترفيه", null),
        Destination(2, "دبي", "Dubai", "UAE", "Dubai", "وجهة فاخرة للتسوق", null)
    )
}

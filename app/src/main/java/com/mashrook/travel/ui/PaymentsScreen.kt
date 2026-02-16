package com.mashrouk.travel.ui

import android.widget.Toast
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import com.mashrouk.travel.R
import com.mashrouk.travel.payments.PaymentManager

@Composable
fun PaymentsScreen(modifier: Modifier = Modifier) {
    val context = LocalContext.current
    val paymentManager = PaymentManager(context)

    Column(modifier.padding(16.dp)) {
        Text(text = stringResource(R.string.payments_title), style = MaterialTheme.typography.headlineSmall)
        Spacer(modifier = Modifier.height(12.dp))
        Text(text = stringResource(R.string.payments_subtitle))
        Spacer(modifier = Modifier.height(16.dp))

        Button(onClick = {
            val message = paymentManager.payWithSamsungPay(599.0, "SAR")
            Toast.makeText(context, message, Toast.LENGTH_SHORT).show()
        }) {
            Text(stringResource(R.string.pay_with_samsung_pay))
        }

        Spacer(modifier = Modifier.height(12.dp))

        OutlinedButton(onClick = {
            val message = paymentManager.payWithCard(599.0, "SAR")
            Toast.makeText(context, message, Toast.LENGTH_SHORT).show()
        }) {
            Text(stringResource(R.string.pay_with_card))
        }
    }
}

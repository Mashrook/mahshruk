package com.mashrouk.travel.ui

import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.core.content.ContextCompat
import com.google.firebase.messaging.FirebaseMessaging
import com.mashrouk.travel.R

@Composable
fun NotificationsScreen(modifier: Modifier = Modifier) {
    val context = LocalContext.current
    val launcher = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { granted ->
        val msg = if (granted) "Notifications enabled" else "Notifications denied"
        Toast.makeText(context, msg, Toast.LENGTH_SHORT).show()
    }

    Column(modifier.padding(16.dp)) {
        Text(text = stringResource(R.string.notifications_title), style = MaterialTheme.typography.headlineSmall)
        Spacer(modifier = Modifier.height(12.dp))
        Text(text = stringResource(R.string.notifications_subtitle))
        Spacer(modifier = Modifier.height(16.dp))

        Button(onClick = {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                val permission = Manifest.permission.POST_NOTIFICATIONS
                if (ContextCompat.checkSelfPermission(context, permission) != PackageManager.PERMISSION_GRANTED) {
                    launcher.launch(permission)
                }
            }
            FirebaseMessaging.getInstance().token.addOnSuccessListener {
                Toast.makeText(context, "FCM Token: $it", Toast.LENGTH_LONG).show()
            }
        }) {
            Text(stringResource(R.string.enable_notifications))
        }
    }
}

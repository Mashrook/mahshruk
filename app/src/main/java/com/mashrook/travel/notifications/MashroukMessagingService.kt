package com.mashrouk.travel.notifications

import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

class MashroukMessagingService : FirebaseMessagingService() {
    override fun onMessageReceived(message: RemoteMessage) {
        super.onMessageReceived(message)
        // TODO: display notification via NotificationManager
    }

    override fun onNewToken(token: String) {
        super.onNewToken(token)
        // TODO: send token to backend if needed
    }
}

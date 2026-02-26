# برومبت لنموذج الذكاء الاصطناعي — إكمال مهام Xcode لتطبيق 5attah Travel

> انسخ هذا البرومبت كاملاً وأرسله لنموذج AI على جهاز Mac مع Xcode

---

## البرومبت (Prompt)

```
أنت مساعد تطوير iOS متخصص. أحتاج مساعدتك لإكمال إعداد ونشر تطبيق "5attah Travel" على App Store.

## معلومات المشروع

- **اسم التطبيق**: 5attah Travel
- **Bundle ID**: com.5attah.ios
- **Team ID**: P2SHV4K77Q
- **النوع**: Capacitor (React + TypeScript) → iOS WebView App
- **الحد الأدنى iOS**: 15.0
- **الإصدار**: 1.0.0 (Build 1)
- **اللغة**: عربي (RTL) + إنجليزي
- **الثيم**: داكن (#1a2340 كلون خلفية)

## المفاتيح والشهادات المتوفرة

| المفتاح | Key ID | الخدمة | الملف |
|---------|--------|--------|-------|
| Sign in with Apple | 42L5VRJDV5 | Apple Sign In | ios/AuthKey_42L5VRJDV5.p8 |
| APNs Push | 6588GZ732H | Push Notifications | ios/AuthKey_6588GZ732H.p8 |

## App Entitlements (ios/App/App/App.entitlements)

- aps-environment: production
- com.apple.developer.applesignin: Default

## الصلاحيات المطلوبة (Info.plist — مكتوبة بالعربي)

- NSCameraUsageDescription: التطبيق يحتاج الوصول إلى الكاميرا لالتقاط صور المستندات
- NSFaceIDUsageDescription: التطبيق يستخدم Face ID لتسجيل الدخول الآمن
- NSMicrophoneUsageDescription: التطبيق يحتاج الوصول إلى الميكروفون للمكالمات الصوتية
- NSPhotoLibraryUsageDescription: التطبيق يحتاج الوصول إلى مكتبة الصور لرفع المستندات والوسائط
- NSLocationWhenInUseUsageDescription: التطبيق يحتاج الوصول إلى موقعك لعرض وجهات السفر القريبة

## بيانات الخصوصية (PrivacyInfo.xcprivacy — جاهز)

| البيانات المجموعة | مربوطة بالمستخدم | للتتبع |
|------------------|-----------------|--------|
| User ID | ✅ | ❌ |
| Email Address | ✅ | ❌ |
| Name | ✅ | ❌ |
| Payment Info | ✅ | ❌ |

APIs المستخدمة: UserDefaults, FileTimestamp, DiskSpace, SystemBootTime

## أيقونة التطبيق

✅ جميع الأحجام موجودة في ios/App/App/Assets.xcassets/AppIcon.appiconset/ مع Contents.json محدث

## الدومينات المسموحة (allowNavigation)

- https://mashrouk.lovable.app
- https://mashrok.shop
- https://www.mashrok.shop
- https://frkdmxdfalohpmzlnsth.supabase.co
- https://*.supabase.co
- https://api.moyasar.com
- https://cdn.moyasar.com

## المهام المطلوبة — نفّذها بالترتيب:

### المهمة 1: بناء المشروع
```bash
cd MashrokT-App
npm install
npm run build
npx cap sync ios
```

### المهمة 2: فتح Xcode والتحقق من الإعدادات
```bash
npx cap open ios
```
في Xcode تأكد من:
1. Target: App → Signing & Capabilities
2. Team: حساب Apple Developer (Team ID: P2SHV4K77Q)  
3. Bundle Identifier: com.5attah.ios
4. Automatically manage signing: ✅ مفعّل
5. Capabilities مضافة:
   - Push Notifications
   - Sign in with Apple

### المهمة 3: اختبار على المحاكي
1. اختر iPhone 15 Pro من شريط الأجهزة
2. اضغط ⌘+R للتشغيل
3. تأكد من:
   - الشاشة الرئيسية تعمل
   - RTL (اتجاه من يمين لليسار) صحيح
   - الثيم الداكن يظهر
   - الصفحات تتنقل بسلاسة
   - أيقونة التطبيق تظهر

### المهمة 4: إنشاء App على App Store Connect
ادخل على https://appstoreconnect.apple.com
1. My Apps → + → New App
2. Platform: iOS
3. Name: 5attah Travel
4. Primary Language: Arabic
5. Bundle ID: com.5attah.ios
6. SKU: 5attah-travel-001
7. Category: Travel
8. Secondary Category: Lifestyle

### المهمة 5: إعداد معلومات التطبيق على App Store Connect

#### الوصف (عربي):
```
5attah Travel | منصة حجز السفر الشاملة

ابحث واحجز رحلات الطيران، الفنادق، السيارات، والجولات السياحية في مكان واحد.

المميزات:
🛫 بحث وحجز رحلات الطيران
🏨 حجز الفنادق مع أفضل الأسعار  
🚗 تأجير السيارات والتنقلات
🎯 جولات وأنشطة سياحية
💳 دفع آمن عبر بوابة Moyasar
🌙 واجهة أنيقة بالثيم الداكن
🔐 حسابات آمنة مع تسجيل دخول Apple

5attah - رفيقك في كل رحلة!
```

#### الكلمات المفتاحية:
```
سفر,حجز,طيران,فنادق,سياحة,رحلات,5attah,travel,تذاكر,فندق
```

#### الروابط المطلوبة:
- Privacy Policy URL: https://mashrok.shop/privacy
- Support URL: https://mashrok.shop/contact
- Marketing URL: https://mashrok.shop

#### App Privacy:
- Data Used to Track You: ❌ لا
- Data Linked to You: User ID, Email, Name, Payment Info
- Data Not Linked to You: Usage Data

### المهمة 6: أخذ لقطات شاشة (Screenshots)
من المحاكي (⌘+S لأخذ لقطة):

**أحجام مطلوبة:**
- iPhone 6.7" (1290 × 2796) — iPhone 15 Pro Max
- iPhone 6.5" (1242 × 2688) — iPhone 11 Pro Max

**لقطات مقترحة (5 على الأقل):**
1. الشاشة الرئيسية (العروض والوجهات)
2. بحث الرحلات
3. نتائج البحث  
4. تفاصيل الفندق
5. صفحة الدفع

### المهمة 7: Archive ورفع التطبيق
1. في Xcode اختر **Any iOS Device (arm64)** كهدف البناء
2. **Product** → **Archive**
3. عند الانتهاء يفتح Organizer
4. اختر الأرشيف → **Distribute App**
5. اختر **App Store Connect** → **Upload**
6. تأكد من:
   - ✅ Upload your app's symbols
   - ✅ Manage Version and Build Number
7. اضغط Upload

### المهمة 8: إرسال للمراجعة
في App Store Connect:
1. اختر الإصدار 1.0.0
2. في Build → اختر البناء المرفوع
3. أضف لقطات الشاشة
4. تأكد من ملء جميع الحقول
5. App Review Information:
   - ملاحظة للمراجع: "This app is built with Capacitor (hybrid web/native). It provides travel booking services including flights, hotels, and activities. Payment is handled via Moyasar payment gateway."
6. Submit for Review

## ملاحظات مهمة:

1. **لا تحذف ملفات .p8** — مفاتيح APNs و Sign in with Apple مطلوبة للخدمات
2. **Automatic Signing** يكفي — Xcode سينشئ الشهادات والـ Provisioning Profiles تلقائياً
3. **إذا ظهر خطأ signing**: تأكد أن Bundle ID = com.5attah.ios وأن الـ Team صحيح
4. **إذا رُفض التطبيق من Apple**: غالباً بسبب:
   - عدم وجود Privacy Policy → الرابط موجود
   - عدم تقديم حساب تجريبي → قدّم بيانات دخول
   - التطبيق WebView فقط → Push Notifications مفعّلة كميزة أصلية
```

---

## كيفية الاستخدام

1. انسخ كل شيء بين علامتي ``` أعلاه
2. الصقه في نموذج AI على جهاز Mac (Claude, ChatGPT, Copilot)
3. نفّذ التعليمات خطوة بخطوة
4. إذا واجهت مشكلة، صف الخطأ للنموذج وسيساعدك

## الملفات المرجعية في المشروع

| الملف | الغرض |
|-------|-------|
| `capacitor.config.ts` | إعدادات Capacitor (Bundle ID, الدومينات) |
| `ios/App/App/Info.plist` | صلاحيات التطبيق |
| `ios/App/App/App.entitlements` | APNs + Sign in with Apple |
| `ios/App/App/PrivacyInfo.xcprivacy` | بيانات الخصوصية |
| `ios/App/App/Assets.xcassets/AppIcon.appiconset/` | أيقونات التطبيق |
| `ios/AuthKey_42L5VRJDV5.p8` | مفتاح Sign in with Apple |
| `ios/AuthKey_6588GZ732H.p8` | مفتاح APNs Push Notifications |
| `XCODE_APP_STORE_GUIDE.md` | الدليل التفصيلي الكامل |

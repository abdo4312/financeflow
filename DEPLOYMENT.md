# دليل نشر مشروع FinanceFlow (Backend & Frontend)

يحتوي هذا الدليل على الخطوات التفصيلية لنشر النظام بالكامل، مع التركيز على معايير الجودة والأمان.

---

## أولاً: دليل نشر الواجهة الخلفية (Backend Deployment)

نتبع هنا المنهجية المكونة من 7 خطوات لضمان استقرار الخدمة:

### 1. إعداد البيئة (Environment Setup)
*   **المتطلبات الأساسية:**
    *   Node.js (الإصدار 18 أو أحدث).
    *   Docker (لبناء الحاويات ونشرها على Cloud Run).
*   **خدمات التخزين وقواعد البيانات:**
    *   **قاعدة البيانات:** MongoDB Atlas (Cluster مجاني).
    *   **تخزين الصور:** Cloudinary (لتخزين صور الملف الشخصي والإيصالات).
*   **متغيرات البيئة (Environment Variables):**
    يجب إعداد الملف `.env` في الخادم بالقيم التالية:
    ```env
    PORT=8080
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_key
    CLOUDINARY_CLOUD_NAME=your_name
    CLOUDINARY_API_KEY=your_key
    CLOUDINARY_API_SECRET=your_secret
    NODE_ENV=production
    ```

### 2. بناء المشروع (Project Build)
*   **تجميع التبعيات:** يتم استخدام `npm install --production` لضمان تثبيت المكتبات الضرورية فقط.
*   **حزمة النشر:** نستخدم **Docker** لإنشاء صورة (Image) تحتوي على الكود وجميع التبعيات، مما يضمن تشغيل التطبيق في أي بيئة بنفس الكفاءة.
    *   الأمر: `docker build -t finance-flow-backend .`

### 3. اختيار منصة النشر (Platform Selection)
*   **المزود:** Google Cloud Platform (GCP).
*   **الخدمة:** **Google Cloud Run** (Serverless).
*   **لماذا؟** توفر توسعاً تلقائياً (Scalability)، شهادات SSL مجانية، وتكلفة منعدمة للمشاريع الصغيرة.

### 4. عملية النشر (Deployment Process)
*   **الرفع:** يتم رفع الكود إلى GitHub، ثم ربطه بـ Cloud Build.
*   **الخادم:** يتم توجيه حركة المرور تلقائياً عبر موازنات التحميل الخاصة بجوجل.
*   **الأمان:** يتم تفعيل شهادات SSL (HTTPS) تلقائياً بمجرد تعيين النطاق (Domain).

### 5. التشغيل والمراقبة (Operation & Monitoring)
*   **التشغيل:** يتم تشغيل الحاوية باستخدام أمر `npm start`.
*   **المراقبة:** استخدام **Google Cloud Logging** لمتابعة السجلات و **Cloud Monitoring** للتنبيهات في حال تعطل الخدمة.
*   **النسخ الاحتياطي:** يتم إعداد النسخ الاحتياطي التلقائي من خلال لوحة تحكم MongoDB Atlas.

### 6. الاختبار (Testing)
*   **الأداء:** اختبار سرعة استجابة الـ API باستخدام أدوات مثل Postman أو K6.
*   **الأمان:** التأكد من تفعيل `Helmet` و `Rate Limiting` لمنع الهجمات.
*   **التكامل:** التحقق من قدرة الواجهة الأمامية (Vercel) على الاتصال بالـ Backend (Cloud Run).

### 7. الصيانة المستمرة (Maintenance)
*   **التحديثات:** إعداد GitHub Actions لتحديث الخدمة تلقائياً عند دفع كود جديد.
*   **السجلات:** مراجعة دورية لـ Logs بحثاً عن أي أخطاء برمجية أو محاولات اختراق.

---

## ثانياً: دليل نشر الواجهة الأمامية (Frontend Deployment)

نوصي باستخدام منصة **Vercel** لسهولة التكامل مع Vite.

1.  قم بربط حساب GitHub الخاص بك بمنصة [Vercel](https://vercel.com).
2.  اختر مستودع `financeflow`.
3.  قم بتعيين متغير البيئة التالي:
    *   `VITE_API_URL`: (رابط الـ Backend الذي حصلت عليه من Google Cloud Run).
4.  اضغط على **Deploy**.

---

## ثالثاً: روابط هامة
*   [Dockerfile](file:///d:/فلوس/backend/Dockerfile) - إعدادات الحاوية.
*   [README.md](file:///d:/فلوس/README.md) - دليل الاستخدام العام.

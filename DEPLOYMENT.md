# 🚀 دليل نشر مشروع FinanceFlow

هذا الدليل يشرح كيفية نشر التطبيق (الواجهة الأمامية والخلفية) على منصات استضافة مجانية.

## 1. نشر الواجهة الخلفية (Backend) على Render
(الخطوات السابقة...)

## 2. نشر الواجهة الخلفية (Backend) على Google Cloud Run
يعتبر Google Cloud Run خياراً قوياً جداً ومجانياً للاستخدامات البسيطة.

### المتطلبات:
1. حساب على [Google Cloud Platform](https://console.cloud.google.com/).
2. تثبيت [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) على جهازك (اختياري، يمكن استخدام Cloud Shell).

### الخطوات (باستخدام Cloud Shell):
1. ارفع الكود إلى GitHub (لقد قمنا بذلك بالفعل).
2. افتح **Cloud Shell** في Google Cloud Console.
3. قم بعمل `git clone` للمستودع الخاص بك.
4. ادخل إلى مجلد الباك اند: `cd financeflow/backend`.
5. قم بتشغيل الأمر التالي لبناء الصورة ونشرها:
   ```bash
   gcloud run deploy finance-backend --source . --region us-central1 --allow-unauthenticated
   ```
6. سيطلب منك النظام تحديد بعض الإعدادات، اختر الإعدادات الافتراضية.
7. بعد الانتهاء، سيعطيك رابطاً (URL) للواجهة الخلفية.

### إضافة متغيرات البيئة (Environment Variables):
بعد النشر، اذهب إلى صفحة الخدمة في Google Cloud Run:
1. اختر **"Edit & Deploy New Revision"**.
2. اذهب إلى تبويب **"Variables & Secrets"**.
3. أضف المتغيرات التالية (نفس المتغيرات التي ذكرناها في Render):
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `REFRESH_TOKEN_SECRET`
   - `CLOUDINARY_...`
   - `PORT`: 8080 (Cloud Run يستخدم 8080 افتراضياً).

## 3. نشر قاعدة البيانات على MongoDB Atlas
(نفس الخطوات السابقة...)

## 3. نشر الواجهة الأمامية (Frontend) على Vercel
تعتبر [Vercel](https://vercel.com/) الأفضل لتطبيقات React/Vite.

### الخطوات:
1. قم بإنشاء حساب على Vercel واربطه بـ GitHub.
2. اختر **"Add New > Project"**.
3. اختر المستودع الخاص بك.
4. في الإعدادات:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. في **Environment Variables**، أضف:
   - `VITE_API_URL`: (رابط الواجهة الخلفية الذي حصلت عليه من Render مضافاً إليه `/api/v1`)
6. اضغط **Deploy**.

## 4. نصائح إضافية للسيرة الذاتية
- تأكد من إضافة رابط المستودع (GitHub) ورابط العرض المباشر (Live Demo) في قسم المشاريع.
- استخدم صورة مصغرة (Screenshot) احترافية للتطبيق في LinkedIn أو معرض أعمالك.
- اذكر التقنيات المستخدمة (MERN Stack, Tailwind CSS, Recharts).

---

# 🚀 FinanceFlow Deployment Guide

This guide explains how to deploy both the frontend and backend of the application to free hosting platforms.

## 1. Deploy Backend on Render
[Render](https://render.com/) is a great free tier option for Node.js apps.

### Steps:
1. Create a Render account and connect your GitHub.
2. Click **"New > Web Service"**.
3. Select your repository.
4. Configure settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add **Environment Variables** from your `.env.example`:
   - `MONGODB_URI`, `JWT_SECRET`, etc.

## 2. Database on MongoDB Atlas
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Whitelist `0.0.0.0/0` in Network Access.
3. Use the connection string in your Backend environment variables.

## 3. Deploy Frontend on Vercel
[Vercel](https://vercel.com/) is optimized for React/Vite.

### Steps:
1. Connect your GitHub to Vercel.
2. Import the project.
3. Environment Variables:
   - `VITE_API_URL`: Your Render backend URL + `/api/v1`.
4. Click **Deploy**.

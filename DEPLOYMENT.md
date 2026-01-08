# 🚀 دليل نشر مشروع FinanceFlow

هذا الدليل يشرح كيفية نشر التطبيق (الواجهة الأمامية والخلفية) على منصات استضافة مجانية تماماً وبدون الحاجة لبطاقة بنكية.

## 1. نشر الواجهة الخلفية (Backend) على Render
تعتبر [Render](https://render.com/) أفضل خيار مجاني حالياً ولا تتطلب بطاقة بنكية للبدء.

### الخطوات:
1. قم بإنشاء حساب مجاني على [Render](https://render.com/) باستخدام حساب GitHub الخاص بك.
2. اضغط على زر **"New +"** ثم اختر **"Web Service"**.
3. اختر المستودع الخاص بك (financeflow) من القائمة.
4. قم بضبط الإعدادات التالية:
   - **Name:** `finance-flow-backend`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. انزل إلى قسم **"Environment Variables"** وأضف المتغيرات التالية:
   - `MONGODB_URI`: الرابط الذي نسخته من MongoDB Atlas.
   - `JWT_SECRET`: كلمة سر عشوائية (مثلاً: `my_super_secret_123`).
   - `CLOUDINARY_CLOUD_NAME`: من حسابك في Cloudinary.
   - `CLOUDINARY_API_KEY`: من حسابك في Cloudinary.
   - `CLOUDINARY_API_SECRET`: من حسابك في Cloudinary.
   - `NODE_ENV`: `production`
6. اضغط على **"Create Web Service"**.
7. انتظر بضع دقائق حتى تكتمل عملية البناء (Build) وسيظهر لك رابط في الأعلى ينتهي بـ `.onrender.com`.

---

## 2. نشر قاعدة البيانات على MongoDB Atlas (مجاني)
1. قم بإنشاء حساب على [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. أنشئ **Shared Cluster** (مجاني).
3. في **Network Access**، تأكد من إضافة عنوان `0.0.0.0/0` للسماح لـ Render بالوصول للقاعدة.
4. انسخ رابط الاتصال (Connection String) وضعه في متغيرات بيئة Render.

---

## 3. نشر الواجهة الأمامية (Frontend) على Vercel
تعتبر [Vercel](https://vercel.com/) الأفضل لتطبيقات React.

### الخطوات:
1. قم بإنشاء حساب على Vercel واربطه بـ GitHub.
2. اختر **"Add New > Project"**.
3. اختر المستودع الخاص بك.
4. في الإعدادات:
   - **Framework Preset:** Vite
   - **Root Directory:** (اتركه فارغاً لأنه في المجلد الرئيسي للمستودع)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. في **Environment Variables**، أضف:
   - `VITE_API_URL`: (رابط الـ Backend الذي حصلت عليه من Render مضافاً إليه `/api/v1`)
     *مثال: `https://finance-flow-backend.onrender.com/api/v1`*
6. اضغط **Deploy**.

---

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

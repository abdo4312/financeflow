# 🚀 دليل نشر مشروع FinanceFlow

هذا الدليل يشرح كيفية نشر التطبيق (الواجهة الأمامية والخلفية) على منصات استضافة مجانية.

## 1. نشر الواجهة الخلفية (Backend) على Render
تعتبر منصة [Render](https://render.com/) خياراً ممتازاً لنشر تطبيقات Node.js مجاناً.

### الخطوات:
1. قم بإنشاء حساب على Render واربطه بحساب GitHub الخاص بك.
2. اختر **"New > Web Service"**.
3. اختر مستودع المشروع الخاص بك.
4. في الإعدادات:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start` (تأكد من وجود script start في package.json)
5. في قسم **Environment Variables**، أضف المتغيرات الموجودة في `.env.example`:
   - `PORT`: 10000
   - `MONGODB_URI`: (رابط قاعدة البيانات من MongoDB Atlas)
   - `JWT_SECRET`: (سلسلة نصية عشوائية طويلة)
   - `REFRESH_TOKEN_SECRET`: (سلسلة نصية عشوائية أخرى)
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: (من حسابك في Cloudinary)
   - `FRONTEND_URL`: (رابط الواجهة الأمامية بعد نشرها - يمكنك تحديثه لاحقاً)

## 2. نشر قاعدة البيانات على MongoDB Atlas
1. أنشئ حساباً مجانياً على [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. أنشئ "Cluster" جديد (Shared/Free).
3. أضف مستخدماً لقاعدة البيانات واحفظ كلمة المرور.
4. في "Network Access"، أضف `0.0.0.0/0` للسماح بالاتصال من أي مكان.
5. احصل على "Connection String" وضعه في متغير `MONGODB_URI` في Render.

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

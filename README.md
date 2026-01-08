# FinanceFlow - تطبيق إدارة المصاريف الشخصية 💰

**FinanceFlow** is a full-stack personal finance management application built with the **MERN** stack (MongoDB, Express, React, Node.js). It helps users track their income, expenses, and overall financial health with interactive charts and detailed reports.

[English Version Below](#english-version)

---

## 🇸🇦 النسخة العربية

### 🌟 المميزات الرئيسية
- **نظام مصادقة متكامل:** تسجيل الدخول، إنشاء حساب، وتجديد الرموز (JWT Authentication).
- **إدارة المعاملات:** إضافة، تعديل، وحذف الدخل والمصاريف.
- **لوحة تحكم تفاعلية:** رسوم بيانية توضح توزيع المصاريف والنشاط الأسبوعي.
- **تقارير مفصلة:** تصدير البيانات إلى ملفات **Excel** و **PDF**.
- **إدارة الفئات:** تخصيص فئات المصاريف (مثل: طعام، إيجار، ترفيه).
- **دعم اللغات:** واجهة كاملة باللغتين **العربية (RTL)** والإنجليزية.
- **الوضع الليلي:** دعم كامل للمظهر الداكن والفاتح.
- **رفع الملفات:** إمكانية رفع صور الإيصالات وصور الملف الشخصي (Cloudinary).

### 🛠 التقنيات المستخدمة
- **الواجهة الأمامية:** React 19, Vite, Tailwind CSS, Recharts, Axios, Lucide React.
- **الواجهة الخلفية:** Node.js, Express, MongoDB, Mongoose.
- **الأمان:** JWT, Helmet, Express Rate Limit, Mongo Sanitize, BcryptJS.
- **الخدمات السحابية:** Cloudinary (لتخزين الصور).

### 🚀 خطوات التشغيل
1. قم بتحميل المستودع (Clone).
2. إعداد الواجهة الخلفية:
   ```bash
   cd backend
   npm install
   # قم بإنشاء ملف .env بناءً على .env.example
   npm run dev
   ```
3. إعداد الواجهة الأمامية:
   ```bash
   cd ..
   npm install
   # قم بإنشاء ملف .env بناءً على .env.example
   npm run dev
   ```

### 📸 أمثلة الاستخدام
- **إضافة معاملة:** انقر على زر "إضافة مصروف" في لوحة التحكم، اختر الفئة، المبلغ، والتاريخ.
- **عرض التقارير:** انتقل إلى صفحة التقارير لمشاهدة تحليل بياني لمصاريفك حسب الفئة أو اليوم.
- **تغيير الإعدادات:** يمكنك التحويل بين اللغة العربية والإنجليزية، وتفعيل الوضع الليلي من صفحة الإعدادات.

---

<a name="english-version"></a>

## 🇺🇸 English Version

### 🌟 Key Features
- **Full Auth System:** Login, Register, and Token Refresh (JWT).
- **Transaction Management:** Add, Edit, and Delete Income/Expenses.
- **Interactive Dashboard:** Visual charts for expense distribution and weekly activity.
- **Detailed Reports:** Export data to **Excel** and **PDF** formats.
- **Category Management:** Customize expense categories (e.g., Food, Rent, Fun).
- **Multi-language Support:** Full **Arabic (RTL)** and English interface.
- **Dark Mode:** Seamless switching between Light and Dark themes.
- **File Uploads:** Upload receipt images and profile pictures using Cloudinary.

### 🛠 Tech Stack
- **Frontend:** React 19, Vite, Tailwind CSS, Recharts, Axios, Lucide React.
- **Backend:** Node.js, Express, MongoDB, Mongoose.
- **Security:** JWT, Helmet, Express Rate Limit, Mongo Sanitize, BcryptJS.
- **Cloud Services:** Cloudinary (for image storage).

### 📸 Usage Examples
- **Add Transaction:** Click "Add Expense" on the dashboard, select category, amount, and date.
- **View Reports:** Navigate to the Reports page to see visual analysis of expenses by category or day.
- **Settings:** Toggle between Arabic and English, or enable Dark Mode from the Settings page.

### 🚀 Getting Started

#### Prerequisites
- Node.js (>= 18.x)
- MongoDB (Local or Atlas)
- Cloudinary Account (for image uploads)

#### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/abdo4312/financeflow.git
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   # Create a .env file based on .env.example and fill in your keys
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd ..
   npm install
   # Create a .env file and set VITE_API_URL
   npm run dev
   ```

### 📁 Project Structure
- `/src`: Frontend React application.
- `/backend`: Node.js Express API.
- `/dist`: Production build of the frontend.

### 📄 License
This project is licensed under the MIT License.

---

### 👨‍💻 تم التطوير بواسطة
**Abdelrhman Khaled** - [GitHub Profile](https://github.com/abdo4312)

---

### 👨‍💻 Developed by
**Abdelrhman Khaled** - [GitHub Profile](https://github.com/abdo4312)

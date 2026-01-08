type TranslationKey =
  | 'settings'
  | 'preferences'
  | 'currency'
  | 'currencyDesc'
  | 'darkMode'
  | 'darkModeDesc'
  | 'language'
  | 'languageDesc'
  | 'notifications'
  | 'notificationsDesc'
  | 'account'
  | 'profile'
  | 'security'
  | 'deleteAccount'
  | 'dashboard'
  | 'transactions'
  | 'reports'
  | 'categories'
  | 'addTransaction'
  | 'addCategory'
  | 'income'
  | 'expense'
  | 'amount'
  | 'date'
  | 'description'
  | 'category'
  | 'actions'
  | 'all'
  | 'save'
  | 'cancel'
  | 'edit'
  | 'delete'
  | 'export'
  | 'downloadReport'
  | 'totalBalance'
  | 'totalIncome'
  | 'totalExpenses'
  | 'recentTransactions'
  | 'weeklyActivity'
  | 'expenseDistribution'
  // Dashboard
  | 'welcomeBack'
  | 'financialOverview'
  | 'addExpense'
  | 'addIncome'
  | 'overview'
  | 'week'
  | 'month'
  | 'year'
  | 'noTransactionsYet'
  // Categories
  | 'newCategory'
  | 'name'
  | 'type'
  // Transactions
  | 'searchTransactions'
  | 'allTypes'
  | 'allCategories'
  | 'previous'
  | 'next'
  | 'showing'
  | 'of'
  | 'noTransactionsFound'
  | 'excelReport'
  | 'pdfReport'
  // Transaction Modal
  | 'editTransaction'
  | 'selectCategory'
  | 'whatWasThisFor'
  | 'saveTransaction'
  | 'amountRequired'
  | 'categoryRequired'
  | 'descriptionRequired'
  // Reports
  | 'financialReports'
  | 'expenseBreakdown'
  | 'incomeVsExpense'
  | 'topSpendingCategories'
  | 'noExpenseData'
  // Error Boundary
  | 'somethingWentWrong'
  | 'unexpectedError'
  | 'reloadPage'
  // Summary Card
  | 'fromLastMonth'
  // Auth
  | 'login'
  | 'register'
  | 'email'
  | 'password'
  | 'fullName'
  | 'dontHaveAccount'
  | 'alreadyHaveAccount'
  | 'signingIn'
  | 'signingUp'
  | 'invalidCredentials'
  | 'sessionExpired'
  | 'logout';

export const translations: Record<'en' | 'ar', Record<TranslationKey, string>> = {
  en: {
    settings: 'Settings',
    preferences: 'Preferences',
    currency: 'Currency',
    currencyDesc: 'Select your default currency',
    darkMode: 'Dark Mode',
    darkModeDesc: 'Switch between light and dark themes',
    language: 'Language',
    languageDesc: 'Choose your preferred language',
    notifications: 'Notifications',
    notificationsDesc: 'Manage your alerts',
    account: 'Account',
    profile: 'User Profile',
    security: 'Security Settings',
    deleteAccount: 'Delete Account',
    dashboard: 'Dashboard',
    transactions: 'Transactions',
    reports: 'Reports',
    categories: 'Categories',
    addTransaction: 'Add Transaction',
    addCategory: 'Add Category',
    income: 'Income',
    expense: 'Expense',
    amount: 'Amount',
    date: 'Date',
    description: 'Description',
    category: 'Category',
    actions: 'Actions',
    all: 'All',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    export: 'Export',
    downloadReport: 'Download Report',
    totalBalance: 'Total Balance',
    totalIncome: 'Total Income',
    totalExpenses: 'Total Expenses',
    recentTransactions: 'Recent Transactions',
    weeklyActivity: 'Weekly Activity',
    expenseDistribution: 'Expense Distribution',
    // Dashboard
    welcomeBack: 'Welcome back, here\'s your financial overview.',
    financialOverview: 'Financial Overview',
    addExpense: 'Add Expense',
    addIncome: 'Add Income',
    overview: 'Overview',
    week: 'Week',
    month: 'Month',
    year: 'Year',
    noTransactionsYet: 'No transactions yet.',
    // Categories
    newCategory: 'New Category',
    name: 'Name',
    type: 'Type',
    // Transactions
    searchTransactions: 'Search transactions...',
    allTypes: 'All Types',
    allCategories: 'All Categories',
    previous: 'Previous',
    next: 'Next',
    showing: 'Showing',
    of: 'of',
    noTransactionsFound: 'No transactions found.',
    excelReport: 'Excel Report',
    pdfReport: 'PDF Report',
    // Transaction Modal
    editTransaction: 'Edit Transaction',
    selectCategory: 'Select Category',
    whatWasThisFor: 'What was this for?',
    saveTransaction: 'Save Transaction',
    amountRequired: 'Amount is required',
    categoryRequired: 'Category is required',
    descriptionRequired: 'Description is required',
    // Reports
    financialReports: 'Financial Reports',
    expenseBreakdown: 'Expense Breakdown',
    incomeVsExpense: 'Income vs Expense',
    topSpendingCategories: 'Top Spending Categories',
    noExpenseData: 'No expense data available.',
    // Error Boundary
    somethingWentWrong: 'Something went wrong',
    unexpectedError: 'We encountered an unexpected error. Please try refreshing the page.',
    reloadPage: 'Reload Page',
    // Summary Card
    fromLastMonth: 'from last month',
    // Auth
    login: 'Login',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    fullName: 'Full Name',
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',
    signingIn: 'Signing in...',
    signingUp: 'Creating account...',
    invalidCredentials: 'Invalid email or password',
    sessionExpired: 'Your session has expired. Please login again.',
    logout: 'Logout'
  },
  ar: {
    settings: 'الإعدادات',
    preferences: 'التفضيلات',
    currency: 'العملة',
    currencyDesc: 'اختر عملتك الافتراضية',
    darkMode: 'الوضع الليلي',
    darkModeDesc: 'التبديل بين المظهر الفاتح والداكن',
    language: 'اللغة',
    languageDesc: 'اختر لغتك المفضلة',
    notifications: 'التنبيهات',
    notificationsDesc: 'إدارة التنبيهات الخاصة بك',
    account: 'الحساب',
    profile: 'الملف الشخصي',
    security: 'إعدادات الأمان',
    deleteAccount: 'حذف الحساب',
    dashboard: 'لوحة التحكم',
    transactions: 'المعاملات',
    reports: 'التقارير',
    categories: 'الفئات',
    addTransaction: 'إضافة معاملة',
    addCategory: 'إضافة فئة',
    income: 'دخل',
    expense: 'مصروف',
    amount: 'المبلغ',
    date: 'التاريخ',
    description: 'الوصف',
    category: 'الفئة',
    actions: 'الإجراءات',
    all: 'الكل',
    save: 'حفظ',
    cancel: 'إلغاء',
    edit: 'تعديل',
    delete: 'حذف',
    export: 'تصدير',
    downloadReport: 'تحميل التقرير',
    totalBalance: 'إجمالي الرصيد',
    totalIncome: 'إجمالي الدخل',
    totalExpenses: 'إجمالي المصروفات',
    recentTransactions: 'المعاملات الأخيرة',
    weeklyActivity: 'النشاط الأسبوعي',
    expenseDistribution: 'توزيع المصروفات',
    // Dashboard
    welcomeBack: 'مرحباً بعودتك، إليك نظرة عامة على وضعك المالي.',
    financialOverview: 'نظرة مالية عامة',
    addExpense: 'إضافة مصروف',
    addIncome: 'إضافة دخل',
    overview: 'نظرة عامة',
    week: 'أسبوع',
    month: 'شهر',
    year: 'سنة',
    noTransactionsYet: 'لا توجد معاملات بعد.',
    // Categories
    newCategory: 'فئة جديدة',
    name: 'الاسم',
    type: 'النوع',
    // Transactions
    searchTransactions: 'البحث في المعاملات...',
    allTypes: 'جميع الأنواع',
    allCategories: 'جميع الفئات',
    previous: 'السابق',
    next: 'التالي',
    showing: 'عرض',
    of: 'من',
    noTransactionsFound: 'لم يتم العثور على معاملات.',
    excelReport: 'تقرير Excel',
    pdfReport: 'تقرير PDF',
    // Transaction Modal
    editTransaction: 'تعديل المعاملة',
    selectCategory: 'اختر الفئة',
    whatWasThisFor: 'ما هو سبب هذه المعاملة؟',
    saveTransaction: 'حفظ المعاملة',
    amountRequired: 'المبلغ مطلوب',
    categoryRequired: 'الفئة مطلوبة',
    descriptionRequired: 'الوصف مطلوب',
    // Reports
    financialReports: 'التقارير المالية',
    expenseBreakdown: 'تفصيل المصروفات',
    incomeVsExpense: 'الدخل مقابل المصروفات',
    topSpendingCategories: 'أكثر الفئات إنفاقاً',
    noExpenseData: 'لا توجد بيانات مصروفات متاحة.',
    // Error Boundary
    somethingWentWrong: 'حدث خطأ ما',
    unexpectedError: 'واجهنا خطأ غير متوقع. يرجى تحديث الصفحة.',
    reloadPage: 'تحديث الصفحة',
    // Summary Card
    fromLastMonth: 'من الشهر الماضي',
    // Auth
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    fullName: 'الاسم الكامل',
    dontHaveAccount: 'ليس لديك حساب؟',
    alreadyHaveAccount: 'لديك حساب بالفعل؟',
    signingIn: 'جاري الدخول...',
    signingUp: 'جاري إنشاء الحساب...',
    invalidCredentials: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
    sessionExpired: 'انتهت جلستك. يرجى تسجيل الدخول مرة أخرى.',
    logout: 'تسجيل الخروج'
  }
};

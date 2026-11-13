const DICT = {
  so: { reports: "Warbixinaha", home: "Dashboard", schools: "Dugsiyada", students: "Ardayda", att: "Imaanshaha", exams: "Imtixaanka", users: "Isticmaalayaasha", setup: "Fasallada & Maaddooyinka", res: "Natiijooyinka", myatt: "Imaanshahayga", set: "Settings", out: "Ka bax", welcome: "Soo dhawoow", lang: "Luuqadda", theme: "Muuqaalka", light: "Iftiin", dark: "Mugdi", pass: "Beddel password", cur: "Password-ka hadda", nw: "Password cusub (8+)", change: "Beddel", ok: "Waa la beddelay" },
  en: { reports: "Reports", home: "Dashboard", schools: "Schools", students: "Students", att: "Attendance", exams: "Exams", users: "Users", setup: "Classes & Subjects", res: "Results", myatt: "My attendance", set: "Settings", out: "Log out", welcome: "Welcome", lang: "Language", theme: "Appearance", light: "Light", dark: "Dark", pass: "Change password", cur: "Current password", nw: "New password (8+)", change: "Change", ok: "Password changed" },
  ar: { reports: "التقارير", home: "لوحة التحكم", schools: "المدارس", students: "الطلاب", att: "الحضور", exams: "الاختبارات", users: "المستخدمون", setup: "الفصول والمواد", res: "النتائج", myatt: "حضوري", set: "الإعدادات", out: "تسجيل الخروج", welcome: "مرحبًا", lang: "اللغة", theme: "المظهر", light: "فاتح", dark: "داكن", pass: "تغيير كلمة المرور", cur: "كلمة المرور الحالية", nw: "كلمة المرور الجديدة (8+)", change: "تغيير", ok: "تم التغيير" }
};
let LANG = "so";
try { LANG = localStorage.getItem("lang") || "so"; } catch (e) {}
const t = k => (DICT[LANG] && DICT[LANG][k]) || DICT.so[k] || k;
function setLang(l) {
  LANG = l;
  try { localStorage.setItem("lang", l); } catch (e) {}
  document.documentElement.lang = l;
  document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
}
setLang(LANG);

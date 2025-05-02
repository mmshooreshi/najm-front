# ------------- Python 3 -------------
# برای اجرا:  pip install pocketbase
# ------------------------------------
from pocketbase import PocketBase

API_URL        = "http://65.108.80.205:8090"
ADMIN_EMAIL    = "mmshooreshi@gmail.com"   # ← ادمین خود را بگذارید
ADMIN_PASSWORD = "Hggi0Ugdl123"

pb = PocketBase(API_URL)
pb.admins.auth_with_password(ADMIN_EMAIL, ADMIN_PASSWORD)

batch = pb.create_batch()

categories = [
    # --- نوع: category ---
    {"id":"cat_printing",  "name":"چاپ",          "slug":"printing",      "type":"category"},
    {"id":"cat_packaging", "name":"بسته‌بندی",    "slug":"packaging",     "type":"category"},

    # --- نوع: industry ---
    {"id":"ind_food",      "name":"غذا و نوشیدنی", "slug":"food-beverage", "type":"industry"},
    {"id":"ind_beauty",    "name":"آرایشی و بهداشتی","slug":"beauty-health","type":"industry"},
    {"id":"ind_medical",   "name":"پزشکی و دارویی","slug":"medical-pharma","type":"industry"},
    {"id":"ind_fashion",   "name":"مد و پوشاک",   "slug":"fashion",       "type":"industry"},
    {"id":"ind_jewelry",   "name":"جواهرات و زیورآلات","slug":"jewelry",   "type":"industry"},
    {"id":"ind_tech",      "name":"فناوری و الکترونیک","slug":"tech-electronics","type":"industry"},
    {"id":"ind_marketing", "name":"بازاریابی و عمومی","slug":"marketing-general","type":"industry"},

    # --- نوع: application ---
    {"id":"app_office",      "name":"سازمانی و اداری",  "slug":"office-pack",     "type":"application"},
    {"id":"app_marketing",   "name":"تبلیغاتی و بازاریابی","slug":"marketing-pack","type":"application"},
    {"id":"app_industrial",  "name":"صنعتی و فنی",       "slug":"industrial-pack","type":"application"},
    {"id":"app_educational", "name":"آموزشی و فرهنگی",   "slug":"educational-pack","type":"application"},
    {"id":"app_custom",      "name":"مناسبتی و سفارشی",  "slug":"custom-pack",    "type":"application"},
    {"id":"app_event",       "name":"نمایشگاهی و رویدادی","slug":"exhibition-pack","type":"application"},
    {"id":"app_luxury",      "name":"لوکس و هدیه",       "slug":"luxury-pack",    "type":"application"}
]

for cat in categories:
    # upsert => اگر id وجود داشته باشد update، اگر نه create
    batch.collection("categories").upsert(cat)

result = batch.send()
print(f"{len(result)} دسته‌بندی با موفقیت ساخته/به‌روزرسانی شد.")

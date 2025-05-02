# pip install pocketbase
from pocketbase import PocketBase
from pocketbase.errors import ClientResponseError

# ------------------- تنظیمات -------------------
PB_URL   = "http://65.108.80.205:8090"      # ← سرورتان
ADMIN    = "mmshooreshi@gmail.com"   # ← ادمین خود را بگذارید
PASSWORD = "Hggi0Ugdl123"
COLL     = "categories"                 # ← نام کالکشن
# ----------------------------------------------


pb = PocketBase(PB_URL)
pb.admins.auth_with_password(ADMIN, PASSWORD)
col = pb.collection(COLL)

categoriesPrev = [
    {"name":"چاپ",           "slug":"printing",          "type":"category"},
    {"name":"بسته‌بندی",     "slug":"packaging",         "type":"category"},

    {"name":"غذا و نوشیدنی", "slug":"food-beverage",     "type":"صنعت"},
    {"name":"آرایشی و بهداشتی","slug":"beauty-health",  "type":"صنعت"},
    {"name":"پزشکی و دارویی","slug":"medical-pharma",   "type":"صنعت"},
    {"name":"مد و پوشاک",    "slug":"fashion",          "type":"صنعت"},
    {"name":"جواهرات و زیورآلات","slug":"jewelry",     "type":"صنعت"},
    {"name":"فناوری و الکترونیک","slug":"tech-electronics","type":"صنعت"},
    {"name":"بازاریابی و عمومی","slug":"marketing-general","type":"صنعت"},

    {"name":"سازمانی و اداری", "slug":"office-pack",      "type":"کاربرد"},
    {"name":"تبلیغاتی و بازاریابی","slug":"marketing-pack","type":"کاربرد"},
    {"name":"صنعتی و فنی",      "slug":"industrial-pack",  "type":"کاربرد"},
    {"name":"آموزشی و فرهنگی",  "slug":"educational-pack", "type":"کاربرد"},
    {"name":"مناسبتی و سفارشی", "slug":"custom-pack",     "type":"کاربرد"},
    {"name":"نمایشگاهی و رویدادی","slug":"exhibition-pack","type":"کاربرد"},
    {"name":"لوکس و هدیه",      "slug":"luxury-pack",      "type":"کاربرد"}
]

categories = [
    # ------------- نوع category -------------
    {"name": "چاپ",           "slug": "چاپ",            "type": "دسته‌بندی"},
    {"name": "بسته‌بندی",     "slug": "بسته‌بندی",      "type": "دسته‌بندی"},

    # ------------- نوع صنعت -------------
    {"name": "غذا و نوشیدنی",   "slug": "غذا-نوشیدنی",     "type": "صنعت"},
    {"name": "آرایشی و بهداشتی","slug": "آرایشی-بهداشتی", "type": "صنعت"},
    {"name": "پزشکی و دارویی",  "slug": "پزشکی-دارویی",    "type": "صنعت"},
    {"name": "مد و پوشاک",     "slug": "مد-پوشاک",        "type": "صنعت"},
    {"name": "جواهرات و زیورآلات","slug": "جواهرات-زیورآلات","type": "صنعت"},
    {"name": "فناوری و الکترونیک","slug": "فناوری-الکترونیک","type": "صنعت"},
    {"name": "بازاریابی و عمومی","slug": "بازاریابی-عمومی",  "type": "صنعت"},

    # ------------- نوع کاربرد ----------
    {"name": "سازمانی و اداری",   "slug": "سازمانی-اداری",    "type": "کاربرد"},
    {"name": "تبلیغاتی و بازاریابی","slug": "تبلیغاتی-بازاریابی","type": "کاربرد"},
    {"name": "صنعتی و فنی",       "slug": "صنعتی-فنی",         "type": "کاربرد"},
    {"name": "آموزشی و فرهنگی",   "slug": "آموزشی-فرهنگی",     "type": "کاربرد"},
    {"name": "مناسبتی و سفارشی",  "slug": "مناسبتی-سفارشی",    "type": "کاربرد"},
    {"name": "نمایشگاهی و رویدادی","slug": "نمایشگاهی-رویدادی","type": "کاربرد"},
    {"name": "لوکس و هدیه",       "slug": "لوکس-هدیه",         "type": "کاربرد"}
]

for cat in categories:
    try:
        # تلاش برای پیدا‌کردن با slug
        rec = col.get_first_list_item(f'slug = "{cat["slug"]}"')
        col.update(rec.id, cat)          # exists → update
        print("updated", cat["slug"])
    except ClientResponseError as e:
        if e.status == 404:
            col.create(cat)              # not found → create
            print("created", cat["slug"])
        else:
            raise                       # سایر خطاها را دوباره پرتاب کن

print("\nهمهٔ دسته‌بندی‌ها همگام شدند.")

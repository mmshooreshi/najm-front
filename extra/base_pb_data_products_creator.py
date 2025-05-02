

# pip install pocketbase
from pocketbase import PocketBase
from pocketbase.client import FileUpload          # اگر می‌خواهید تصویر آپلود کنید
from pocketbase.errors import ClientResponseError

# ------------------- تنظیمات -------------------
PB_URL   = "http://65.108.80.205:8090"      # ← سرورتان
ADMIN    = "mmshooreshi@gmail.com"   # ← ادمین خود را بگذارید
PASS = "Hggi0Ugdl123"

pb = PocketBase(PB_URL)
pb.admins.auth_with_password(ADMIN, PASS)

cat_col  = pb.collection("categories")
prod_col = pb.collection("products")

# ---------- کمکی برای گرفتن id رکوردِ رابطه ----------
def get_id(slug):
    rec = cat_col.get_first_list_item(f'slug = "{slug}"')
    return rec.id

# ---------- نقشهٔ slug ➜ id ----------
IND_FOOD      = get_id("غذا-نوشیدنی")
IND_MARKETING = get_id("بازاریابی-عمومی")
APP_MARKETING = get_id("تبلیغاتی-بازاریابی")
APP_EVENT     = get_id("نمایشگاهی-رویدادی")
CAT_PRINTING  = get_id("چاپ")
CAT_PACKAGING = get_id("بسته‌بندی")

# ---------- محصولات ----------
products = [
    {
        "slug": "کارت‌ویزیت-استاندارد",
        "data": {
            "sku": "card-std",
            "name": "کارت‌ویزیت استاندارد",
            "shortDescription": "کارت‌ویزیت ۳۰۰ گرم با روکش مات یا براق",
            "description": "توضیحات کامل محصول …",
            "division": "چاپ",
            "family": "کارت‌ویزیت",
            "basePrice": 30000,
            "price": 30000,                       # باید >0 باشد
            "currency": "IRR",
            "variantSchema": [
                {
                    "code": "coating", "label": "روکش", "type": "enum", "required": True,
                    "options": [
                        {"value": "matte", "label": "مات",  "priceΔ": 0},
                        {"value": "gloss", "label": "براق", "priceΔ": 0}
                    ]
                },
                {
                    "code": "corner", "label": "برش", "type": "enum",
                    "options": [
                        {"value": "square", "label": "گوشه‌تیز", "priceΔ": 0},
                        {"value": "round",  "label": "گوشه‌گرد", "priceΔ": 5000}
                    ]
                }
            ],
            "inventory": {"minOrderQty": 100, "stockQuantity": 0, "backorderable": True},
            "categories": [CAT_PRINTING],
            "industries": [IND_FOOD],
            "applications": [APP_MARKETING]
        }
    },
    {
        "slug": "باکس-ساکی-استاندارد",
        "data": {
            "sku": "box-saki-std",
            "name": "باکس ساکی استاندارد",
            "shortDescription": "جعبه ساکی مقوایی با دستگیره طنابی",
            "description": "توضیحات کامل …",
            "division": "بسته‌بندی",
            "family": "جعبه",
            "basePrice": 25000,
            "price": 25000,
            "currency": "IRR",
            "variantSchema": [
                {
                    "code": "lamination", "label": "روکش", "type": "enum",
                    "options": [
                        {"value": "none",  "label": "بدون لمینت", "priceΔ": 0},
                        {"value": "matte", "label": "مات",        "priceΔ": 2000},
                        {"value": "gloss", "label": "براق",       "priceΔ": 2000}
                    ]
                },
                {
                    "code": "handle", "label": "نوع بند", "type": "enum",
                    "options": [
                        {"value": "rope",   "label": "طناب",  "priceΔ": 0},
                        {"value": "ribbon", "label": "ریبون", "priceΔ": 3000}
                    ]
                }
            ],
            "inventory": {"minOrderQty": 500, "stockQuantity": 0, "backorderable": True},
            "categories": [CAT_PACKAGING],
            "industries": [IND_MARKETING],
            "applications": [APP_EVENT]
        }
    }
]

# ---------- ایجاد یا به‌روزرسانی ----------
for item in products:
    slug = item["slug"]
    data = item["data"]
    try:
        rec = prod_col.get_first_list_item(f'slug = "{slug}"')
        prod_col.update(rec.id, data)
        print("🔄  updated:", slug)
    except ClientResponseError as e:
        if e.status == 404:
            prod_col.create({**data, "slug": slug})
            print("✅ created:", slug)
        else:
            raise

print("\nهمهٔ محصولات ایجاد/به‌روز شدند.")

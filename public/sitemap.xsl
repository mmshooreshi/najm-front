<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:html="http://www.w3.org/TR/REC-html40"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="fa" dir="rtl">
      <head>
        <title>نقشه سایت مجتمع چاپ و بسته‌بندی نجم &#183; XML Sitemap Vitrine</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style type="text/css">
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background-color: #0b1c18;
            color: #e5e7eb;
            font-size: 13px;
            line-height: 1.6;
            padding: 24px 16px;
          }
          .container {
            max-width: 1280px;
            margin: 0 auto;
            background: #112823;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
          }
          .header {
            background: linear-gradient(135deg, #014439 0%, #036252 100%);
            padding: 28px 32px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.15);
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
          }
          .header h1 {
            font-size: 20px;
            font-weight: 800;
            color: #ffffff;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .header p {
            color: rgba(255, 255, 255, 0.85);
            font-size: 12px;
            margin-top: 4px;
          }
          .stats {
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
          }
          .badge {
            background: rgba(16, 185, 129, 0.15);
            border: 1px solid rgba(16, 185, 129, 0.4);
            color: #6ee7b7;
            padding: 6px 14px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 700;
          }
          .cat-tabs {
            display: flex;
            gap: 8px;
            padding: 14px 32px;
            background: rgba(0, 0, 0, 0.35);
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            overflow-x: auto;
            flex-wrap: nowrap;
          }
          .cat-tab {
            padding: 6px 14px;
            border-radius: 9999px;
            border: 1px solid rgba(255, 255, 255, 0.12);
            background: rgba(255, 255, 255, 0.04);
            color: #cbd5e1;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
            white-space: nowrap;
            transition: all 0.2s;
          }
          .cat-tab:hover {
            background: rgba(16, 185, 129, 0.2);
            border-color: #10b981;
            color: #fff;
          }
          .cat-tab.active {
            background: #10b981;
            border-color: #10b981;
            color: #04201a;
            font-weight: 700;
          }
          .search-bar {
            padding: 14px 32px;
            background: rgba(0, 0, 0, 0.2);
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 12px;
          }
          .search-input {
            background: #081613;
            border: 1px solid rgba(255, 255, 255, 0.15);
            color: #fff;
            padding: 8px 16px;
            border-radius: 12px;
            font-size: 12px;
            width: 320px;
            outline: none;
            direction: ltr;
          }
          .search-input:focus {
            border-color: #10b981;
          }
          .table-wrapper {
            overflow-x: auto;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            text-align: right;
          }
          th {
            background: #081613;
            color: rgba(255, 255, 255, 0.7);
            font-size: 11px;
            font-weight: 700;
            padding: 14px 18px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          td {
            padding: 12px 18px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            vertical-align: middle;
          }
          tr:hover td {
            background: rgba(16, 185, 129, 0.05);
          }
          .url-link {
            color: #34d399;
            text-decoration: none;
            font-family: ui-monospace, monospace;
            font-size: 12px;
            direction: ltr;
            display: inline-block;
            transition: color 0.2s;
          }
          .url-link:hover {
            color: #a7f3d0;
            text-decoration: underline;
          }
          .chip {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            font-size: 10px;
            font-weight: 700;
            padding: 3px 9px;
            border-radius: 9999px;
            white-space: nowrap;
          }
          .chip-core { background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.35); color: #7dd3fc; }
          .chip-products { background: rgba(168, 85, 247, 0.15); border: 1px solid rgba(168, 85, 247, 0.35); color: #d8b4fe; }
          .chip-services { background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.35); color: #6ee7b7; }
          .chip-resources { background: rgba(251, 191, 36, 0.15); border: 1px solid rgba(251, 191, 36, 0.35); color: #fde68a; }
          .chip-editorial { background: rgba(244, 63, 94, 0.15); border: 1px solid rgba(244, 63, 94, 0.35); color: #fecdd3; }
          .alternates {
            display: flex;
            gap: 6px;
            direction: ltr;
          }
          .lang-pill {
            font-size: 10px;
            padding: 2px 7px;
            border-radius: 6px;
            font-weight: 700;
            text-decoration: none;
            background: rgba(255, 255, 255, 0.08);
            color: rgba(255, 255, 255, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.2s;
          }
          .lang-pill:hover {
            background: #10b981;
            color: #04201a;
            border-color: #10b981;
          }
          .priority-bar {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-family: ui-monospace, monospace;
            font-size: 11px;
            color: #94a3b8;
          }
          .priority-meter {
            width: 44px;
            height: 6px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
            overflow: hidden;
          }
          .priority-fill {
            height: 100%;
            background: #10b981;
            border-radius: 3px;
          }
          .date {
            font-family: ui-monospace, monospace;
            font-size: 11px;
            color: #94a3b8;
            direction: ltr;
          }
          .freq-pill {
            font-size: 10px;
            padding: 2px 8px;
            border-radius: 9999px;
            background: rgba(255, 255, 255, 0.05);
            color: #cbd5e1;
          }
          .footer {
            padding: 20px 32px;
            background: #081613;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 11px;
            color: rgba(255, 255, 255, 0.5);
            flex-wrap: wrap;
            gap: 12px;
          }
          .footer a {
            color: #10b981;
            text-decoration: none;
          }
        </style>
        <script type="text/javascript">
          function filterUrls() {
            var input = document.getElementById("filterInput");
            var filter = input ? input.value.toLowerCase() : "";
            var rows = document.querySelectorAll("#sitemapTable tbody tr");
            Array.prototype.forEach.call(rows, function(row) {
              var loc = row.querySelector(".url-link");
              var cat = row.getAttribute("data-cat") || "";
              if (loc) {
                var text = (loc.textContent || loc.innerText).toLowerCase();
                var matches = (text.indexOf(filter) !== -1) || (cat.toLowerCase().indexOf(filter) !== -1);
                row.style.display = matches ? "" : "none";
              }
            });
          }

          function setCategoryFilter(catName, btn) {
            var buttons = document.querySelectorAll(".cat-tab");
            Array.prototype.forEach.call(buttons, function(b) {
              b.classList.remove("active");
            });
            if (btn) btn.classList.add("active");

            var rows = document.querySelectorAll("#sitemapTable tbody tr");
            Array.prototype.forEach.call(rows, function(row) {
              if (!catName || catName === "all") {
                row.style.display = "";
              } else {
                var rowCat = row.getAttribute("data-cat");
                row.style.display = (rowCat === catName) ? "" : "none";
              }
            });
          }
        </script>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div>
              <h1>
                <span>🌐</span>
                <span>مجتمع چاپ و بسته‌بندی نجم &#183; XML Sitemap</span>
              </h1>
              <p>نقشه مهندسی و ساختار سلسله‌مراتبی منطبق بر استانداردهای جهانی Googlebot, Bingbot و موتورهای پاسخ هوش مصنوعی (AEO/GEO).</p>
            </div>
            <div class="stats">
              <span class="badge">
                تعداد کل آدرس‌ها: <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/>
              </span>
              <span class="badge">۳ زبان مستقل (FA, EN, AR)</span>
              <span class="badge">معماری ۳ سطحی</span>
            </div>
          </div>

          <div class="cat-tabs">
            <button type="button" class="cat-tab active" onclick="setCategoryFilter('all', this)">همه بخش‌ها</button>
            <button type="button" class="cat-tab" onclick="setCategoryFilter('core', this)">🏛️ صفحات اصلی (Core)</button>
            <button type="button" class="cat-tab" onclick="setCategoryFilter('products', this)">📦 محصولات و جعبه‌ها</button>
            <button type="button" class="cat-tab" onclick="setCategoryFilter('services', this)">⚙️ خدمات فنی چاپ</button>
            <button type="button" class="cat-tab" onclick="setCategoryFilter('resources', this)">📐 منابع و قالب‌ها</button>
            <button type="button" class="cat-tab" onclick="setCategoryFilter('editorial', this)">📰 پایگاه دانش و اخبار</button>
          </div>

          <div class="search-bar">
            <input
              type="text"
              id="filterInput"
              class="search-input"
              placeholder="جستجو در مسیرها (Filter URLs)..."
              onkeyup="filterUrls()"
            />
            <span style="font-size: 11px; color: rgba(255, 255, 255, 0.6);">
              استاندارد Sitemaps.org با برچسب‌های کامل xhtml:link hreflang
            </span>
          </div>

          <div class="table-wrapper">
            <table id="sitemapTable">
              <thead>
                <tr>
                  <th style="width: 40px; text-align: center;">#</th>
                  <th>شاخه ساختاری</th>
                  <th>نشانی اصلی (URL)</th>
                  <th style="text-align: center;">نسخه‌های چندزبانه (hreflang)</th>
                  <th style="text-align: center;">تواتر بروزرسانی</th>
                  <th style="text-align: center;">اولویت</th>
                  <th style="text-align: left;">آخرین بازنگری</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:urlset/sitemap:url">
                  <tr>
                    <xsl:attribute name="data-cat">
                      <xsl:choose>
                        <xsl:when test="contains(sitemap:loc, '/products')">products</xsl:when>
                        <xsl:when test="contains(sitemap:loc, '/services')">services</xsl:when>
                        <xsl:when test="contains(sitemap:loc, '/resources')">resources</xsl:when>
                        <xsl:when test="contains(sitemap:loc, '/blog') or contains(sitemap:loc, '/news')">editorial</xsl:when>
                        <xsl:otherwise>core</xsl:otherwise>
                      </xsl:choose>
                    </xsl:attribute>
                    <td style="text-align: center; color: #64748b; font-family: ui-monospace, monospace; font-size: 11px;">
                      <xsl:value-of select="position()"/>
                    </td>
                    <td>
                      <xsl:choose>
                        <xsl:when test="contains(sitemap:loc, '/products')">
                          <span class="chip chip-products">📦 محصولات</span>
                        </xsl:when>
                        <xsl:when test="contains(sitemap:loc, '/services')">
                          <span class="chip chip-services">⚙️ خدمات</span>
                        </xsl:when>
                        <xsl:when test="contains(sitemap:loc, '/resources')">
                          <span class="chip chip-resources">📐 منابع</span>
                        </xsl:when>
                        <xsl:when test="contains(sitemap:loc, '/blog') or contains(sitemap:loc, '/news')">
                          <span class="chip chip-editorial">📰 دانش / اخبار</span>
                        </xsl:when>
                        <xsl:otherwise>
                          <span class="chip chip-core">🏛️ اصلی</span>
                        </xsl:otherwise>
                      </xsl:choose>
                    </td>
                    <td>
                      <a class="url-link" target="_blank">
                        <xsl:attribute name="href">
                          <xsl:value-of select="sitemap:loc"/>
                        </xsl:attribute>
                        <xsl:value-of select="sitemap:loc"/>
                      </a>
                    </td>
                    <td style="text-align: center;">
                      <div class="alternates" style="justify-content: center;">
                        <xsl:for-each select="xhtml:link">
                          <xsl:if test="@hreflang != 'x-default'">
                            <a class="lang-pill" target="_blank">
                              <xsl:attribute name="href">
                                <xsl:value-of select="@href"/>
                              </xsl:attribute>
                              <xsl:value-of select="@hreflang"/>
                            </a>
                          </xsl:if>
                        </xsl:for-each>
                      </div>
                    </td>
                    <td style="text-align: center;">
                      <span class="freq-pill">
                        <xsl:value-of select="sitemap:changefreq"/>
                      </span>
                    </td>
                    <td style="text-align: center;">
                      <div class="priority-bar">
                        <div class="priority-meter">
                          <div class="priority-fill">
                            <xsl:attribute name="style">
                              width: <xsl:value-of select="number(sitemap:priority) * 100"/>%;
                            </xsl:attribute>
                          </div>
                        </div>
                        <span><xsl:value-of select="sitemap:priority"/></span>
                      </div>
                    </td>
                    <td style="text-align: left;">
                      <span class="date">
                        <xsl:value-of select="sitemap:lastmod"/>
                      </span>
                    </td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>

          <div class="footer">
            <div>
              <span>مجتمع چاپ و بسته‌بندی نجم &#169; 2026 &#183; </span>
              <a href="https://chapenajm.com" target="_blank">chapenajm.com</a>
            </div>
            <div>
              <span>نقشه درختی مهندسی شده و منطبق بر آخرین پروتکل Sitemaps.org</span>
            </div>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>

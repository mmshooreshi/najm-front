// ~/composables/usePackages.ts
import { ref } from 'vue'


const examplePackagesArr = [{
    id: 1,
    name: 'پکیج سازمانی و اداری',
    color: '#FFB3BA',
    items: [
      {
        id: 1,
        name: 'جعبه کرافت بازشو',
        image: '/images/main/1.png',
        specs: {
          width: '212.18px',
          height: '193.27px',
          x: '283.71px',
          y: '64px',
          rotate: '14.09deg',
          zIndex: 1
        }
      },
      {
        id: 2,
        name: 'جلد کتاب سخت‌پوش معلق',
        image: '/images/main/2.png',
        specs: {
          width: '148px',
          height: '205px',
          x: '-29.28px',
          y: '94px',
          rotate: '0deg',
          zIndex: 2
        }
      },
      {
        id: 3,
        name: 'جعبه نیمه‌باز کاغذی',
        image: '/images/main/3.png',
        specs: {
          width: '161.73px',
          height: '167.51px',
          x: '-3.33px',
          y: '317.84px',
          rotate: '-26.77deg',
          zIndex: 3
        }
      },
      {
        id: 4,
        name: 'موکاپ قهوه برند',
        image: '/images/main/4.png',
        specs: {
          width: '141.93px',
          height: '167.76px',
          x: '223.58px',
          y: '253px',
          rotate: 'matrix(0.98, 0.2, -0.14, 0.99, 0, 0)',
          zIndex: 4
        }
      },
      {
        id: 5,
        name: 'کیسه خرید کرافت',
        image: '/images/main/5.png',
        specs: {
          width: '150.98px',
          height: '231.75px',
          x: 'calc(50% - 150.98px/2 - 35.17px)',
          y: 'calc(50% - 231.75px/2 + 55.51px)',
          rotate: '-16.54deg',
          zIndex: 5
        }
      }
    ]
  }];
  
  
/**
 * Static list of all packaging categories and their mock products.
 */
const defaultPackages =[
    {
      "id": 1,
      "name": "پکیج نمایشگاهی و رویدادی",
      "type": 'Applications',
      "color": "#FFB3BA",
      "items": [
        {
          "id": 1,
          "name": "کیسه کاغذی کرافت ناهار رایگان",
          "tags": [
            "نمایشگاهی",
            "تبلیغاتی",
            "رویدادی"
          ],
          "image": "/images/main/7.png",
          "specs": {
            "width": 174,
            "height": 204,
            "x": 47,
            "y": 69,
            "rotate": 0,
            "zIndex": 10
          }
        },
        {
          "id": 2,
          "name": "جعبه هدیه برنددار",
          "tags": [
            "نمایشگاهی",
            "رویدادی",
            "هدیه"
          ],
          "image": "/images/main/2.png",
          "specs": {
            "width": 250,
            "height": 280,
            "x": 64,
            "y": 15,
            "rotate": 6,
            "zIndex": 10
          }
        },
        {
          "id": 3,
          "name": "کیف تبلیغاتی",
          "tags": [
            "نمایشگاهی",
            "تبلیغاتی",
            "رویدادی"
          ],
          "image": "/images/main/11.png",
          "specs": {
            "width": 278,
            "height": 308,
            "x": 12,
            "y": 13,
            "rotate": 350,
            "zIndex": 10
          }
        },
        {
          "id": 4,
          "name": "پوشه نمایشگاهی",
          "tags": [
            "نمایشگاهی",
            "سازمانی"
          ],
          "image": "/images/main/4.png",
          "specs": {
            "width": 184,
            "height": 214,
            "x": -19,
            "y": 31,
            "rotate": 40,
            "zIndex": 9
          }
        },
        {
          "id": 5,
          "name": "کاور بروشور رویداد",
          "tags": [
            "رویدادی",
            "تبلیغاتی"
          ],
          "image": "/images/main/5.png",
          "specs": {
            "width": 163,
            "height": 193,
            "x": 9,
            "y": 73,
            "rotate": 330,
            "zIndex": 6
          }
        }
      ]
    },
    {
      "id": 2,
      "name": "پکیج صنعتی و فنی",
      "type": 'Industries',
      "color": "#B2FFBA",
      "items": [
        {
          "id": 6,
          "name": "جعبه کرافت تجهیزات فنی",
          "tags": [
            "صنعتی",
            "فنی",
            "کارگاهی"
          ],
          "image": "/images/main/13.png",
          "specs": {
            "width": 214,
            "height": 244,
            "x": 23,
            "y": 28,
            "rotate": 349,
            "zIndex": 15
          }
        },
        {
          "id": 7,
          "name": "جعبه ابزار صنعتی",
          "tags": [
            "صنعتی",
            "کارگاهی"
          ],
          "image": "/images/main/7.png",
          "specs": {
            "width": 170,
            "height": 200,
            "x": -18,
            "y": 29,
            "rotate": 320,
            "zIndex": 9
          }
        },
        {
          "id": 8,
          "name": "کیسه قطعات ماشین",
          "tags": [
            "صنعتی",
            "تولید"
          ],
          "image": "/images/main/6.png",
          "specs": {
            "width": 191,
            "height": 221,
            "x": 54,
            "y": 68,
            "rotate": 30,
            "zIndex": 10
          }
        },
        {
          "id": 9,
          "name": "کیف تجهیزات ایمنی",
          "tags": [
            "صنعتی",
            "ایمنی"
          ],
          "image": "/images/main/9.png",
          "specs": {
            "width": 203,
            "height": 233,
            "x": 5,
            "y": 76,
            "rotate": 330,
            "zIndex": 10
          }
        },
        {
          "id": 10,
          "name": "جعبه کیت ابزار کارگاه",
          "tags": [
            "کارگاهی",
            "فنی"
          ],
          "image": "/images/main/1.png",
          "specs": {
            "width": 170,
            "height": 200,
            "x": 80,
            "y": 28,
            "rotate": 20,
            "zIndex": 4
          }
        }
      ]
    },
    {
        "id": 3,
        "name": "پکیج آموزشی و فرهنگی",
        "type": 'Applications',
        "color": "#FFFACD",
        "items":  [
          {
            "id": 1,
            "name": "کیسه کاغذی کرافت ناهار رایگان",
            "tags": [
              "نمایشگاهی",
              "تبلیغاتی",
              "رویدادی"
            ],
            "image": "/images/main/1.png",
            "specs": {
              "width": 174,
              "height": 204,
              "x": 5,
              "y": 77,
              "rotate": 160,
              "zIndex": 10
            }
          },
          {
            "id": 2,
            "name": "جعبه هدیه برنددار",
            "tags": [
              "نمایشگاهی",
              "رویدادی",
              "هدیه"
            ],
            "image": "/images/main/9.png",
            "specs": {
              "width": 211,
              "height": 241,
              "x": 75,
              "y": 33,
              "rotate": 306,
              "zIndex": 10
            }
          },
          {
            "id": 3,
            "name": "کیف تبلیغاتی",
            "tags": [
              "نمایشگاهی",
              "تبلیغاتی",
              "رویدادی"
            ],
            "image": "/images/main/14.png",
            "specs": {
              "width": 247,
              "height": 277,
              "x": 24,
              "y": 20,
              "rotate": 20,
              "zIndex": 21
            }
          },
          {
            "id": 4,
            "name": "پوشه نمایشگاهی",
            "tags": [
              "نمایشگاهی",
              "سازمانی"
            ],
            "image": "/images/main/12.png",
            "specs": {
              "width": 212,
              "height": 242,
              "x": -28,
              "y": 24,
              "rotate": 60,
              "zIndex": 9
            }
          },
          {
            "id": 5,
            "name": "کاور بروشور رویداد",
            "tags": [
              "رویدادی",
              "تبلیغاتی"
            ],
            "image": "/images/main/3.png",
            "specs": {
              "width": 174,
              "height": 204,
              "x": 53,
              "y": 73,
              "rotate": 20,
              "zIndex": 6
            }
          }
        ]
      },
      {
        "id": 4,
        "name": "پکیج مناسبتی و سفارشی",
        "type": 'Industries',
        "color": "#D7BDE2",
        "items": [
            {
              "id": 1,
              "name": "کیسه کاغذی کرافت ناهار رایگان",
              "tags": [
                "نمایشگاهی",
                "تبلیغاتی",
                "رویدادی"
              ],
              "image": "/images/main/7.png",
              "specs": {
                "width": 174,
                "height": 204,
                "x": 52,
                "y": 66,
                "rotate": 150,
                "zIndex": 10
              }
            },
            {
              "id": 2,
              "name": "جعبه هدیه برنددار",
              "tags": [
                "نمایشگاهی",
                "رویدادی",
                "هدیه"
              ],
              "image": "/images/main/5.png",
              "specs": {
                "width": 180,
                "height": 210,
                "x": 79,
                "y": 33,
                "rotate": 136,
                "zIndex": 10
              }
            },
            {
              "id": 3,
              "name": "کیف تبلیغاتی",
              "tags": [
                "نمایشگاهی",
                "تبلیغاتی",
                "رویدادی"
              ],
              "image": "/images/main/17.png",
              "specs": {
                "width": 190,
                "height": 204,
                "x": 23,
                "y": 28,
                "rotate": 349,
                "zIndex": 15
    
              }
            },
            {
              "id": 4,
              "name": "پوشه نمایشگاهی",
              "tags": [
                "نمایشگاهی",
                "سازمانی"
              ],
              "image": "/images/main/7.png",
              "specs": {
                "width": 212,
                "height": 242,
                "x": -32,
                "y": 25,
                "rotate": 30,
                "zIndex": 9
              }
            },
            {
              "id": 5,
              "name": "کاور بروشور رویداد",
              "tags": [
                "رویدادی",
                "تبلیغاتی"
              ],
              "image": "/images/main/5.png",
              "specs": {
                "width": 163,
                "height": 193,
                "x": 9,
                "y": 73,
                "rotate": 330,
                "zIndex": 6
              }
            }
          ]
      },
    {
      "id": 5,
      "name": "پکیج تبلیغاتی و بازاریابی",
      "type": 'Applications',
      "color": "#BAE1FF",
      "items": [
        {
          "id": 6,
          "name": "جعبه کرافت تجهیزات فنی",
          "tags": [
            "صنعتی",
            "فنی",
            "کارگاهی"
          ],
          "image": "/images/main/14.png",
          "specs": {
            "width": 214,
            "height": 244,
            "x": 23,
            "y": 28,
            "rotate": 349,
            "zIndex": 15
          }
        },
        {
          "id": 7,
          "name": "جعبه ابزار صنعتی",
          "tags": [
            "صنعتی",
            "کارگاهی"
          ],
          "image": "/images/main/7.png",
          "specs": {
            "width": 170,
            "height": 200,
            "x": -18,
            "y": 29,
            "rotate": 320,
            "zIndex": 9
          }
        },
        {
          "id": 8,
          "name": "کیسه قطعات ماشین",
          "tags": [
            "صنعتی",
            "تولید"
          ],
          "image": "/images/main/6.png",
          "specs": {
            "width": 191,
            "height": 221,
            "x": 54,
            "y": 68,
            "rotate": 30,
            "zIndex": 10
          }
        },
        {
          "id": 9,
          "name": "کیف تجهیزات ایمنی",
          "tags": [
            "صنعتی",
            "ایمنی"
          ],
          "image": "/images/main/9.png",
          "specs": {
            "width": 203,
            "height": 233,
            "x": 5,
            "y": 76,
            "rotate": 330,
            "zIndex": 10
          }
        },
        {
          "id": 10,
          "name": "جعبه کیت ابزار کارگاه",
          "tags": [
            "کارگاهی",
            "فنی"
          ],
          "image": "/images/main/1.png",
          "specs": {
            "width": 170,
            "height": 200,
            "x": 80,
            "y": 28,
            "rotate": 20,
            "zIndex": 4
          }
        }
      ]
    },
    {
      "id": 6,
      "name": "پکیج لوکس و هدیه",
      "type": 'Industries',
      "color": "#FFD8B1",
      "items": [
        {
          "id": 6,
          "name": "جعبه کرافت تجهیزات فنی",
          "tags": [
            "صنعتی",
            "فنی",
            "کارگاهی"
          ],
          "image": "/images/main/13.png",
          "specs": {
            "width": 214,
            "height": 244,
            "x": 23,
            "y": 28,
            "rotate": 349,
            "zIndex": 15
          }
        },
        {
          "id": 7,
          "name": "جعبه ابزار صنعتی",
          "tags": [
            "صنعتی",
            "کارگاهی"
          ],
          "image": "/images/main/7.png",
          "specs": {
            "width": 170,
            "height": 200,
            "x": -18,
            "y": 29,
            "rotate": 320,
            "zIndex": 9
          }
        },
        {
          "id": 8,
          "name": "کیسه قطعات ماشین",
          "tags": [
            "صنعتی",
            "تولید"
          ],
          "image": "/images/main/6.png",
          "specs": {
            "width": 191,
            "height": 221,
            "x": 54,
            "y": 68,
            "rotate": 30,
            "zIndex": 10
          }
        },
        {
          "id": 9,
          "name": "کیف تجهیزات ایمنی",
          "tags": [
            "صنعتی",
            "ایمنی"
          ],
          "image": "/images/main/9.png",
          "specs": {
            "width": 203,
            "height": 233,
            "x": 5,
            "y": 76,
            "rotate": 330,
            "zIndex": 10
          }
        },
        {
          "id": 10,
          "name": "جعبه کیت ابزار کارگاه",
          "tags": [
            "کارگاهی",
            "فنی"
          ],
          "image": "/images/main/1.png",
          "specs": {
            "width": 170,
            "height": 200,
            "x": 80,
            "y": 28,
            "rotate": 20,
            "zIndex": 4
          }
        }
      ]
    },
    {
      "id": 7,
      "name": "پکیج سازمانی و اداری",
      "type": 'Applications',
      "color": "#B2EBF2",
      "items": [
        {
          "id": 1,
          "name": "کیسه کاغذی کرافت ناهار رایگان",
          "tags": [
            "نمایشگاهی",
            "تبلیغاتی",
            "رویدادی"
          ],
          "image": "/images/main/7.png",
          "specs": {
            "width": 174,
            "height": 204,
            "x": 47,
            "y": 69,
            "rotate": 0,
            "zIndex": 10
          }
        },
        {
          "id": 2,
          "name": "جعبه هدیه برنددار",
          "tags": [
            "نمایشگاهی",
            "رویدادی",
            "هدیه"
          ],
          "image": "/images/main/2.png",
          "specs": {
            "width": 250,
            "height": 280,
            "x": 64,
            "y": 15,
            "rotate": 6,
            "zIndex": 10
          }
        },
        {
          "id": 3,
          "name": "کیف تبلیغاتی",
          "tags": [
            "نمایشگاهی",
            "تبلیغاتی",
            "رویدادی"
          ],
          "image": "/images/main/11.png",
          "specs": {
            "width": 278,
            "height": 308,
            "x": 12,
            "y": 13,
            "rotate": 350,
            "zIndex": 10
          }
        },
        {
          "id": 4,
          "name": "پوشه نمایشگاهی",
          "tags": [
            "نمایشگاهی",
            "سازمانی"
          ],
          "image": "/images/main/4.png",
          "specs": {
            "width": 184,
            "height": 214,
            "x": -19,
            "y": 31,
            "rotate": 40,
            "zIndex": 9
          }
        },
        {
          "id": 5,
          "name": "کاور بروشور رویداد",
          "tags": [
            "رویدادی",
            "تبلیغاتی"
          ],
          "image": "/images/main/5.png",
          "specs": {
            "width": 163,
            "height": 193,
            "x": 9,
            "y": 73,
            "rotate": 330,
            "zIndex": 6
          }
        }
      ]
    },
    {
        "id": 7,
        "name": "پکیج سازمانی و اداری",
        "type": 'Industries',
        "color": "#B2EBF2",
        "items": [
          {
            "id": 1,
            "name": "کیسه کاغذی کرافت ناهار رایگان",
            "tags": [
              "نمایشگاهی",
              "تبلیغاتی",
              "رویدادی"
            ],
            "image": "/images/main/7.png",
            "specs": {
              "width": 174,
              "height": 204,
              "x": 47,
              "y": 69,
              "rotate": 0,
              "zIndex": 10
            }
          },
          {
            "id": 2,
            "name": "جعبه هدیه برنددار",
            "tags": [
              "نمایشگاهی",
              "رویدادی",
              "هدیه"
            ],
            "image": "/images/main/2.png",
            "specs": {
              "width": 250,
              "height": 280,
              "x": 64,
              "y": 15,
              "rotate": 6,
              "zIndex": 10
            }
          },
          {
            "id": 3,
            "name": "کیف تبلیغاتی",
            "tags": [
              "نمایشگاهی",
              "تبلیغاتی",
              "رویدادی"
            ],
            "image": "/images/main/11.png",
            "specs": {
              "width": 278,
              "height": 308,
              "x": 12,
              "y": 13,
              "rotate": 350,
              "zIndex": 10
            }
          },
          {
            "id": 4,
            "name": "پوشه نمایشگاهی",
            "tags": [
              "نمایشگاهی",
              "سازمانی"
            ],
            "image": "/images/main/4.png",
            "specs": {
              "width": 184,
              "height": 214,
              "x": -19,
              "y": 31,
              "rotate": 40,
              "zIndex": 9
            }
          },
          {
            "id": 5,
            "name": "کاور بروشور رویداد",
            "tags": [
              "رویدادی",
              "تبلیغاتی"
            ],
            "image": "/images/main/5.png",
            "specs": {
              "width": 163,
              "height": 193,
              "x": 9,
              "y": 73,
              "rotate": 330,
              "zIndex": 6
            }
          }
        ]
      },
    {
        "id": 9,
        "name": "پکیج لوکس و هدیه",
        "type": 'Applications',
        "color": "#FFD8B1",
        "items": [
          {
            "id": 6,
            "name": "جعبه کرافت تجهیزات فنی",
            "tags": [
              "صنعتی",
              "فنی",
              "کارگاهی"
            ],
            "image": "/images/main/13.png",
            "specs": {
              "width": 214,
              "height": 244,
              "x": 23,
              "y": 28,
              "rotate": 349,
              "zIndex": 15
            }
          },
          {
            "id": 7,
            "name": "جعبه ابزار صنعتی",
            "tags": [
              "صنعتی",
              "کارگاهی"
            ],
            "image": "/images/main/7.png",
            "specs": {
              "width": 170,
              "height": 200,
              "x": -18,
              "y": 29,
              "rotate": 320,
              "zIndex": 9
            }
          },
          {
            "id": 8,
            "name": "کیسه قطعات ماشین",
            "tags": [
              "صنعتی",
              "تولید"
            ],
            "image": "/images/main/6.png",
            "specs": {
              "width": 191,
              "height": 221,
              "x": 54,
              "y": 68,
              "rotate": 30,
              "zIndex": 10
            }
          },
          {
            "id": 9,
            "name": "کیف تجهیزات ایمنی",
            "tags": [
              "صنعتی",
              "ایمنی"
            ],
            "image": "/images/main/9.png",
            "specs": {
              "width": 203,
              "height": 233,
              "x": 5,
              "y": 76,
              "rotate": 330,
              "zIndex": 10
            }
          },
          {
            "id": 10,
            "name": "جعبه کیت ابزار کارگاه",
            "tags": [
              "کارگاهی",
              "فنی"
            ],
            "image": "/images/main/1.png",
            "specs": {
              "width": 170,
              "height": 200,
              "x": 80,
              "y": 28,
              "rotate": 20,
              "zIndex": 4
            }
          }
        ]
      },
      {
        "id": 10,
        "name": "پکیج آموزشی و فرهنگی",
        "type": 'Industries',
        "color": "#FFFACD",
        "items":  [
          {
            "id": 1,
            "name": "کیسه کاغذی کرافت ناهار رایگان",
            "tags": [
              "نمایشگاهی",
              "تبلیغاتی",
              "رویدادی"
            ],
            "image": "/images/main/1.png",
            "specs": {
              "width": 174,
              "height": 204,
              "x": 5,
              "y": 77,
              "rotate": 160,
              "zIndex": 10
            }
          },
          {
            "id": 2,
            "name": "جعبه هدیه برنددار",
            "tags": [
              "نمایشگاهی",
              "رویدادی",
              "هدیه"
            ],
            "image": "/images/main/9.png",
            "specs": {
              "width": 211,
              "height": 241,
              "x": 75,
              "y": 33,
              "rotate": 306,
              "zIndex": 10
            }
          },
          {
            "id": 3,
            "name": "کیف تبلیغاتی",
            "tags": [
              "نمایشگاهی",
              "تبلیغاتی",
              "رویدادی"
            ],
            "image": "/images/main/14.png",
            "specs": {
              "width": 247,
              "height": 277,
              "x": 24,
              "y": 20,
              "rotate": 20,
              "zIndex": 21
            }
          },
          {
            "id": 4,
            "name": "پوشه نمایشگاهی",
            "tags": [
              "نمایشگاهی",
              "سازمانی"
            ],
            "image": "/images/main/12.png",
            "specs": {
              "width": 212,
              "height": 242,
              "x": -28,
              "y": 24,
              "rotate": 60,
              "zIndex": 9
            }
          },
          {
            "id": 5,
            "name": "کاور بروشور رویداد",
            "tags": [
              "رویدادی",
              "تبلیغاتی"
            ],
            "image": "/images/main/3.png",
            "specs": {
              "width": 174,
              "height": 204,
              "x": 53,
              "y": 73,
              "rotate": 20,
              "zIndex": 6
            }
          }
        ]
      },
  
  ]
  
  export default defaultPackages;

/**
 * Nuxt 3 composable to get all the packages.
 */
export const usePackages = () => {
  // you can swap ref() for useState() if you need it to be global across pages
  const packages = ref(defaultPackages)
  const examplePackages = ref(examplePackagesArr)
  return { examplePackages, packages }
}

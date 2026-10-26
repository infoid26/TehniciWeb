window.TW_EXAM = {
  "version": 1,
  "sourceLabel": "Fotografii furnizate de student: anunț ID 2025–2026 și exemple de bilete.",
  "exercises": [
    {
      "id": "exam-foundation-css-rule",
      "title": "O declarație: proprietate și valoare",
      "category": "css",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "color schimbă culoarea textului; navy este valoarea culorii.",
      "steps": [
        "Selectorul dinaintea acoladelor spune ce elemente stilizezi.",
        "În acolade, proprietatea spune ce schimbi, iar valoarea arată noul aspect.",
        "Două puncte separă proprietatea de valoare; punctul și virgula încheie declarația."
      ],
      "answer": "",
      "rubric": [
        "Stilizează HTML-ul furnizat pentru a obține aspectul descris mai jos.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "css-rule",
      "task": {
        "mode": "css",
        "prompt": "Stilizează HTML-ul furnizat pentru a obține aspectul descris mai jos.",
        "solution": "p { color: navy; }",
        "fixture": "<p>Fresh cakes</p>",
        "tests": [
          {
            "kind": "style",
            "selector": "p",
            "name": "color",
            "value": "rgb(0, 0, 128)",
            "label": "p: proprietatea color trebuie să aibă valoarea calculată rgb(0, 0, 128)."
          }
        ],
        "starter": "",
        "id": "exam-foundation-css-rule",
        "requirements": [
          "`p`: proprietatea `color` trebuie să aibă valoarea calculată `rgb(0, 0, 128)`."
        ]
      }
    },
    {
      "id": "exam-foundation-css-class",
      "title": "Clase reutilizabile",
      "category": "css",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "Selectorul alege elementele, iar declarațiile dintre acolade le schimbă aspectul. Observă rezultatul înainte să continui.",
      "steps": [
        "O clasă poate fi folosită de mai multe elemente. În HTML scriem class=\"product-card\", iar în CSS punem punct în fața numelui.",
        "Selectorul alege elementele, iar declarațiile dintre acolade le schimbă aspectul. Observă rezultatul înainte să continui."
      ],
      "answer": "",
      "rubric": [
        "Stilizează HTML-ul furnizat pentru a obține aspectul descris mai jos.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "css-class",
      "task": {
        "mode": "css",
        "prompt": "Stilizează HTML-ul furnizat pentru a obține aspectul descris mai jos.",
        "solution": ".product-card { color: navy; }",
        "fixture": "<p class=\"product-card\">Cake</p><p>Tea</p>",
        "tests": [
          {
            "kind": "style",
            "selector": ".product-card",
            "name": "color",
            "value": "rgb(0, 0, 128)",
            "label": ".product-card: proprietatea color trebuie să aibă valoarea calculată rgb(0, 0, 128)."
          },
          {
            "kind": "style",
            "selector": "p:last-child",
            "name": "color",
            "value": "rgb(0, 0, 0)",
            "label": "p:last-child: proprietatea color trebuie să aibă valoarea calculată rgb(0, 0, 0)."
          }
        ],
        "starter": "",
        "id": "exam-foundation-css-class",
        "requirements": [
          "`.product-card`: proprietatea `color` trebuie să aibă valoarea calculată `rgb(0, 0, 128)`.",
          "`p:last-child`: proprietatea `color` trebuie să aibă valoarea calculată `rgb(0, 0, 0)`."
        ]
      }
    },
    {
      "id": "exam-foundation-css-id",
      "title": "Selectează un id",
      "category": "css",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "Selectorul alege elementele, iar declarațiile dintre acolade le schimbă aspectul. Observă rezultatul înainte să continui.",
      "steps": [
        "Un id trebuie să fie unic în document. Selectorul său folosește #. Nu pune # în valoarea atributului HTML.",
        "Selectorul alege elementele, iar declarațiile dintre acolade le schimbă aspectul. Observă rezultatul înainte să continui."
      ],
      "answer": "",
      "rubric": [
        "Stilizează HTML-ul furnizat pentru a obține aspectul descris mai jos.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "css-id",
      "task": {
        "mode": "css",
        "prompt": "Stilizează HTML-ul furnizat pentru a obține aspectul descris mai jos.",
        "solution": "#welcome { color: teal; }",
        "fixture": "<p id=\"welcome\">Welcome</p>",
        "tests": [
          {
            "kind": "style",
            "selector": "#welcome",
            "name": "color",
            "value": "rgb(0, 128, 128)",
            "label": "#welcome: proprietatea color trebuie să aibă valoarea calculată rgb(0, 128, 128)."
          }
        ],
        "starter": "",
        "id": "exam-foundation-css-id",
        "requirements": [
          "`#welcome`: proprietatea `color` trebuie să aibă valoarea calculată `rgb(0, 128, 128)`."
        ]
      }
    },
    {
      "id": "exam-foundation-css-colors",
      "title": "Formate pentru culori",
      "category": "css",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "Selectorul alege elementele, iar declarațiile dintre acolade le schimbă aspectul. Observă rezultatul înainte să continui.",
      "steps": [
        "O culoare poate fi un nume, hex, rgb sau hsl. Valori diferite pot descrie aceeași culoare; browserul calculează o reprezentare normalizată.",
        "Selectorul alege elementele, iar declarațiile dintre acolade le schimbă aspectul. Observă rezultatul înainte să continui."
      ],
      "answer": "",
      "rubric": [
        "Stilizează HTML-ul furnizat pentru a obține aspectul descris mai jos.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "css-colors",
      "task": {
        "mode": "css",
        "prompt": "Stilizează HTML-ul furnizat pentru a obține aspectul descris mai jos.",
        "solution": ".card { color: #000080; background-color: rgb(238, 242, 255); }",
        "fixture": "<p class=\"card\">Colors</p>",
        "tests": [
          {
            "kind": "style",
            "selector": ".card",
            "name": "color",
            "value": "rgb(0, 0, 128)",
            "label": ".card: proprietatea color trebuie să aibă valoarea calculată rgb(0, 0, 128)."
          },
          {
            "kind": "style",
            "selector": ".card",
            "name": "background-color",
            "value": "rgb(238, 242, 255)",
            "label": ".card: proprietatea background-color trebuie să aibă valoarea calculată rgb(238, 242, 255)."
          }
        ],
        "starter": "",
        "id": "exam-foundation-css-colors",
        "requirements": [
          "`.card`: proprietatea `color` trebuie să aibă valoarea calculată `rgb(0, 0, 128)`.",
          "`.card`: proprietatea `background-color` trebuie să aibă valoarea calculată `rgb(238, 242, 255)`."
        ]
      }
    },
    {
      "id": "exam-foundation-selector-attr-prefix",
      "title": "[href^=\"https\"]",
      "category": "css",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "Potrivește începutul valorii atributului.",
      "steps": [
        "Un atribut HTML are un nume și o valoare, precum href și adresa unei legături.",
        "[href^=\"https\"] selectează elementele al căror href începe cu textul https.",
        "Declarațiile din acolade se aplică doar elementelor selectate; atributul nu este modificat."
      ],
      "answer": "",
      "rubric": [
        "Fă textul elementelor selectate prin `[href^=\"https\"]` de culoare `navy`. Potrivește începutul valorii atributului.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "selector-attr-prefix",
      "task": {
        "mode": "css",
        "prompt": "Fă textul elementelor selectate prin `[href^=\"https\"]` de culoare `navy`. Potrivește începutul valorii atributului.",
        "solution": "[href^=\"https\"] { color: navy; }",
        "fixture": "<a href=\"https://example.com\">Secure</a><a href=\"/home\">Home</a>",
        "tests": [
          {
            "kind": "style",
            "selector": "[href^=\"https\"]",
            "name": "color",
            "value": "rgb(0, 0, 128)",
            "label": "[href^=\"https\"]: proprietatea color trebuie să aibă valoarea calculată rgb(0, 0, 128)."
          }
        ],
        "starter": "",
        "id": "exam-foundation-selector-attr-prefix",
        "requirements": [
          "`[href^=\"https\"]`: proprietatea `color` trebuie să aibă valoarea calculată `rgb(0, 0, 128)`."
        ]
      }
    },
    {
      "id": "exam-foundation-selector-attr-suffix",
      "title": "[href$=\".pdf\"]",
      "category": "css",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "Potrivește sfârșitul valorii; nu verifică singur tipul MIME.",
      "steps": [
        "Potrivește sfârșitul valorii; nu verifică singur tipul MIME.",
        "Potrivește sfârșitul valorii; nu verifică singur tipul MIME."
      ],
      "answer": "",
      "rubric": [
        "Fă textul elementelor selectate prin `[href$=\".pdf\"]` de culoare `navy`. Potrivește sfârșitul valorii; nu verifică singur tipul MIME.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "selector-attr-suffix",
      "task": {
        "mode": "css",
        "prompt": "Fă textul elementelor selectate prin `[href$=\".pdf\"]` de culoare `navy`. Potrivește sfârșitul valorii; nu verifică singur tipul MIME.",
        "solution": "[href$=\".pdf\"] { color: navy; }",
        "fixture": "<a href=\"menu.pdf\">Menu</a><a href=\"home.html\">Home</a>",
        "tests": [
          {
            "kind": "style",
            "selector": "[href$=\".pdf\"]",
            "name": "color",
            "value": "rgb(0, 0, 128)",
            "label": "[href$=\".pdf\"]: proprietatea color trebuie să aibă valoarea calculată rgb(0, 0, 128)."
          }
        ],
        "starter": "",
        "id": "exam-foundation-selector-attr-suffix",
        "requirements": [
          "`[href$=\".pdf\"]`: proprietatea `color` trebuie să aibă valoarea calculată `rgb(0, 0, 128)`."
        ]
      }
    },
    {
      "id": "exam-foundation-selector-attr-substring",
      "title": "[href*=\"cake\"]",
      "category": "css",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "Potrivește un subșir oriunde în valoare.",
      "steps": [
        "Potrivește un subșir oriunde în valoare.",
        "Potrivește un subșir oriunde în valoare."
      ],
      "answer": "",
      "rubric": [
        "Fă textul elementelor selectate prin `[href*=\"cake\"]` de culoare `navy`. Potrivește un subșir oriunde în valoare.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "selector-attr-substring",
      "task": {
        "mode": "css",
        "prompt": "Fă textul elementelor selectate prin `[href*=\"cake\"]` de culoare `navy`. Potrivește un subșir oriunde în valoare.",
        "solution": "[href*=\"cake\"] { color: navy; }",
        "fixture": "<a href=\"/products/cakes\">Cakes</a><a href=\"/tea\">Tea</a>",
        "tests": [
          {
            "kind": "style",
            "selector": "[href*=\"cake\"]",
            "name": "color",
            "value": "rgb(0, 0, 128)",
            "label": "[href*=\"cake\"]: proprietatea color trebuie să aibă valoarea calculată rgb(0, 0, 128)."
          }
        ],
        "starter": "",
        "id": "exam-foundation-selector-attr-substring",
        "requirements": [
          "`[href*=\"cake\"]`: proprietatea `color` trebuie să aibă valoarea calculată `rgb(0, 0, 128)`."
        ]
      }
    },
    {
      "id": "exam-foundation-selector-attr-word",
      "title": "[class~=\"featured\"]",
      "category": "css",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "Potrivește un cuvânt separat prin spații, nu orice subșir.",
      "steps": [
        "Potrivește un cuvânt separat prin spații, nu orice subșir.",
        "Potrivește un cuvânt separat prin spații, nu orice subșir."
      ],
      "answer": "",
      "rubric": [
        "Fă textul elementelor selectate prin `[class~=\"featured\"]` de culoare `navy`. Potrivește un cuvânt separat prin spații, nu orice subșir.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "selector-attr-word",
      "task": {
        "mode": "css",
        "prompt": "Fă textul elementelor selectate prin `[class~=\"featured\"]` de culoare `navy`. Potrivește un cuvânt separat prin spații, nu orice subșir.",
        "solution": "[class~=\"featured\"] { color: navy; }",
        "fixture": "<p class=\"card featured\">Cake</p><p class=\"featured-card\">Tea</p>",
        "tests": [
          {
            "kind": "style",
            "selector": "[class~=\"featured\"]",
            "name": "color",
            "value": "rgb(0, 0, 128)",
            "label": "[class~=\"featured\"]: proprietatea color trebuie să aibă valoarea calculată rgb(0, 0, 128)."
          }
        ],
        "starter": "",
        "id": "exam-foundation-selector-attr-word",
        "requirements": [
          "`[class~=\"featured\"]`: proprietatea `color` trebuie să aibă valoarea calculată `rgb(0, 0, 128)`."
        ]
      }
    },
    {
      "id": "exam-foundation-css-display",
      "title": "display, visibility și overflow",
      "category": "css",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "Selectorul alege elementele, iar declarațiile dintre acolade le schimbă aspectul. Observă rezultatul înainte să continui.",
      "steps": [
        "display stabilește felul în care un element participă la așezarea paginii.",
        "block și inline descriu comportamente de bază; none elimină cutia din așezare.",
        "visibility: hidden păstrează spațiul ocupat, deși conținutul nu se vede."
      ],
      "answer": "",
      "rubric": [
        "Stilizează HTML-ul furnizat pentru a obține aspectul descris mai jos.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "css-display",
      "task": {
        "mode": "css",
        "prompt": "Stilizează HTML-ul furnizat pentru a obține aspectul descris mai jos.",
        "solution": ".hidden-item { display: none; }\n.table-wrapper { overflow-x: auto; }",
        "fixture": "<p class=\"hidden-item\">Hidden</p><div class=\"table-wrapper\">Wide table</div>",
        "tests": [
          {
            "kind": "style",
            "selector": ".hidden-item",
            "name": "display",
            "value": "none",
            "label": ".hidden-item: proprietatea display trebuie să aibă valoarea calculată none."
          },
          {
            "kind": "style",
            "selector": ".table-wrapper",
            "name": "overflow-x",
            "value": "auto",
            "label": ".table-wrapper: proprietatea overflow-x trebuie să aibă valoarea calculată auto."
          }
        ],
        "starter": "",
        "id": "exam-foundation-css-display",
        "requirements": [
          "`.hidden-item`: proprietatea `display` trebuie să aibă valoarea calculată `none`.",
          "`.table-wrapper`: proprietatea `overflow-x` trebuie să aibă valoarea calculată `auto`."
        ]
      }
    },
    {
      "id": "exam-foundation-css-flex",
      "title": "Un rând flexibil",
      "category": "css",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "Selectorul alege elementele, iar declarațiile dintre acolade le schimbă aspectul. Observă rezultatul înainte să continui.",
      "steps": [
        "display flex se aplică părintelui. Copiii direcți sunt aranjați pe axa principală. gap creează spații fără a pune margini pe fiecare copil.",
        "Selectorul alege elementele, iar declarațiile dintre acolade le schimbă aspectul. Observă rezultatul înainte să continui."
      ],
      "answer": "",
      "rubric": [
        "Stilizează HTML-ul furnizat pentru a obține aspectul descris mai jos.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "css-flex",
      "task": {
        "mode": "css",
        "prompt": "Stilizează HTML-ul furnizat pentru a obține aspectul descris mai jos.",
        "solution": ".menu { display: flex; gap: 16px; }",
        "fixture": "<div class=\"menu\"><a>Home</a><a>Products</a></div>",
        "tests": [
          {
            "kind": "style",
            "selector": ".menu",
            "name": "display",
            "value": "flex",
            "label": ".menu: proprietatea display trebuie să aibă valoarea calculată flex."
          },
          {
            "kind": "style",
            "selector": ".menu",
            "name": "gap",
            "value": "16px",
            "label": ".menu: proprietatea gap trebuie să aibă valoarea calculată 16px."
          }
        ],
        "starter": "",
        "id": "exam-foundation-css-flex",
        "requirements": [
          "`.menu`: proprietatea `display` trebuie să aibă valoarea calculată `flex`.",
          "`.menu`: proprietatea `gap` trebuie să aibă valoarea calculată `16px`."
        ]
      }
    },
    {
      "id": "exam-foundation-css-flex-axes",
      "title": "Axe și aliniere",
      "category": "css",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "Selectorul alege elementele, iar declarațiile dintre acolade le schimbă aspectul. Observă rezultatul înainte să continui.",
      "steps": [
        "justify-content lucrează pe axa principală; align-items pe cea transversală. Când flex-direction devine column, axele își schimbă orientarea.",
        "Selectorul alege elementele, iar declarațiile dintre acolade le schimbă aspectul. Observă rezultatul înainte să continui."
      ],
      "answer": "",
      "rubric": [
        "Stilizează HTML-ul furnizat pentru a obține aspectul descris mai jos.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "css-flex-axes",
      "task": {
        "mode": "css",
        "prompt": "Stilizează HTML-ul furnizat pentru a obține aspectul descris mai jos.",
        "solution": ".menu { display: flex; justify-content: space-between; align-items: center; }",
        "fixture": "<div class=\"menu\"><span>Home</span><span>Products</span></div>",
        "tests": [
          {
            "kind": "style",
            "selector": ".menu",
            "name": "justify-content",
            "value": "space-between",
            "label": ".menu: proprietatea justify-content trebuie să aibă valoarea calculată space-between."
          },
          {
            "kind": "style",
            "selector": ".menu",
            "name": "align-items",
            "value": "center",
            "label": ".menu: proprietatea align-items trebuie să aibă valoarea calculată center."
          }
        ],
        "starter": "",
        "id": "exam-foundation-css-flex-axes",
        "requirements": [
          "`.menu`: proprietatea `justify-content` trebuie să aibă valoarea calculată `space-between`.",
          "`.menu`: proprietatea `align-items` trebuie să aibă valoarea calculată `center`."
        ]
      }
    },
    {
      "id": "exam-foundation-css-flex-sizing",
      "title": "Înfășurare și dimensiuni flexibile",
      "category": "css",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "Selectorul alege elementele, iar declarațiile dintre acolade le schimbă aspectul. Observă rezultatul înainte să continui.",
      "steps": [
        "flex-wrap permite rânduri noi. flex-basis oferă dimensiunea de bază; flex-grow distribuie spațiul liber; flex-shrink controlează micșorarea.",
        "Selectorul alege elementele, iar declarațiile dintre acolade le schimbă aspectul. Observă rezultatul înainte să continui."
      ],
      "answer": "",
      "rubric": [
        "Stilizează HTML-ul furnizat pentru a obține aspectul descris mai jos.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "css-flex-sizing",
      "task": {
        "mode": "css",
        "prompt": "Stilizează HTML-ul furnizat pentru a obține aspectul descris mai jos.",
        "solution": ".cards { display: flex; flex-wrap: wrap; gap: 16px; }\n.card { flex: 1 1 180px; }",
        "fixture": "<div class=\"cards\"><div class=\"card\">Cake</div><div class=\"card\">Tea</div></div>",
        "tests": [
          {
            "kind": "style",
            "selector": ".cards",
            "name": "flex-wrap",
            "value": "wrap",
            "label": ".cards: proprietatea flex-wrap trebuie să aibă valoarea calculată wrap."
          },
          {
            "kind": "style",
            "selector": ".card",
            "name": "flex-grow",
            "value": "1",
            "label": ".card: proprietatea flex-grow trebuie să aibă valoarea calculată 1."
          },
          {
            "kind": "style",
            "selector": ".card",
            "name": "flex-basis",
            "value": "180px",
            "label": ".card: proprietatea flex-basis trebuie să aibă valoarea calculată 180px."
          }
        ],
        "starter": "",
        "id": "exam-foundation-css-flex-sizing",
        "requirements": [
          "`.cards`: proprietatea `flex-wrap` trebuie să aibă valoarea calculată `wrap`.",
          "`.card`: proprietatea `flex-grow` trebuie să aibă valoarea calculată `1`.",
          "`.card`: proprietatea `flex-basis` trebuie să aibă valoarea calculată `180px`."
        ]
      }
    },
    {
      "id": "exam-foundation-css-radial",
      "title": "Gradient radial",
      "category": "css",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "Un gradient radial pornește dintr-un centru și se extinde spre exterior.",
      "steps": [
        "Un gradient este o tranziție între culori, folosită ca imagine de fundal.",
        "radial-gradient pornește dintr-un centru și se extinde spre exterior.",
        "Îl atribui proprietății background-image; nu ai nevoie de un fișier imagine."
      ],
      "answer": "",
      "rubric": [
        "Aplică pe `.card` un gradient radial circular de la navy la teal.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "css-radial",
      "task": {
        "mode": "css",
        "prompt": "Aplică pe `.card` un gradient radial circular de la navy la teal.",
        "solution": ".card { background-image: radial-gradient(circle, navy, teal); }",
        "fixture": "<div class=\"card\">Cake</div>",
        "tests": [
          {
            "kind": "cssIncludes",
            "value": "radial-gradient(circle, navy, teal)",
            "label": "Include în CSS construcția radial-gradient(circle, navy, teal)."
          }
        ],
        "starter": "",
        "id": "exam-foundation-css-radial",
        "requirements": [
          "Include în CSS construcția `radial-gradient(circle, navy, teal)`."
        ]
      }
    },
    {
      "id": "exam-foundation-css-calc",
      "title": "Calcule între unități",
      "category": "css",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "calc permite calcule între valori compatibile. Operațiile + și - cer spații în expresia CSS.",
      "steps": [
        "calc permite calcule între valori compatibile. Operațiile + și - cer spații în expresia CSS.",
        "calc permite calcule între valori compatibile. Operațiile + și - cer spații în expresia CSS."
      ],
      "answer": "",
      "rubric": [
        "Setează lățimea `.card` la lățimea containerului minus 40px folosind calc.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "css-calc",
      "task": {
        "mode": "css",
        "prompt": "Setează lățimea `.card` la lățimea containerului minus 40px folosind calc.",
        "solution": ".card { width: calc(100% - 40px); }",
        "fixture": "<div class=\"card\">Cake</div>",
        "tests": [
          {
            "kind": "cssIncludes",
            "value": "calc(100% - 40px)",
            "label": "Include în CSS construcția calc(100% - 40px)."
          }
        ],
        "starter": "",
        "id": "exam-foundation-css-calc",
        "requirements": [
          "Include în CSS construcția `calc(100% - 40px)`."
        ]
      }
    },
    {
      "id": "exam-foundation-css-variable-fallback",
      "title": "Valoare de rezervă pentru var",
      "category": "css",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "Al doilea argument al var este folosit dacă proprietatea personalizată lipsește sau nu poate fi substituită conform regulilor variabilelor.",
      "steps": [
        "Al doilea argument al var este folosit dacă proprietatea personalizată lipsește sau nu poate fi substituită conform regulilor variabilelor.",
        "Al doilea argument al var este folosit dacă proprietatea personalizată lipsește sau nu poate fi substituită conform regulilor variabilelor."
      ],
      "answer": "",
      "rubric": [
        "Folosește `var(--accent, navy)` pentru culoarea `.card`, fără să definești --accent.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "css-variable-fallback",
      "task": {
        "mode": "css",
        "prompt": "Folosește `var(--accent, navy)` pentru culoarea `.card`, fără să definești --accent.",
        "solution": ".card { color: var(--accent, navy); }",
        "fixture": "<p class=\"card\">Cake</p>",
        "tests": [
          {
            "kind": "style",
            "selector": ".card",
            "name": "color",
            "value": "rgb(0, 0, 128)",
            "label": ".card: proprietatea color trebuie să aibă valoarea calculată rgb(0, 0, 128)."
          }
        ],
        "starter": "",
        "id": "exam-foundation-css-variable-fallback",
        "requirements": [
          "`.card`: proprietatea `color` trebuie să aibă valoarea calculată `rgb(0, 0, 128)`."
        ]
      }
    },
    {
      "id": "exam-foundation-css-global-values",
      "title": "inherit pentru o proprietate explicită",
      "category": "css",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "inherit cere valoarea calculată a părintelui chiar și pentru proprietăți care nu se moștenesc implicit.",
      "steps": [
        "inherit cere valoarea calculată a părintelui chiar și pentru proprietăți care nu se moștenesc implicit.",
        "inherit cere valoarea calculată a părintelui chiar și pentru proprietăți care nu se moștenesc implicit."
      ],
      "answer": "",
      "rubric": [
        "Pune pe `.parent` un border de 2px solid navy și moștenește explicit border-ul pe `.child`.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "css-global-values",
      "task": {
        "mode": "css",
        "prompt": "Pune pe `.parent` un border de 2px solid navy și moștenește explicit border-ul pe `.child`.",
        "solution": ".parent { border: 2px solid navy; } .child { border: inherit; }",
        "fixture": "<div class=\"parent\"><p class=\"child\">Cake</p></div>",
        "tests": [
          {
            "kind": "style",
            "selector": ".child",
            "name": "border-top-width",
            "value": "2px",
            "label": ".child: proprietatea border-top-width trebuie să aibă valoarea calculată 2px."
          },
          {
            "kind": "style",
            "selector": ".child",
            "name": "border-top-color",
            "value": "rgb(0, 0, 128)",
            "label": ".child: proprietatea border-top-color trebuie să aibă valoarea calculată rgb(0, 0, 128)."
          }
        ],
        "starter": "",
        "id": "exam-foundation-css-global-values",
        "requirements": [
          "`.child`: proprietatea `border-top-width` trebuie să aibă valoarea calculată `2px`.",
          "`.child`: proprietatea `border-top-color` trebuie să aibă valoarea calculată `rgb(0, 0, 128)`."
        ]
      }
    },
    {
      "id": "exam-foundation-css-detail-background-attachment",
      "title": "background-attachment",
      "category": "css",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "Citește declarația ca proprietate: valoare. Verificarea acestei lecții urmărește declarația cerută; layout-ul combinat este exersat în capitolul CSS și în proiect.",
      "steps": [
        "Fundalul este desenat într-o zonă a elementului.",
        "background-attachment stabilește dacă imaginea se deplasează cu pagina sau rămâne fixă.",
        "Compară scroll cu fixed; proprietatea nu fixează elementul HTML în sine."
      ],
      "answer": "",
      "rubric": [
        "Pentru selectorul `.sample`, declară `background-attachment` cu valoarea `fixed`. Stabilește dacă fundalul se deplasează cu elementul sau rămâne fix față de viewport. fixed nu fixează și textul.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "css-detail-background-attachment",
      "task": {
        "mode": "css",
        "prompt": "Pentru selectorul `.sample`, declară `background-attachment` cu valoarea `fixed`. Stabilește dacă fundalul se deplasează cu elementul sau rămâne fix față de viewport. fixed nu fixează și textul.",
        "solution": ".sample {\n  background-attachment: fixed;\n}",
        "fixture": "<div class=\"sample\">Demo Catalog</div>",
        "tests": [
          {
            "kind": "cssIncludes",
            "value": "background-attachment:fixed",
            "label": "Include în CSS construcția background-attachment:fixed."
          }
        ],
        "starter": "",
        "id": "exam-foundation-css-detail-background-attachment",
        "requirements": [
          "Include în CSS construcția `background-attachment:fixed`."
        ]
      }
    },
    {
      "id": "exam-foundation-css-detail-background-clip",
      "title": "background-clip",
      "category": "css",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "Citește declarația ca proprietate: valoare. Verificarea acestei lecții urmărește declarația cerută; layout-ul combinat este exersat în capitolul CSS și în proiect.",
      "steps": [
        "Limitează zona în care se pictează fundalul. padding-box exclude zona conturului.",
        "Limitează zona în care se pictează fundalul. padding-box exclude zona conturului. În regula CSS, selectorul alege elementul, iar perechea proprietate: valoare îi stabilește aspectul."
      ],
      "answer": "",
      "rubric": [
        "Pentru selectorul `.sample`, declară `background-clip` cu valoarea `padding-box`. Limitează zona în care se pictează fundalul. padding-box exclude zona conturului.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "css-detail-background-clip",
      "task": {
        "mode": "css",
        "prompt": "Pentru selectorul `.sample`, declară `background-clip` cu valoarea `padding-box`. Limitează zona în care se pictează fundalul. padding-box exclude zona conturului.",
        "solution": ".sample {\n  background-clip: padding-box;\n}",
        "fixture": "<div class=\"sample\">Demo Catalog</div>",
        "tests": [
          {
            "kind": "cssIncludes",
            "value": "background-clip:padding-box",
            "label": "Include în CSS construcția background-clip:padding-box."
          }
        ],
        "starter": "",
        "id": "exam-foundation-css-detail-background-clip",
        "requirements": [
          "Include în CSS construcția `background-clip:padding-box`."
        ]
      }
    },
    {
      "id": "exam-foundation-css-detail-background-position",
      "title": "background-position",
      "category": "css",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "Citește declarația ca proprietate: valoare. Verificarea acestei lecții urmărește declarația cerută; layout-ul combinat este exersat în capitolul CSS și în proiect.",
      "steps": [
        "Poziționează imaginea de fundal în zona disponibilă; center o centrează.",
        "Poziționează imaginea de fundal în zona disponibilă; center o centrează. În regula CSS, selectorul alege elementul, iar perechea proprietate: valoare îi stabilește aspectul."
      ],
      "answer": "",
      "rubric": [
        "Pentru selectorul `.sample`, declară `background-position` cu valoarea `center`. Poziționează imaginea de fundal în zona disponibilă; center o centrează.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "css-detail-background-position",
      "task": {
        "mode": "css",
        "prompt": "Pentru selectorul `.sample`, declară `background-position` cu valoarea `center`. Poziționează imaginea de fundal în zona disponibilă; center o centrează.",
        "solution": ".sample {\n  background-position: center;\n}",
        "fixture": "<div class=\"sample\">Demo Catalog</div>",
        "tests": [
          {
            "kind": "cssIncludes",
            "value": "background-position:center",
            "label": "Include în CSS construcția background-position:center."
          }
        ],
        "starter": "",
        "id": "exam-foundation-css-detail-background-position",
        "requirements": [
          "Include în CSS construcția `background-position:center`."
        ]
      }
    },
    {
      "id": "exam-foundation-css-detail-background-repeat",
      "title": "background-repeat",
      "category": "css",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "Citește declarația ca proprietate: valoare. Verificarea acestei lecții urmărește declarația cerută; layout-ul combinat este exersat în capitolul CSS și în proiect.",
      "steps": [
        "Controlează repetarea imaginii. no-repeat păstrează o singură instanță.",
        "Controlează repetarea imaginii. no-repeat păstrează o singură instanță. În regula CSS, selectorul alege elementul, iar perechea proprietate: valoare îi stabilește aspectul."
      ],
      "answer": "",
      "rubric": [
        "Pentru selectorul `.sample`, declară `background-repeat` cu valoarea `no-repeat`. Controlează repetarea imaginii. no-repeat păstrează o singură instanță.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "css-detail-background-repeat",
      "task": {
        "mode": "css",
        "prompt": "Pentru selectorul `.sample`, declară `background-repeat` cu valoarea `no-repeat`. Controlează repetarea imaginii. no-repeat păstrează o singură instanță.",
        "solution": ".sample {\n  background-repeat: no-repeat;\n}",
        "fixture": "<div class=\"sample\">Demo Catalog</div>",
        "tests": [
          {
            "kind": "cssIncludes",
            "value": "background-repeat:no-repeat",
            "label": "Include în CSS construcția background-repeat:no-repeat."
          }
        ],
        "starter": "",
        "id": "exam-foundation-css-detail-background-repeat",
        "requirements": [
          "Include în CSS construcția `background-repeat:no-repeat`."
        ]
      }
    },
    {
      "id": "exam-foundation-scss-compile",
      "title": "Browserul primește CSS",
      "category": "css",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "Sass este un preprocesor. Fișierul SCSS este compilat în CSS, iar pagina încarcă rezultatul CSS. Nu pune o adresă .scss ca stylesheet al browserului.",
      "steps": [
        "Browserul înțelege CSS. SCSS este un limbaj sursă care trebuie transformat în CSS.",
        "Compilatorul citește SCSS și produce declarațiile CSS finale.",
        "În laborator compilarea este automată; nu trebuie să instalezi Sass ca să începi."
      ],
      "answer": "",
      "rubric": [
        "Scrie SCSS pentru HTML-ul furnizat și obține stilurile descrise mai jos. Compilarea în CSS este făcută automat.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "scss-compile",
      "task": {
        "mode": "scss",
        "prompt": "Scrie SCSS pentru HTML-ul furnizat și obține stilurile descrise mai jos. Compilarea în CSS este făcută automat.",
        "solution": "$accent: navy;\n.card { color: $accent; }",
        "fixture": "<p class=\"card\">Cake</p>",
        "tests": [
          {
            "kind": "style",
            "selector": ".card",
            "name": "color",
            "value": "rgb(0, 0, 128)",
            "label": ".card: proprietatea color trebuie să aibă valoarea calculată rgb(0, 0, 128)."
          }
        ],
        "starter": "",
        "id": "exam-foundation-scss-compile",
        "requirements": [
          "`.card`: proprietatea `color` trebuie să aibă valoarea calculată `rgb(0, 0, 128)`."
        ]
      }
    },
    {
      "id": "exam-foundation-scss-variables",
      "title": "Variabile și domeniu",
      "category": "css",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "Variabilele Sass încep cu $. Sunt evaluate la compilare. Nu sunt aceleași cu proprietățile CSS --accent, care există în pagina randată.",
      "steps": [
        "Variabilele Sass încep cu $. Sunt evaluate la compilare. Nu sunt aceleași cu proprietățile CSS --accent, care există în pagina randată.",
        "Variabilele Sass încep cu $. Sunt evaluate la compilare. Nu sunt aceleași cu proprietățile CSS --accent, care există în pagina randată."
      ],
      "answer": "",
      "rubric": [
        "Scrie SCSS pentru HTML-ul furnizat și obține stilurile descrise mai jos. Compilarea în CSS este făcută automat.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "scss-variables",
      "task": {
        "mode": "scss",
        "prompt": "Scrie SCSS pentru HTML-ul furnizat și obține stilurile descrise mai jos. Compilarea în CSS este făcută automat.",
        "solution": "$space: 12px;\n.card { padding: $space; }",
        "fixture": "<div class=\"card\">Cake</div>",
        "tests": [
          {
            "kind": "style",
            "selector": ".card",
            "name": "padding-top",
            "value": "12px",
            "label": ".card: proprietatea padding-top trebuie să aibă valoarea calculată 12px."
          }
        ],
        "starter": "",
        "id": "exam-foundation-scss-variables",
        "requirements": [
          "`.card`: proprietatea `padding-top` trebuie să aibă valoarea calculată `12px`."
        ]
      }
    },
    {
      "id": "exam-foundation-scss-types",
      "title": "Tipuri, liste și unități",
      "category": "css",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "Sass lucrează cu numere cu unități, șiruri, culori, booleene, null, liste și hărți. Operațiile trebuie să aibă unități compatibile.",
      "steps": [
        "Sass lucrează cu numere cu unități, șiruri, culori, booleene, null, liste și hărți. Operațiile trebuie să aibă unități compatibile.",
        "Sass lucrează cu numere cu unități, șiruri, culori, booleene, null, liste și hărți. Operațiile trebuie să aibă unități compatibile."
      ],
      "answer": "",
      "rubric": [
        "Scrie SCSS pentru HTML-ul furnizat și obține stilurile descrise mai jos. Compilarea în CSS este făcută automat.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "scss-types",
      "task": {
        "mode": "scss",
        "prompt": "Scrie SCSS pentru HTML-ul furnizat și obține stilurile descrise mai jos. Compilarea în CSS este făcută automat.",
        "solution": "$base: 8px;\n.card { padding: $base * 2; }",
        "fixture": "<div class=\"card\">Cake</div>",
        "tests": [
          {
            "kind": "style",
            "selector": ".card",
            "name": "padding-top",
            "value": "16px",
            "label": ".card: proprietatea padding-top trebuie să aibă valoarea calculată 16px."
          }
        ],
        "starter": "",
        "id": "exam-foundation-scss-types",
        "requirements": [
          "`.card`: proprietatea `padding-top` trebuie să aibă valoarea calculată `16px`."
        ]
      }
    },
    {
      "id": "exam-foundation-scss-if",
      "title": "Condiții la compilare",
      "category": "css",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "@if și @else aleg codul CSS generat. Nu reacționează direct la un clic în browser; alegerea se face când compilezi.",
      "steps": [
        "@if și @else aleg codul CSS generat. Nu reacționează direct la un clic în browser; alegerea se face când compilezi.",
        "@if și @else aleg codul CSS generat. Nu reacționează direct la un clic în browser; alegerea se face când compilezi."
      ],
      "answer": "",
      "rubric": [
        "Scrie SCSS pentru HTML-ul furnizat și obține stilurile descrise mai jos. Compilarea în CSS este făcută automat.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "scss-if",
      "task": {
        "mode": "scss",
        "prompt": "Scrie SCSS pentru HTML-ul furnizat și obține stilurile descrise mai jos. Compilarea în CSS este făcută automat.",
        "solution": "$dark: true;\n.card { @if $dark { color: white; background: navy; } @else { color: black; } }",
        "fixture": "<div class=\"card\">Cake</div>",
        "tests": [
          {
            "kind": "style",
            "selector": ".card",
            "name": "color",
            "value": "rgb(255, 255, 255)",
            "label": ".card: proprietatea color trebuie să aibă valoarea calculată rgb(255, 255, 255)."
          },
          {
            "kind": "style",
            "selector": ".card",
            "name": "background-color",
            "value": "rgb(0, 0, 128)",
            "label": ".card: proprietatea background-color trebuie să aibă valoarea calculată rgb(0, 0, 128)."
          }
        ],
        "starter": "",
        "id": "exam-foundation-scss-if",
        "requirements": [
          "`.card`: proprietatea `color` trebuie să aibă valoarea calculată `rgb(255, 255, 255)`.",
          "`.card`: proprietatea `background-color` trebuie să aibă valoarea calculată `rgb(0, 0, 128)`."
        ]
      }
    },
    {
      "id": "exam-foundation-array-length",
      "title": "Ultimul element",
      "category": "client",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "Pentru un vector negol, ultimul indice este length minus 1. Un element lipsă ar produce undefined.",
      "steps": [
        "Un vector, numit Array în JavaScript, păstrează mai multe valori într-o ordine.",
        "Parantezele pătrate construiesc lista; [0] citește primul element.",
        "length este numărul de elemente. Ultimul indice al unei liste ne-goale este length - 1."
      ],
      "answer": "",
      "rubric": [
        "Returnează ultimul element al vectorului negol input.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "array-length",
      "task": {
        "mode": "js",
        "prompt": "Returnează ultimul element al vectorului negol input.",
        "solution": "function solve(input) {\n  return input[input.length - 1];\n}",
        "cases": [
          {
            "input": [
              2,
              9
            ],
            "expected": 9
          },
          {
            "input": [
              "Cake"
            ],
            "expected": "Cake"
          }
        ],
        "starter": "function solve(input) {\n  // Write your code here.\n}\n",
        "id": "exam-foundation-array-length",
        "requirements": []
      }
    },
    {
      "id": "exam-foundation-array-copy",
      "title": "Copiere și referințe",
      "category": "client",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "Folosim push doar pe copie. Testele verifică faptul că intrarea nu a fost modificată.",
      "steps": [
        "Atribuirea unui vector unei alte variabile nu îl copiază. [...input] creează o copie superficială; obiectele din interior rămân referințe partajate.",
        "Folosim push doar pe copie. Testele verifică faptul că intrarea nu a fost modificată."
      ],
      "answer": "",
      "rubric": [
        "Returnează o copie a vectorului input cu Tea adăugat la final, fără a schimba input.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "array-copy",
      "task": {
        "mode": "js",
        "prompt": "Returnează o copie a vectorului input cu Tea adăugat la final, fără a schimba input.",
        "solution": "function solve(input) {\n  const copy = [...input];\n  copy.push(\"Tea\");\n  return copy;\n}",
        "cases": [
          {
            "input": [
              "Cake"
            ],
            "expected": [
              "Cake",
              "Tea"
            ]
          },
          {
            "input": [],
            "expected": [
              "Tea"
            ]
          }
        ],
        "starter": "function solve(input) {\n  // Write your code here.\n}\n",
        "id": "exam-foundation-array-copy",
        "requirements": []
      }
    },
    {
      "id": "exam-foundation-array-push-pop",
      "title": "Adaugă și elimină la final",
      "category": "client",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "Nu modifica vectorul de intrare; fă întâi o copie.",
      "steps": [
        "push adaugă la final și returnează noua lungime. pop elimină și returnează ultimul element. Ambele modifică vectorul asupra căruia sunt apelate.",
        "Nu modifica vectorul de intrare; fă întâi o copie."
      ],
      "answer": "",
      "rubric": [
        "Returnează o copie a input fără ultimul element.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "array-push-pop",
      "task": {
        "mode": "js",
        "prompt": "Returnează o copie a input fără ultimul element.",
        "solution": "function solve(input) {\n  const copy = [...input];\n  copy.pop();\n  return copy;\n}",
        "cases": [
          {
            "input": [
              1,
              2,
              3
            ],
            "expected": [
              1,
              2
            ]
          },
          {
            "input": [
              1
            ],
            "expected": []
          },
          {
            "input": [],
            "expected": []
          }
        ],
        "starter": "function solve(input) {\n  // Write your code here.\n}\n",
        "id": "exam-foundation-array-push-pop",
        "requirements": []
      }
    },
    {
      "id": "exam-foundation-array-shift",
      "title": "Operații la început",
      "category": "client",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "Copia este un vector nou.",
      "steps": [
        "unshift adaugă la început; shift elimină de la început. Ca push și pop, modifică vectorul.",
        "Copia este un vector nou."
      ],
      "answer": "",
      "rubric": [
        "Returnează o copie cu Cake adăugat la început.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "array-shift",
      "task": {
        "mode": "js",
        "prompt": "Returnează o copie cu Cake adăugat la început.",
        "solution": "function solve(input) {\n  const copy = [...input];\n  copy.unshift(\"Cake\");\n  return copy;\n}",
        "cases": [
          {
            "input": [
              "Tea"
            ],
            "expected": [
              "Cake",
              "Tea"
            ]
          },
          {
            "input": [],
            "expected": [
              "Cake"
            ]
          }
        ],
        "starter": "function solve(input) {\n  // Write your code here.\n}\n",
        "id": "exam-foundation-array-shift",
        "requirements": []
      }
    },
    {
      "id": "exam-foundation-string-trim",
      "title": "Curăță spațiile de la capete",
      "category": "client",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "Nu trebuie să modifici caracterele dintre cuvinte.",
      "steps": [
        "Un șir este o valoare text între ghilimele.",
        "O metodă este o operație apelată cu punct și paranteze: text.trim().",
        "trim întoarce un text nou, fără spațiile de la început și sfârșit; interiorul rămâne intact."
      ],
      "answer": "",
      "rubric": [
        "Returnează input fără spații la capete.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "string-trim",
      "task": {
        "mode": "js",
        "prompt": "Returnează input fără spații la capete.",
        "solution": "function solve(input) {\n  return input.trim();\n}",
        "cases": [
          {
            "input": "  Cake  ",
            "expected": "Cake"
          },
          {
            "input": " Cake tea ",
            "expected": "Cake tea"
          },
          {
            "input": "",
            "expected": ""
          }
        ],
        "starter": "function solve(input) {\n  // Write your code here.\n}\n",
        "id": "exam-foundation-string-trim",
        "requirements": []
      }
    },
    {
      "id": "exam-foundation-string-case",
      "title": "Compară texte normalizate",
      "category": "client",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "Lanțul se citește de la stânga la dreapta.",
      "steps": [
        "toLowerCase și toUpperCase schimbă registrul literelor. Filtrele din proiect curăță spațiile și normalizează registrul înainte de comparație.",
        "Lanțul se citește de la stânga la dreapta."
      ],
      "answer": "",
      "rubric": [
        "Normalizează input prin trim și litere mici.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "string-case",
      "task": {
        "mode": "js",
        "prompt": "Normalizează input prin trim și litere mici.",
        "solution": "function solve(input) {\n  return input.trim().toLowerCase();\n}",
        "cases": [
          {
            "input": "  CAKE ",
            "expected": "cake"
          },
          {
            "input": "Tea",
            "expected": "tea"
          }
        ],
        "starter": "function solve(input) {\n  // Write your code here.\n}\n",
        "id": "exam-foundation-string-case",
        "requirements": []
      }
    },
    {
      "id": "exam-foundation-string-template",
      "title": "Template literals",
      "category": "client",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "Folosește numele proprietăților în expresiile ${...}.",
      "steps": [
        "Textele dintre backticks pot include expresii în ${...} și pot ocupa mai multe linii. Ghilimelele obișnuite nu interpretează această sintaxă.",
        "Folosește numele proprietăților în expresiile ${...}."
      ],
      "answer": "",
      "rubric": [
        "Formatează un produs ca Name: PRICE EUR.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "string-template",
      "task": {
        "mode": "js",
        "prompt": "Formatează un produs ca Name: PRICE EUR.",
        "solution": "function solve(input) {\n  return `${input.name}: ${input.price} EUR`;\n}",
        "cases": [
          {
            "input": {
              "name": "Cake",
              "price": 10
            },
            "expected": "Cake: 10 EUR"
          },
          {
            "input": {
              "name": "Tea",
              "price": 4
            },
            "expected": "Tea: 4 EUR"
          }
        ],
        "starter": "function solve(input) {\n  // Write your code here.\n}\n",
        "id": "exam-foundation-string-template",
        "requirements": []
      }
    },
    {
      "id": "exam-foundation-string-search",
      "title": "includes, startsWith și endsWith",
      "category": "client",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "Normalizează textul înainte de verificare.",
      "steps": [
        "includes caută oriunde; startsWith la început; endsWith la sfârșit. Metodele sunt sensibile la litere mari și mici.",
        "Normalizează textul înainte de verificare."
      ],
      "answer": "",
      "rubric": [
        "Returnează dacă input începe cu cake, ignorând registrul.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "string-search",
      "task": {
        "mode": "js",
        "prompt": "Returnează dacă input începe cu cake, ignorând registrul.",
        "solution": "function solve(input) {\n  return input.toLowerCase().startsWith(\"cake\");\n}",
        "cases": [
          {
            "input": "Cake box",
            "expected": true
          },
          {
            "input": "Fruit cake",
            "expected": false
          },
          {
            "input": "cake",
            "expected": true
          }
        ],
        "starter": "function solve(input) {\n  // Write your code here.\n}\n",
        "id": "exam-foundation-string-search",
        "requirements": []
      }
    },
    {
      "id": "exam-foundation-dom-select",
      "title": "Găsește un element",
      "category": "client",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "document reprezintă pagina. querySelector primește un selector CSS și întoarce primul element potrivit sau null. getElementById primește doar id-ul, fără #.",
      "steps": [
        "DOM este reprezentarea paginii HTML în memorie, accesibilă din JavaScript.",
        "document reprezintă pagina. querySelector primește un selector CSS.",
        "Rezultatul este primul element potrivit sau null dacă nu există; nu este textul HTML."
      ],
      "answer": "",
      "rubric": [
        "Găsește titlul cu id welcome și schimbă textul lui din Old title în Welcome. HTML-ul de pornire este furnizat.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "dom-select",
      "task": {
        "mode": "dom",
        "prompt": "Găsește titlul cu id welcome și schimbă textul lui din Old title în Welcome. HTML-ul de pornire este furnizat.",
        "solution": "const heading = document.querySelector(\"#welcome\");\nheading.textContent = \"Welcome\";",
        "fixture": "<h1 id=\"welcome\">Old title</h1>",
        "tests": [
          {
            "kind": "text",
            "selector": "#welcome",
            "value": "Welcome",
            "label": "#welcome: textul trebuie să fie Welcome."
          }
        ],
        "actions": [],
        "starter": "const heading = document.querySelector(\"#welcome\");\nheading.textContent = \"\";\n",
        "id": "exam-foundation-dom-select",
        "requirements": [
          "`#welcome`: textul trebuie să fie `Welcome`."
        ],
        "revision": 3
      }
    },
    {
      "id": "exam-foundation-dom-text",
      "title": "Text simplu și HTML",
      "category": "client",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "textContent inserează text. innerHTML interpretează markup. Pentru date pe care vrei să le afișezi ca text, textContent evită interpretarea lor ca taguri.",
      "steps": [
        "textContent inserează text. innerHTML interpretează markup. Pentru date pe care vrei să le afișezi ca text, textContent evită interpretarea lor ca taguri.",
        "textContent inserează text. innerHTML interpretează markup. Pentru date pe care vrei să le afișezi ca text, textContent evită interpretarea lor ca taguri."
      ],
      "answer": "",
      "rubric": [
        "Scrie JavaScript care modifică HTML-ul furnizat conform cerințelor de mai jos.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "dom-text",
      "task": {
        "mode": "dom",
        "prompt": "Scrie JavaScript care modifică HTML-ul furnizat conform cerințelor de mai jos.",
        "solution": "document.querySelector(\"#message\").textContent = \"<strong>Cake</strong>\";",
        "fixture": "<p id=\"message\"></p>",
        "tests": [
          {
            "kind": "text",
            "selector": "#message",
            "value": "<strong>Cake</strong>",
            "label": "#message: textul trebuie să fie <strong>Cake</strong>."
          },
          {
            "kind": "absent",
            "selector": "#message strong",
            "label": "Nu include elemente care corespund selectorului #message strong."
          }
        ],
        "actions": [],
        "starter": "",
        "id": "exam-foundation-dom-text",
        "requirements": [
          "`#message`: textul trebuie să fie `<strong>Cake</strong>`.",
          "Nu include elemente care corespund selectorului `#message strong`."
        ]
      }
    },
    {
      "id": "exam-foundation-dom-collection",
      "title": "Mai multe elemente",
      "category": "client",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "querySelectorAll întoarce o colecție NodeList. O poți parcurge cu for...of sau transforma cu Array.from. getElementsByClassName întoarce o colecție live, care se poate schimba odată cu DOM-ul.",
      "steps": [
        "querySelectorAll întoarce o colecție NodeList. O poți parcurge cu for...of sau transforma cu Array.from. getElementsByClassName întoarce o colecție live, care se poate schimba odată cu DOM-ul.",
        "querySelectorAll întoarce o colecție NodeList. O poți parcurge cu for...of sau transforma cu Array.from. getElementsByClassName întoarce o colecție live, care se poate schimba odată cu DOM-ul."
      ],
      "answer": "",
      "rubric": [
        "Scrie JavaScript care modifică HTML-ul furnizat conform cerințelor de mai jos.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "dom-collection",
      "task": {
        "mode": "dom",
        "prompt": "Scrie JavaScript care modifică HTML-ul furnizat conform cerințelor de mai jos.",
        "solution": "for (const card of document.querySelectorAll(\".product-card\")) {\n  card.classList.add(\"ready\");\n}",
        "fixture": "<article class=\"product-card\">Cake</article><article class=\"product-card\">Tea</article>",
        "tests": [
          {
            "kind": "count",
            "selector": ".product-card.ready",
            "min": 2,
            "label": "Include cel puțin 2 elemente care corespund selectorului .product-card.ready."
          }
        ],
        "actions": [],
        "starter": "",
        "id": "exam-foundation-dom-collection",
        "requirements": [
          "Include cel puțin 2 elemente care corespund selectorului `.product-card.ready`."
        ]
      }
    },
    {
      "id": "exam-foundation-dom-class",
      "title": "Adaugă și elimină clase",
      "category": "client",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "classList.add, remove și toggle modifică lista de clase fără să ștergi celelalte clase ale elementului. toggle întoarce dacă acea clasă este prezentă după operație.",
      "steps": [
        "classList.add, remove și toggle modifică lista de clase fără să ștergi celelalte clase ale elementului. toggle întoarce dacă acea clasă este prezentă după operație.",
        "classList.add, remove și toggle modifică lista de clase fără să ștergi celelalte clase ale elementului. toggle întoarce dacă acea clasă este prezentă după operație."
      ],
      "answer": "",
      "rubric": [
        "Scrie JavaScript care modifică HTML-ul furnizat conform cerințelor de mai jos.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "dom-class",
      "task": {
        "mode": "dom",
        "prompt": "Scrie JavaScript care modifică HTML-ul furnizat conform cerințelor de mai jos.",
        "solution": "const card = document.querySelector(\"#card\");\ncard.classList.remove(\"hidden\");\ncard.classList.add(\"active\");",
        "fixture": "<article id=\"card\" class=\"product-card hidden\">Cake</article>",
        "tests": [
          {
            "kind": "count",
            "selector": "#card.product-card.active",
            "min": 1,
            "label": "Include cel puțin 1 elemente care corespund selectorului #card.product-card.active."
          },
          {
            "kind": "absent",
            "selector": "#card.hidden",
            "label": "Nu include elemente care corespund selectorului #card.hidden."
          }
        ],
        "actions": [],
        "starter": "",
        "id": "exam-foundation-dom-class",
        "requirements": [
          "Include cel puțin 1 elemente care corespund selectorului `#card.product-card.active`.",
          "Nu include elemente care corespund selectorului `#card.hidden`."
        ]
      }
    },
    {
      "id": "exam-foundation-json-syntax",
      "title": "Un format pentru date",
      "category": "client",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "Numărul 10 nu are ghilimele. true este boolean. Un fișier JSON nu execută funcții.",
      "steps": [
        "JSON este un format text pentru date, nu un limbaj de instrucțiuni.",
        "Un obiect folosește acolade; fiecare pereche are o cheie între ghilimele duble, apoi două puncte și valoarea.",
        "Virgula separă perechile; nu pui virgulă după ultima pereche."
      ],
      "answer": "",
      "rubric": [
        "Scrie obiectul cu name Cake, price 10 și available true.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "json-syntax",
      "task": {
        "mode": "json",
        "prompt": "Scrie obiectul cu name Cake, price 10 și available true.",
        "solution": "{\"name\":\"Cake\",\"price\":10,\"available\":true}",
        "starter": "{\n  \n}",
        "expected": {
          "name": "Cake",
          "price": 10,
          "available": true
        },
        "id": "exam-foundation-json-syntax",
        "requirements": []
      }
    },
    {
      "id": "exam-foundation-json-parse",
      "title": "De la text la obiect",
      "category": "client",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "JSON.parse interpretează textul JSON. Dacă textul este invalid, aruncă SyntaxError; nu presupune că un text cu aspect de obiect este deja un obiect.",
      "steps": [
        "JSON.parse interpretează textul JSON. Dacă textul este invalid, aruncă SyntaxError; nu presupune că un text cu aspect de obiect este deja un obiect.",
        "JSON.parse interpretează textul JSON. Dacă textul este invalid, aruncă SyntaxError; nu presupune că un text cu aspect de obiect este deja un obiect."
      ],
      "answer": "",
      "rubric": [
        "Parsează input și returnează proprietatea name.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "json-parse",
      "task": {
        "mode": "js",
        "prompt": "Parsează input și returnează proprietatea name.",
        "solution": "function solve(input) { return JSON.parse(input).name; }",
        "cases": [
          {
            "input": "{\"name\":\"Cake\"}",
            "expected": "Cake"
          },
          {
            "input": "{\"name\":\"Tea\"}",
            "expected": "Tea"
          }
        ],
        "starter": "function solve(input) {\n  // Write your code here.\n}\n",
        "id": "exam-foundation-json-parse",
        "requirements": []
      }
    },
    {
      "id": "exam-foundation-json-stringify",
      "title": "De la obiect la text",
      "category": "client",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "JSON.stringify produce un șir. Funcții și undefined au reguli speciale de omitere sau înlocuire, iar referințele circulare nu pot fi serializate direct.",
      "steps": [
        "JSON.stringify produce un șir. Funcții și undefined au reguli speciale de omitere sau înlocuire, iar referințele circulare nu pot fi serializate direct.",
        "JSON.stringify produce un șir. Funcții și undefined au reguli speciale de omitere sau înlocuire, iar referințele circulare nu pot fi serializate direct."
      ],
      "answer": "",
      "rubric": [
        "Returnează JSON.stringify(input).",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "json-stringify",
      "task": {
        "mode": "js",
        "prompt": "Returnează JSON.stringify(input).",
        "solution": "function solve(input) { return JSON.stringify(input); }",
        "cases": [
          {
            "input": {
              "name": "Cake"
            },
            "expected": "{\"name\":\"Cake\"}"
          },
          {
            "input": [
              1,
              2
            ],
            "expected": "[1,2]"
          }
        ],
        "starter": "function solve(input) {\n  // Write your code here.\n}\n",
        "id": "exam-foundation-json-stringify",
        "requirements": []
      }
    },
    {
      "id": "exam-foundation-json-nested",
      "title": "Obiecte și vectori imbricați",
      "category": "client",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "O galerie poate conține un vector de imagini în interiorul unui obiect. După parsare accesezi proprietățile și indicii obișnuiți.",
      "steps": [
        "O galerie poate conține un vector de imagini în interiorul unui obiect. După parsare accesezi proprietățile și indicii obișnuiți.",
        "O galerie poate conține un vector de imagini în interiorul unui obiect. După parsare accesezi proprietățile și indicii obișnuiți."
      ],
      "answer": "",
      "rubric": [
        "Returnează numele fișierelor din images, după parsarea textului input.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "json-nested",
      "task": {
        "mode": "js",
        "prompt": "Returnează numele fișierelor din images, după parsarea textului input.",
        "solution": "function solve(input) { const gallery = JSON.parse(input); return gallery.images.map(image => image.file); }",
        "cases": [
          {
            "input": "{\"images\":[{\"file\":\"cake.webp\"},{\"file\":\"tea.webp\"}]}",
            "expected": [
              "cake.webp",
              "tea.webp"
            ]
          },
          {
            "input": "{\"images\":[]}",
            "expected": []
          }
        ],
        "starter": "function solve(input) {\n  // Write your code here.\n}\n",
        "id": "exam-foundation-json-nested",
        "requirements": []
      }
    },
    {
      "id": "exam-foundation-storage-model",
      "title": "localStorage păstrează texte",
      "category": "client",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "În laboratorul DOM izolat nu folosim stocarea personală a browserului. Exersăm formatul de date prin funcții, apoi legăm localStorage în proiectul real.",
      "steps": [
        "localStorage este un spațiu de stocare al site-ului în browser.",
        "O cheie este numele sub care salvezi o valoare. Cheile și valorile sunt texte.",
        "Pentru obiecte și liste se folosește transformarea în JSON, explicată în capitolul dedicat."
      ],
      "answer": "",
      "rubric": [
        "Returnează textul JSON pentru input.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "storage-model",
      "task": {
        "mode": "js",
        "prompt": "Returnează textul JSON pentru input.",
        "solution": "function solve(input) { return JSON.stringify(input); }",
        "cases": [
          {
            "input": {
              "theme": "dark"
            },
            "expected": "{\"theme\":\"dark\"}"
          },
          {
            "input": [],
            "expected": "[]"
          }
        ],
        "starter": "function solve(input) {\n  // Write your code here.\n}\n",
        "id": "exam-foundation-storage-model",
        "requirements": []
      }
    },
    {
      "id": "exam-foundation-storage-restore",
      "title": "Restaurează o valoare opțională",
      "category": "client",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "O salvare veche poate avea alt format. În proiect verificăm tipul și revenim la un coș gol dacă textul nu poate fi parsată.",
      "steps": [
        "getItem poate întoarce null când cheia lipsește. Folosește un fallback și tratează JSON corupt când datele provin dintr-o salvare anterioară.",
        "O salvare veche poate avea alt format. În proiect verificăm tipul și revenim la un coș gol dacă textul nu poate fi parsată."
      ],
      "answer": "",
      "rubric": [
        "Primești text JSON sau null. Returnează vectorul parsată; pentru null, JSON invalid ori alt tip returnează [].",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "storage-restore",
      "task": {
        "mode": "js",
        "prompt": "Primești text JSON sau null. Returnează vectorul parsată; pentru null, JSON invalid ori alt tip returnează [].",
        "solution": "function solve(input) { try { const value = input ? JSON.parse(input) : []; return Array.isArray(value) ? value : []; } catch { return []; } }",
        "cases": [
          {
            "input": null,
            "expected": []
          },
          {
            "input": "[1,2]",
            "expected": [
              1,
              2
            ]
          },
          {
            "input": "{bad}",
            "expected": []
          },
          {
            "input": "{}",
            "expected": []
          }
        ],
        "starter": "function solve(input) {\n  // Write your code here.\n}\n",
        "id": "exam-foundation-storage-restore",
        "requirements": []
      }
    },
    {
      "id": "exam-foundation-cart-add",
      "title": "Adaugă fără duplicate",
      "category": "client",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "În exercițiu lucrăm pe o copie; în site salvăm apoi rezultatul în localStorage.",
      "steps": [
        "Coșul din exemplu păstrează identificatori de produse. Un checkbox bifat adaugă un id; repetarea aceleiași selecții nu trebuie să dubleze produsul.",
        "În exercițiu lucrăm pe o copie; în site salvăm apoi rezultatul în localStorage."
      ],
      "answer": "",
      "rubric": [
        "Primești {cart, id}. Returnează o copie cu id adăugat dacă lipsește.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "cart-add",
      "task": {
        "mode": "js",
        "prompt": "Primești {cart, id}. Returnează o copie cu id adăugat dacă lipsește.",
        "solution": "function solve(input) { return input.cart.includes(input.id) ? [...input.cart] : [...input.cart, input.id]; }",
        "cases": [
          {
            "input": {
              "cart": [
                "1"
              ],
              "id": "2"
            },
            "expected": [
              "1",
              "2"
            ]
          },
          {
            "input": {
              "cart": [
                "1"
              ],
              "id": "1"
            },
            "expected": [
              "1"
            ]
          }
        ],
        "starter": "function solve(input) {\n  // Write your code here.\n}\n",
        "id": "exam-foundation-cart-add",
        "requirements": []
      }
    },
    {
      "id": "exam-foundation-cart-remove",
      "title": "Elimină produsul debifat",
      "category": "client",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "Sortarea vizuală a produselor nu schimbă identitatea lor. Folosește id-uri stabile.",
      "steps": [
        "La debifare eliminăm id-ul corespunzător, nu ultimul produs din coș. filter produce simplu o listă fără acel id.",
        "Sortarea vizuală a produselor nu schimbă identitatea lor. Folosește id-uri stabile."
      ],
      "answer": "",
      "rubric": [
        "Primești {cart, id}. Returnează coșul fără id.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "cart-remove",
      "task": {
        "mode": "js",
        "prompt": "Primești {cart, id}. Returnează coșul fără id.",
        "solution": "function solve(input) { return input.cart.filter(id => id !== input.id); }",
        "cases": [
          {
            "input": {
              "cart": [
                "1",
                "2"
              ],
              "id": "1"
            },
            "expected": [
              "2"
            ]
          },
          {
            "input": {
              "cart": [],
              "id": "1"
            },
            "expected": []
          }
        ],
        "starter": "function solve(input) {\n  // Write your code here.\n}\n",
        "id": "exam-foundation-cart-remove",
        "requirements": []
      }
    },
    {
      "id": "exam-foundation-node-package",
      "title": "Manifestul proiectului",
      "category": "server",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "Manifestul proiectului final folosește CommonJS pentru a rămâne apropiat de site-ul pe care îl construim.",
      "steps": [
        "package.json este JSON valid și poate conține name, version, scripts și dependencies. CommonJS folosește require și module.exports; modulele ES folosesc import și export.",
        "Manifestul proiectului final folosește CommonJS pentru a rămâne apropiat de site-ul pe care îl construim."
      ],
      "answer": "",
      "rubric": [
        "Scrie un manifest cu name sweet-corner și scripts.start node app.js.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "node-package",
      "task": {
        "mode": "json",
        "prompt": "Scrie un manifest cu name sweet-corner și scripts.start node app.js.",
        "solution": "{\"name\":\"sweet-corner\",\"scripts\":{\"start\":\"node app.js\"}}",
        "starter": "{}",
        "expected": {
          "name": "sweet-corner",
          "scripts": {
            "start": "node app.js"
          }
        },
        "id": "exam-foundation-node-package",
        "requirements": []
      }
    },
    {
      "id": "exam-foundation-node-require",
      "title": "Încarcă un modul",
      "category": "server",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "require încarcă un modul CommonJS. Module precum path sunt incluse în Node; Express este un pachet separat. Numele modulului este text.",
      "steps": [
        "require încarcă un modul CommonJS. Module precum path sunt incluse în Node; Express este un pachet separat. Numele modulului este text.",
        "require încarcă un modul CommonJS. Module precum path sunt incluse în Node; Express este un pachet separat. Numele modulului este text."
      ],
      "answer": "",
      "rubric": [
        "Folosește path.extname pentru extensia căii input.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "node-require",
      "task": {
        "mode": "node",
        "prompt": "Folosește path.extname pentru extensia căii input.",
        "solution": "const path = require(\"path\");\nfunction solve(input) { return path.extname(input); }",
        "cases": [
          {
            "input": "image.webp",
            "expected": ".webp"
          },
          {
            "input": "app.js",
            "expected": ".js"
          },
          {
            "input": "README",
            "expected": ""
          }
        ],
        "starter": "function solve(input) {\n  // Write your code here.\n}\n",
        "files": {},
        "id": "exam-foundation-node-require",
        "requirements": []
      }
    },
    {
      "id": "exam-foundation-node-join",
      "title": "Compune o cale",
      "category": "server",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "path.join compune segmente și normalizează separatori. O cale de pe disc nu este automat un URL. În laborator folosim path POSIX și rădăcina virtuală /project pentru rezultate stabile.",
      "steps": [
        "path.join compune segmente și normalizează separatori. O cale de pe disc nu este automat un URL. În laborator folosim path POSIX și rădăcina virtuală /project pentru rezultate stabile.",
        "path.join compune segmente și normalizează separatori. O cale de pe disc nu este automat un URL. În laborator folosim path POSIX și rădăcina virtuală /project pentru rezultate stabile."
      ],
      "answer": "",
      "rubric": [
        "Returnează calea /project/public plus segmentul input.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "node-join",
      "task": {
        "mode": "node",
        "prompt": "Returnează calea /project/public plus segmentul input.",
        "solution": "const path = require(\"path\");\nfunction solve(input) { return path.join(\"/project\", \"public\", input); }",
        "cases": [
          {
            "input": "cake.svg",
            "expected": "/project/public/cake.svg"
          },
          {
            "input": "css/site.css",
            "expected": "/project/public/css/site.css"
          }
        ],
        "starter": "function solve(input) {\n  // Write your code here.\n}\n",
        "files": {},
        "id": "exam-foundation-node-join",
        "requirements": []
      }
    },
    {
      "id": "exam-foundation-node-basename",
      "title": "Nume, extensie și director",
      "category": "server",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "path.basename extrage ultima componentă, dirname directorul, extname extensia. path.parse oferă aceste componente într-un obiect.",
      "steps": [
        "path.basename extrage ultima componentă, dirname directorul, extname extensia. path.parse oferă aceste componente într-un obiect.",
        "path.basename extrage ultima componentă, dirname directorul, extname extensia. path.parse oferă aceste componente într-un obiect."
      ],
      "answer": "",
      "rubric": [
        "Returnează name, extension și folder pentru calea input.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "node-basename",
      "task": {
        "mode": "node",
        "prompt": "Returnează name, extension și folder pentru calea input.",
        "solution": "const path = require(\"path\");\nfunction solve(input) { return { name: path.basename(input), extension: path.extname(input), folder: path.dirname(input) }; }",
        "cases": [
          {
            "input": "/project/images/cake.webp",
            "expected": {
              "name": "cake.webp",
              "extension": ".webp",
              "folder": "/project/images"
            }
          }
        ],
        "starter": "function solve(input) {\n  // Write your code here.\n}\n",
        "files": {},
        "id": "exam-foundation-node-basename",
        "requirements": []
      }
    },
    {
      "id": "exam-foundation-node-path-parse",
      "title": "Descompune o cale",
      "category": "server",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "path.parse desparte o cale în root,dir,base,ext,name fără a citi fișierul.",
      "steps": [
        "O cale descrie locul unei resurse; nu garantează că resursa există.",
        "path.parse desparte calea în părți: director, nume și extensie.",
        "Laboratorul folosește căi POSIX pentru rezultate stabile; nu îți citește fișierele personale."
      ],
      "answer": "",
      "rubric": [
        "Primești o cale POSIX. Returnează name fără extensie, ext și dir folosind path.parse.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "node-path-parse",
      "task": {
        "mode": "node",
        "prompt": "Primești o cale POSIX. Returnează name fără extensie, ext și dir folosind path.parse.",
        "solution": "const path=require(\"path\"); function solve(input){const value=path.parse(input);return {name:value.name,ext:value.ext,dir:value.dir};}",
        "cases": [
          {
            "input": "/project/images/cake.webp",
            "expected": {
              "name": "cake",
              "ext": ".webp",
              "dir": "/project/images"
            }
          }
        ],
        "starter": "function solve(input) {\n  // Write your code here.\n}\n",
        "files": {},
        "id": "exam-foundation-node-path-parse",
        "requirements": []
      }
    },
    {
      "id": "exam-foundation-node-path-absolute",
      "title": "Cale absolută sau relativă",
      "category": "server",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "path.isAbsolute verifică forma căii, nu existența resursei.",
      "steps": [
        "path.isAbsolute verifică forma căii, nu existența resursei.",
        "path.isAbsolute verifică forma căii, nu existența resursei."
      ],
      "answer": "",
      "rubric": [
        "Returnează dacă input este o cale POSIX absolută.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "node-path-absolute",
      "task": {
        "mode": "node",
        "prompt": "Returnează dacă input este o cale POSIX absolută.",
        "solution": "const path=require(\"path\"); function solve(input){return path.isAbsolute(input);}",
        "cases": [
          {
            "input": "/project/cake.svg",
            "expected": true
          },
          {
            "input": "images/cake.svg",
            "expected": false
          }
        ],
        "starter": "function solve(input) {\n  // Write your code here.\n}\n",
        "files": {},
        "id": "exam-foundation-node-path-absolute",
        "requirements": []
      }
    },
    {
      "id": "exam-foundation-node-path-separator",
      "title": "Separatorul căii",
      "category": "server",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "path.sep este separatorul platformei; laboratorul folosește path.posix pentru rezultate deterministe.",
      "steps": [
        "path.sep este separatorul platformei; laboratorul folosește path.posix pentru rezultate deterministe.",
        "path.sep este separatorul platformei; laboratorul folosește path.posix pentru rezultate deterministe."
      ],
      "answer": "",
      "rubric": [
        "Returnează path.sep pentru modulul POSIX furnizat.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "node-path-separator",
      "task": {
        "mode": "node",
        "prompt": "Returnează path.sep pentru modulul POSIX furnizat.",
        "solution": "const path=require(\"path\"); function solve(input){return path.sep;} ",
        "cases": [
          {
            "input": null,
            "expected": "/"
          }
        ],
        "starter": "function solve(input) {\n  // Write your code here.\n}\n",
        "files": {},
        "id": "exam-foundation-node-path-separator",
        "requirements": []
      }
    },
    {
      "id": "exam-foundation-node-copy-file",
      "title": "Copiază înainte de înlocuire",
      "category": "server",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "copyFileSync copiază conținutul sursei în destinație. În acest laborator ambele fișiere sunt virtuale.",
      "steps": [
        "copyFileSync copiază conținutul sursei în destinație. În acest laborator ambele fișiere sunt virtuale.",
        "copyFileSync copiază conținutul sursei în destinație. În acest laborator ambele fișiere sunt virtuale."
      ],
      "answer": "",
      "rubric": [
        "Copiază source.txt în backup.txt și returnează conținutul copiei.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "node-copy-file",
      "task": {
        "mode": "node",
        "prompt": "Copiază source.txt în backup.txt și returnează conținutul copiei.",
        "solution": "const fs=require(\"fs\"); function solve(input){fs.copyFileSync(\"source.txt\",\"backup.txt\");return fs.readFileSync(\"backup.txt\",\"utf8\");}",
        "cases": [
          {
            "input": null,
            "expected": "Original"
          }
        ],
        "starter": "function solve(input) {\n  // Write your code here.\n}\n",
        "files": {
          "source.txt": "Original"
        },
        "id": "exam-foundation-node-copy-file",
        "requirements": []
      }
    },
    {
      "id": "exam-foundation-express-first",
      "title": "Prima aplicație Express",
      "category": "server",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "express() creează aplicația. app.get asociază o cale și o funcție pentru cereri GET. Exportăm app în laborator; app.listen apare în fișierul de pornire al proiectului.",
      "steps": [
        "require(\"express\") încarcă biblioteca; express() creează aplicația.",
        "app.get asociază o adresă cu o funcție. req reprezintă cererea, res răspunsul.",
        "res.send trimite textul. În laborator exportăm app; verificarea trimite cererile fără app.listen."
      ],
      "answer": "",
      "rubric": [
        "Construiește rutele care răspund cererilor de mai jos. Exportă aplicația cu `module.exports = app`; nu apela `app.listen`.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "express-first",
      "task": {
        "mode": "express",
        "prompt": "Construiește rutele care răspund cererilor de mai jos. Exportă aplicația cu `module.exports = app`; nu apela `app.listen`.",
        "solution": "const express = require(\"express\");\nconst app = express();\n\napp.get(\"/hello\", (req, res) => { res.send(\"Hello\"); });\nmodule.exports = app;",
        "requests": [
          {
            "path": "/hello",
            "bodyExpected": "Hello"
          }
        ],
        "starter": "const express = require(\"express\");\nconst app = express();\n\n// Add your routes here.\n\nmodule.exports = app;\n",
        "id": "exam-foundation-express-first",
        "requirements": []
      }
    },
    {
      "id": "exam-foundation-express-method",
      "title": "Metoda HTTP contează",
      "category": "server",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "GET și POST pe aceeași cale pot avea handlers diferite. Faptul că există GET /message nu înseamnă că orice metodă pe /message este tratată.",
      "steps": [
        "GET și POST pe aceeași cale pot avea handlers diferite. Faptul că există GET /message nu înseamnă că orice metodă pe /message este tratată.",
        "GET și POST pe aceeași cale pot avea handlers diferite. Faptul că există GET /message nu înseamnă că orice metodă pe /message este tratată."
      ],
      "answer": "",
      "rubric": [
        "Construiește rutele care răspund cererilor de mai jos. Exportă aplicația cu `module.exports = app`; nu apela `app.listen`.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "express-method",
      "task": {
        "mode": "express",
        "prompt": "Construiește rutele care răspund cererilor de mai jos. Exportă aplicația cu `module.exports = app`; nu apela `app.listen`.",
        "solution": "const express = require(\"express\");\nconst app = express();\n\napp.get(\"/message\", (req, res) => res.send(\"Read\"));\napp.post(\"/message\", (req, res) => res.send(\"Write\"));\nmodule.exports = app;",
        "requests": [
          {
            "path": "/message",
            "bodyExpected": "Read"
          },
          {
            "path": "/message",
            "method": "POST",
            "bodyExpected": "Write"
          }
        ],
        "starter": "const express = require(\"express\");\nconst app = express();\n\n// Add your routes here.\n\nmodule.exports = app;\n",
        "id": "exam-foundation-express-method",
        "requirements": []
      }
    },
    {
      "id": "exam-foundation-express-json",
      "title": "Răspuns JSON",
      "category": "server",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "res.json serializează datele și setează tipul de conținut potrivit. res.send poate trimite text sau HTML. Nu construi manual JSON prin concatenarea textelor.",
      "steps": [
        "res.json serializează datele și setează tipul de conținut potrivit. res.send poate trimite text sau HTML. Nu construi manual JSON prin concatenarea textelor.",
        "res.json serializează datele și setează tipul de conținut potrivit. res.send poate trimite text sau HTML. Nu construi manual JSON prin concatenarea textelor."
      ],
      "answer": "",
      "rubric": [
        "Construiește rutele care răspund cererilor de mai jos. Exportă aplicația cu `module.exports = app`; nu apela `app.listen`.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "express-json",
      "task": {
        "mode": "express",
        "prompt": "Construiește rutele care răspund cererilor de mai jos. Exportă aplicația cu `module.exports = app`; nu apela `app.listen`.",
        "solution": "const express = require(\"express\");\nconst app = express();\n\napp.get(\"/status\", (req, res) => res.json({ ready: true }));\nmodule.exports = app;",
        "requests": [
          {
            "path": "/status",
            "json": {
              "ready": true
            }
          }
        ],
        "starter": "const express = require(\"express\");\nconst app = express();\n\n// Add your routes here.\n\nmodule.exports = app;\n",
        "id": "exam-foundation-express-json",
        "requirements": []
      }
    },
    {
      "id": "exam-foundation-express-status",
      "title": "Coduri HTTP",
      "category": "server",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "200 indică succes, 400 o cerere invalidă, 403 interdicție, 404 resursă lipsă, iar 500 o eroare a serverului. Codul și mesajul sunt lucruri separate.",
      "steps": [
        "200 indică succes, 400 o cerere invalidă, 403 interdicție, 404 resursă lipsă, iar 500 o eroare a serverului. Codul și mesajul sunt lucruri separate.",
        "200 indică succes, 400 o cerere invalidă, 403 interdicție, 404 resursă lipsă, iar 500 o eroare a serverului. Codul și mesajul sunt lucruri separate."
      ],
      "answer": "",
      "rubric": [
        "Construiește rutele care răspund cererilor de mai jos. Exportă aplicația cu `module.exports = app`; nu apela `app.listen`.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "express-status",
      "task": {
        "mode": "express",
        "prompt": "Construiește rutele care răspund cererilor de mai jos. Exportă aplicația cu `module.exports = app`; nu apela `app.listen`.",
        "solution": "const express = require(\"express\");\nconst app = express();\n\napp.get(\"/missing\", (req, res) => res.status(404).send(\"Not found\"));\nmodule.exports = app;",
        "requests": [
          {
            "path": "/missing",
            "status": 404,
            "bodyExpected": "Not found"
          }
        ],
        "starter": "const express = require(\"express\");\nconst app = express();\n\n// Add your routes here.\n\nmodule.exports = app;\n",
        "id": "exam-foundation-express-status",
        "requirements": []
      }
    },
    {
      "id": "exam-foundation-http-put",
      "title": "Metoda PUT",
      "category": "server",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "PUT și GET sunt metode distincte chiar dacă folosesc aceeași cale.",
      "steps": [
        "Metoda HTTP arată operația cerută, iar calea arată resursa.",
        "app.put tratează metoda PUT pentru calea indicată.",
        "Funcția rutei produce răspunsul; o rută GET pe aceeași cale nu o înlocuiește."
      ],
      "answer": "",
      "rubric": [
        "Răspunde la PUT /product/1 cu textul Updated.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "http-put",
      "task": {
        "mode": "express",
        "prompt": "Răspunde la PUT /product/1 cu textul Updated.",
        "solution": "const express=require(\"express\");\nconst app=express();\napp.put(\"/product/1\",(req,res)=>res.send(\"Updated\"));\nmodule.exports=app;",
        "requests": [
          {
            "path": "/product/1",
            "method": "PUT",
            "bodyExpected": "Updated"
          }
        ],
        "starter": "const express = require(\"express\");\nconst app = express();\n\n// Add your routes here.\n\nmodule.exports = app;\n",
        "id": "exam-foundation-http-put",
        "requirements": []
      }
    },
    {
      "id": "exam-foundation-http-delete",
      "title": "Metoda DELETE",
      "category": "server",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "DELETE poate reprezenta eliminarea unei resurse; statusul și corpul răspunsului sunt alese explicit.",
      "steps": [
        "DELETE poate reprezenta eliminarea unei resurse; statusul și corpul răspunsului sunt alese explicit.",
        "DELETE poate reprezenta eliminarea unei resurse; statusul și corpul răspunsului sunt alese explicit."
      ],
      "answer": "",
      "rubric": [
        "Răspunde la DELETE /product/1 cu status 204 și fără corp.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "http-delete",
      "task": {
        "mode": "express",
        "prompt": "Răspunde la DELETE /product/1 cu status 204 și fără corp.",
        "solution": "const express=require(\"express\");\nconst app=express();\napp.delete(\"/product/1\",(req,res)=>res.status(204).end());\nmodule.exports=app;",
        "requests": [
          {
            "path": "/product/1",
            "method": "DELETE",
            "status": 204,
            "bodyExpected": ""
          }
        ],
        "starter": "const express = require(\"express\");\nconst app = express();\n\n// Add your routes here.\n\nmodule.exports = app;\n",
        "id": "exam-foundation-http-delete",
        "requirements": []
      }
    },
    {
      "id": "exam-foundation-http-multiple-paths",
      "title": "Mai multe căi pentru aceeași pagină",
      "category": "server",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "Un vector de căi poate trimite mai multe adrese către același handler.",
      "steps": [
        "Un vector de căi poate trimite mai multe adrese către același handler.",
        "Un vector de căi poate trimite mai multe adrese către același handler."
      ],
      "answer": "",
      "rubric": [
        "Folosește un singur app.get cu vector de căi pentru /, /home și /index; toate răspund Home.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "http-multiple-paths",
      "task": {
        "mode": "express",
        "prompt": "Folosește un singur app.get cu vector de căi pentru /, /home și /index; toate răspund Home.",
        "solution": "const express=require(\"express\");\nconst app=express();\napp.get([\"/\",\"/home\",\"/index\"],(req,res)=>res.send(\"Home\"));\nmodule.exports=app;",
        "requests": [
          {
            "path": "/",
            "bodyExpected": "Home"
          },
          {
            "path": "/home",
            "bodyExpected": "Home"
          },
          {
            "path": "/index",
            "bodyExpected": "Home"
          }
        ],
        "starter": "const express = require(\"express\");\nconst app = express();\n\n// Add your routes here.\n\nmodule.exports = app;\n",
        "id": "exam-foundation-http-multiple-paths",
        "requirements": []
      }
    },
    {
      "id": "exam-foundation-http-regex-path",
      "title": "Potrivire cu expresie regulată",
      "category": "server",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "O expresie regulată poate selecta căi. Nu o confunda cu sintaxa unui șir de rută, care depinde de versiunea Express.",
      "steps": [
        "O expresie regulată poate selecta căi. Nu o confunda cu sintaxa unui șir de rută, care depinde de versiunea Express.",
        "O expresie regulată poate selecta căi. Nu o confunda cu sintaxa unui șir de rută, care depinde de versiunea Express."
      ],
      "answer": "",
      "rubric": [
        "Acceptă printr-o rută RegExp /item/ urmat numai de cifre. Răspunde Item; pentru orice altă cale, 404 Not found.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "http-regex-path",
      "task": {
        "mode": "express",
        "prompt": "Acceptă printr-o rută RegExp /item/ urmat numai de cifre. Răspunde Item; pentru orice altă cale, 404 Not found.",
        "solution": "const express=require(\"express\");\nconst app=express();\napp.get(/^\\/item\\/[0-9]+$/,(req,res)=>res.send(\"Item\")); app.use((req,res)=>res.status(404).send(\"Not found\"));\nmodule.exports=app;",
        "requests": [
          {
            "path": "/item/12",
            "bodyExpected": "Item"
          },
          {
            "path": "/item/abc",
            "status": 404,
            "bodyExpected": "Not found"
          }
        ],
        "starter": "const express = require(\"express\");\nconst app = express();\n\n// Add your routes here.\n\nmodule.exports = app;\n",
        "id": "exam-foundation-http-regex-path",
        "requirements": []
      }
    },
    {
      "id": "exam-foundation-ejs-output",
      "title": "Afișează o variabilă",
      "category": "server",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "EJS este un motor de template. <%= ... %> inserează o valoare cu escapare HTML. res.render primește numele template-ului și obiectul de date.",
      "steps": [
        "EJS este un motor de template. <%= ... %> inserează o valoare cu escapare HTML. res.render primește numele template-ului și obiectul de date.",
        "EJS este un motor de template. <%= ... %> inserează o valoare cu escapare HTML. res.render primește numele template-ului și obiectul de date."
      ],
      "answer": "",
      "rubric": [
        "Construiește un template EJS care folosește datele furnizate și produce elementele descrise mai jos.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "ejs-output",
      "task": {
        "mode": "ejs",
        "prompt": "Construiește un template EJS care folosește datele furnizate și produce elementele descrise mai jos.",
        "solution": "<h1><%= title %></h1>",
        "data": {
          "title": "Demo Catalog"
        },
        "tests": [
          {
            "kind": "text",
            "selector": "h1",
            "value": "Demo Catalog",
            "label": "h1: textul trebuie să fie Demo Catalog."
          }
        ],
        "starter": "<h1></h1>",
        "partials": {},
        "id": "exam-foundation-ejs-output",
        "requirements": [
          "`h1`: textul trebuie să fie `Demo Catalog`."
        ],
        "inputData": {
          "title": "Demo Catalog"
        }
      }
    },
    {
      "id": "exam-foundation-ejs-escape",
      "title": "Escapare și conținut HTML",
      "category": "server",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "O valoare care conține <strong> nu trebuie interpretată automat ca markup dacă o afișezi ca text. <%- ... %> produce conținut neescapat și se folosește doar când știi exact ce generezi.",
      "steps": [
        "O valoare care conține <strong> nu trebuie interpretată automat ca markup dacă o afișezi ca text. <%- ... %> produce conținut neescapat și se folosește doar când știi exact ce generezi.",
        "O valoare care conține <strong> nu trebuie interpretată automat ca markup dacă o afișezi ca text. <%- ... %> produce conținut neescapat și se folosește doar când știi exact ce generezi."
      ],
      "answer": "",
      "rubric": [
        "Construiește un template EJS care folosește datele furnizate și produce elementele descrise mai jos.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "ejs-escape",
      "task": {
        "mode": "ejs",
        "prompt": "Construiește un template EJS care folosește datele furnizate și produce elementele descrise mai jos.",
        "solution": "<p><%= message %></p>",
        "data": {
          "message": "<strong>Cake</strong>"
        },
        "tests": [
          {
            "kind": "text",
            "selector": "p",
            "value": "<strong>Cake</strong>",
            "label": "p: textul trebuie să fie <strong>Cake</strong>."
          },
          {
            "kind": "absent",
            "selector": "p strong",
            "label": "Nu include elemente care corespund selectorului p strong."
          }
        ],
        "starter": "",
        "partials": {},
        "id": "exam-foundation-ejs-escape",
        "requirements": [
          "`p`: textul trebuie să fie `<strong>Cake</strong>`.",
          "Nu include elemente care corespund selectorului `p strong`."
        ],
        "inputData": {
          "message": "<strong>Cake</strong>"
        }
      }
    },
    {
      "id": "exam-foundation-ejs-conditions",
      "title": "HTML condiționat",
      "category": "server",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "<% ... %> execută instrucțiuni fără să le afișeze direct. Poți deschide un if, produce HTML și închide blocul mai târziu.",
      "steps": [
        "<% ... %> execută instrucțiuni fără să le afișeze direct. Poți deschide un if, produce HTML și închide blocul mai târziu.",
        "<% ... %> execută instrucțiuni fără să le afișeze direct. Poți deschide un if, produce HTML și închide blocul mai târziu."
      ],
      "answer": "",
      "rubric": [
        "Afișează Available când available este true și Sold out când este false. Sunt verificate ambele situații.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "ejs-conditions",
      "task": {
        "mode": "ejs",
        "prompt": "Afișează Available când available este true și Sold out când este false. Sunt verificate ambele situații.",
        "solution": "<% if (available) { %><p>Available</p><% } else { %><p>Sold out</p><% } %>",
        "data": {
          "available": true
        },
        "tests": [
          {
            "kind": "text",
            "selector": "p",
            "value": "Available",
            "label": "p: textul trebuie să fie Available."
          }
        ],
        "starter": "",
        "partials": {},
        "id": "exam-foundation-ejs-conditions",
        "requirements": [
          "`p`: textul trebuie să fie `Available`."
        ],
        "inputData": {
          "available": true
        },
        "variants": [
          {
            "label": "Produs indisponibil",
            "data": {
              "available": false
            },
            "tests": [
              {
                "kind": "text",
                "selector": "p",
                "value": "Sold out",
                "label": "`p` afișează `Sold out`"
              }
            ]
          }
        ]
      }
    },
    {
      "id": "exam-foundation-ejs-loop",
      "title": "Liste dintr-un vector",
      "category": "server",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "Un for...of în template repetă markup-ul pentru fiecare element. Lista rezultată trebuie să rămână HTML bine structurat.",
      "steps": [
        "Un for...of în template repetă markup-ul pentru fiecare element. Lista rezultată trebuie să rămână HTML bine structurat.",
        "Un for...of în template repetă markup-ul pentru fiecare element. Lista rezultată trebuie să rămână HTML bine structurat."
      ],
      "answer": "",
      "rubric": [
        "Construiește un template EJS care folosește datele furnizate și produce elementele descrise mai jos.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "ejs-loop",
      "task": {
        "mode": "ejs",
        "prompt": "Construiește un template EJS care folosește datele furnizate și produce elementele descrise mai jos.",
        "solution": "<ul><% for (const product of products) { %><li><%= product.name %></li><% } %></ul>",
        "data": {
          "products": [
            {
              "name": "Cake"
            },
            {
              "name": "Tea"
            }
          ]
        },
        "tests": [
          {
            "kind": "count",
            "selector": "ul > li",
            "min": 2,
            "label": "Include cel puțin 2 elemente care corespund selectorului ul > li."
          },
          {
            "kind": "text",
            "selector": "li:first-child",
            "value": "Cake",
            "label": "li:first-child: textul trebuie să fie Cake."
          },
          {
            "kind": "text",
            "selector": "li:last-child",
            "value": "Tea",
            "label": "li:last-child: textul trebuie să fie Tea."
          }
        ],
        "starter": "",
        "partials": {},
        "id": "exam-foundation-ejs-loop",
        "requirements": [
          "Include cel puțin 2 elemente care corespund selectorului `ul > li`.",
          "`li:first-child`: textul trebuie să fie `Cake`.",
          "`li:last-child`: textul trebuie să fie `Tea`."
        ],
        "inputData": {
          "products": [
            {
              "name": "Cake"
            },
            {
              "name": "Tea"
            }
          ]
        }
      }
    },
    {
      "id": "exam-foundation-sql-read-all",
      "title": "Prima comandă SQL: citește tot tabelul",
      "category": "sql",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "După FROM trebuie numele tabelului din antetul afișat: products.",
      "steps": [
        "SQL este limbajul prin care ceri date bazei de date. O interogare este o astfel de cerere. Tabelul products este deja pregătit: acum înveți doar să îl citești.",
        "SELECT înseamnă alegerea coloanelor. Simbolul * cere toate coloanele. FROM products indică tabelul. Punctul și virgula încheie comanda. O linie nouă face codul mai lizibil; nu schimbă rezultatul. SELECT citește date, fără să le șteargă sau modifice."
      ],
      "answer": "",
      "rubric": [
        "Tabelul products este deja creat. Scrie o singură comandă care afișează toate coloanele și toate cele trei produse.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "sql-read-all",
      "task": {
        "mode": "sql",
        "prompt": "Tabelul products este deja creat. Scrie o singură comandă care afișează toate coloanele și toate cele trei produse.",
        "solution": "SELECT * FROM products;",
        "expected": [
          {
            "id": 1,
            "name": "Cake",
            "price": 12
          },
          {
            "id": 2,
            "name": "Tea",
            "price": 4
          },
          {
            "id": 3,
            "name": "Cookie",
            "price": 6
          }
        ],
        "setup": "CREATE TABLE products (id integer, name text, price integer);\nINSERT INTO products VALUES (1,'Cake',12),(2,'Tea',4),(3,'Cookie',6);",
        "checkQuery": null,
        "starter": "SELECT *\nFROM ;",
        "id": "exam-foundation-sql-read-all",
        "unordered": true,
        "expectedResult": [
          {
            "id": 1,
            "name": "Cake",
            "price": 12
          },
          {
            "id": 2,
            "name": "Tea",
            "price": 4
          },
          {
            "id": 3,
            "name": "Cookie",
            "price": 6
          }
        ],
        "contextCode": "CREATE TABLE products (id integer, name text, price integer);\nINSERT INTO products VALUES (1,'Cake',12),(2,'Tea',4),(3,'Cookie',6);",
        "contextLabel": "Baza de date de la care pornești",
        "tables": [
          {
            "name": "products",
            "columns": [
              "id",
              "name",
              "price"
            ],
            "rows": [
              {
                "id": 1,
                "name": "Cake",
                "price": 12
              },
              {
                "id": 2,
                "name": "Tea",
                "price": 4
              },
              {
                "id": 3,
                "name": "Cookie",
                "price": 6
              }
            ],
            "totalRows": 3
          }
        ]
      }
    },
    {
      "id": "exam-foundation-sql-select",
      "title": "Alege o singură coloană",
      "category": "sql",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "Înlocuiește name din exemplu cu numele coloanei care conține prețurile.",
      "steps": [
        "În loc de *, poți scrie numele unei coloane după SELECT. Tabelul rămâne același; schimbi doar informațiile afișate.",
        "SELECT name afișează numai coloana numelor. FROM products citește datele din products. Pentru prețuri înlocuiești name cu price. Fără ORDER BY, SQL nu promite o anumită ordine a rândurilor."
      ],
      "answer": "",
      "rubric": [
        "Afișează numai coloana price din tabelul products, pentru toate produsele. Nu filtra și nu modifica datele.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "sql-select",
      "task": {
        "mode": "sql",
        "prompt": "Afișează numai coloana price din tabelul products, pentru toate produsele. Nu filtra și nu modifica datele.",
        "solution": "SELECT price FROM products;",
        "expected": [
          {
            "price": 12
          },
          {
            "price": 4
          },
          {
            "price": 6
          }
        ],
        "setup": "CREATE TABLE products (id integer, name text, price integer);\nINSERT INTO products VALUES (1,'Cake',12),(2,'Tea',4),(3,'Cookie',6);",
        "checkQuery": null,
        "starter": "SELECT\nFROM products;",
        "id": "exam-foundation-sql-select",
        "requirements": [],
        "contextCode": "CREATE TABLE products (id integer, name text, price integer);\nINSERT INTO products VALUES (1,'Cake',12),(2,'Tea',4),(3,'Cookie',6);",
        "contextLabel": "Baza de date de la care pornești",
        "expectedResult": [
          {
            "price": 12
          },
          {
            "price": 4
          },
          {
            "price": 6
          }
        ],
        "unordered": true,
        "revision": 3,
        "tables": [
          {
            "name": "products",
            "columns": [
              "id",
              "name",
              "price"
            ],
            "rows": [
              {
                "id": 1,
                "name": "Cake",
                "price": 12
              },
              {
                "id": 2,
                "name": "Tea",
                "price": 4
              },
              {
                "id": 3,
                "name": "Cookie",
                "price": 6
              }
            ],
            "totalRows": 3
          }
        ]
      }
    },
    {
      "id": "exam-foundation-sql-select-columns",
      "title": "Alege coloanele",
      "category": "sql",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "După SELECT scrie cele două nume, separate prin virgulă.",
      "steps": [
        "Poți cere mai multe coloane enumerând numele lor după SELECT, separate prin virgulă.",
        "Virgula separă coloanele. id, name afișează identificatorul și numele fiecărui produs. Exercițiul cere în schimb name și price: păstrezi FROM și schimbi lista de coloane."
      ],
      "answer": "",
      "rubric": [
        "Afișează coloanele name și price pentru toate produsele.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "sql-select-columns",
      "task": {
        "mode": "sql",
        "prompt": "Afișează coloanele name și price pentru toate produsele.",
        "solution": "SELECT name, price FROM products;",
        "expected": [
          {
            "name": "Cake",
            "price": 12
          },
          {
            "name": "Tea",
            "price": 4
          },
          {
            "name": "Cookie",
            "price": 6
          }
        ],
        "setup": "CREATE TABLE products (id integer, name text, price integer);\nINSERT INTO products VALUES (1,'Cake',12),(2,'Tea',4),(3,'Cookie',6);",
        "checkQuery": null,
        "starter": "SELECT\nFROM products;",
        "id": "exam-foundation-sql-select-columns",
        "requirements": [],
        "contextCode": "CREATE TABLE products (id integer, name text, price integer);\nINSERT INTO products VALUES (1,'Cake',12),(2,'Tea',4),(3,'Cookie',6);",
        "contextLabel": "Baza de date de la care pornești",
        "expectedResult": [
          {
            "name": "Cake",
            "price": 12
          },
          {
            "name": "Tea",
            "price": 4
          },
          {
            "name": "Cookie",
            "price": 6
          }
        ],
        "unordered": true,
        "revision": 3,
        "tables": [
          {
            "name": "products",
            "columns": [
              "id",
              "name",
              "price"
            ],
            "rows": [
              {
                "id": 1,
                "name": "Cake",
                "price": 12
              },
              {
                "id": 2,
                "name": "Tea",
                "price": 4
              },
              {
                "id": 3,
                "name": "Cookie",
                "price": 6
              }
            ],
            "totalRows": 3
          }
        ]
      }
    },
    {
      "id": "exam-foundation-sql-where",
      "title": "Filtrează rândurile",
      "category": "sql",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "Adaugă WHERE price >= 10 după FROM products.",
      "steps": [
        "WHERE păstrează doar rândurile pentru care condiția este adevărată. >= se citește mai mare sau egal.",
        "FROM indică tabelul, WHERE verifică prețul fiecărui produs, iar SELECT name afișează numele celor păstrate. Cake costă 12 și trece condiția; Tea și Cookie nu. Rândurile eliminate din rezultat rămân în tabel."
      ],
      "answer": "",
      "rubric": [
        "Afișează numai name pentru produsele cu price de cel puțin 10.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "sql-where",
      "task": {
        "mode": "sql",
        "prompt": "Afișează numai name pentru produsele cu price de cel puțin 10.",
        "solution": "SELECT name FROM products WHERE price >= 10;",
        "expected": [
          {
            "name": "Cake"
          }
        ],
        "setup": "CREATE TABLE products (id integer, name text, price integer);\nINSERT INTO products VALUES (1,'Cake',12),(2,'Tea',4),(3,'Cookie',6);",
        "checkQuery": null,
        "starter": "SELECT name\nFROM products\nWHERE ;",
        "id": "exam-foundation-sql-where",
        "requirements": [],
        "contextCode": "CREATE TABLE products (id integer, name text, price integer);\nINSERT INTO products VALUES (1,'Cake',12),(2,'Tea',4),(3,'Cookie',6);",
        "contextLabel": "Baza de date de la care pornești",
        "expectedResult": [
          {
            "name": "Cake"
          }
        ],
        "unordered": true,
        "revision": 3,
        "tables": [
          {
            "name": "products",
            "columns": [
              "id",
              "name",
              "price"
            ],
            "rows": [
              {
                "id": 1,
                "name": "Cake",
                "price": 12
              },
              {
                "id": 2,
                "name": "Tea",
                "price": 4
              },
              {
                "id": 3,
                "name": "Cookie",
                "price": 6
              }
            ],
            "totalRows": 3
          }
        ]
      }
    },
    {
      "id": "exam-foundation-schema-serial",
      "title": "Cheie generată cu serial",
      "category": "sql",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "serial creează mecanismul pentru atribuirea implicită a unui întreg. PRIMARY KEY impune unicitate și absența valorilor NULL.",
      "steps": [
        "O cheie primară identifică unic un rând și nu poate lipsi.",
        "serial pregătește atribuirea automată a unui număr când coloana id este omisă.",
        "Exemplul combină crearea, inserarea și RETURNING; citește cele trei comenzi separat."
      ],
      "answer": "",
      "rubric": [
        "Creează orders cu id serial PRIMARY KEY și total numeric(8,2). Nu insera rânduri: verificarea adaugă unul pentru a testa id-ul automat.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "schema-serial",
      "task": {
        "mode": "sql",
        "prompt": "Creează orders cu id serial PRIMARY KEY și total numeric(8,2). Nu insera rânduri: verificarea adaugă unul pentru a testa id-ul automat.",
        "solution": "CREATE TABLE orders (id serial PRIMARY KEY, total numeric(8,2));",
        "expected": [
          {
            "id": 1
          }
        ],
        "setup": "",
        "checkQuery": "INSERT INTO orders(total) VALUES (12.50) RETURNING id;",
        "starter": "",
        "id": "exam-foundation-schema-serial",
        "requirements": [],
        "contextCode": "",
        "contextLabel": "Baza de date de la care pornești",
        "expectedResult": [
          {
            "id": 1
          }
        ],
        "revision": 3,
        "tables": []
      }
    },
    {
      "id": "exam-foundation-schema-varchar",
      "title": "Text cu lungime maximă",
      "category": "sql",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "varchar(50) limitează lungimea textului. text nu impune această limită declarată.",
      "steps": [
        "varchar(50) limitează lungimea textului. text nu impune această limită declarată.",
        "varchar(50) limitează lungimea textului. text nu impune această limită declarată. Nu trebuie să memorezi information_schema: această inspecție este făcută de verificare, după comanda ta."
      ],
      "answer": "",
      "rubric": [
        "Creează un tabel gol numit labels cu o singură coloană: name varchar(50). Verificarea inspectează automat structura.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "schema-varchar",
      "task": {
        "mode": "sql",
        "prompt": "Creează un tabel gol numit labels cu o singură coloană: name varchar(50). Verificarea inspectează automat structura.",
        "solution": "CREATE TABLE labels(name varchar(50));",
        "expected": [
          {
            "max_length": 50
          }
        ],
        "setup": "",
        "checkQuery": "SELECT character_maximum_length::int AS max_length FROM information_schema.columns WHERE table_name='labels' AND column_name='name';",
        "starter": "",
        "id": "exam-foundation-schema-varchar",
        "requirements": [],
        "contextCode": "",
        "contextLabel": "Baza de date de la care pornești",
        "expectedResult": [
          {
            "max_length": 50
          }
        ],
        "revision": 3,
        "tables": []
      }
    },
    {
      "id": "exam-foundation-schema-null",
      "title": "NULL înseamnă valoare necunoscută sau absentă",
      "category": "sql",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "NULL nu este același lucru cu zero sau textul gol. Pentru testare folosește IS NULL, nu = NULL.",
      "steps": [
        "NULL nu este același lucru cu zero sau textul gol. Pentru testare folosește IS NULL, nu = NULL.",
        "NULL nu este același lucru cu zero sau textul gol. Pentru testare folosește IS NULL, nu = NULL."
      ],
      "answer": "",
      "rubric": [
        "Returnează name pentru produsele fără description, în ordinea id.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "schema-null",
      "task": {
        "mode": "sql",
        "prompt": "Returnează name pentru produsele fără description, în ordinea id.",
        "solution": "SELECT name FROM products WHERE description IS NULL ORDER BY id;",
        "expected": [
          {
            "name": "Cake"
          },
          {
            "name": "Tea"
          },
          {
            "name": "Cookie"
          }
        ],
        "setup": "CREATE TYPE product_kind AS ENUM ('cake','pastry','icecream');\nCREATE TABLE products(id serial PRIMARY KEY, name varchar(50) UNIQUE NOT NULL, description text, price numeric(8,2) NOT NULL CHECK(price>=0), weight integer NOT NULL CHECK(weight>=0), kind product_kind DEFAULT 'cake', calories integer NOT NULL CHECK(calories>=0), ingredients varchar[], diabetic_friendly boolean NOT NULL DEFAULT false, created_at timestamp DEFAULT current_timestamp);\nINSERT INTO products(name,price,weight,kind,calories,ingredients,diabetic_friendly) VALUES ('Cake',12,200,'cake',400,ARRAY['flour','milk'],false),('Tea',4,100,'pastry',0,ARRAY['tea'],true),('Cookie',6,80,'pastry',250,ARRAY['flour'],false);\nCREATE TYPE user_role AS ENUM ('admin','moderator','member');\nCREATE TABLE users(id serial PRIMARY KEY, username varchar(50) UNIQUE NOT NULL, email varchar(100) NOT NULL, role user_role NOT NULL DEFAULT 'member', confirmed boolean DEFAULT false, created_at timestamp DEFAULT current_timestamp);\nCREATE TABLE visits(id serial PRIMARY KEY, user_id integer NULL REFERENCES users(id), page varchar(500) NOT NULL, visited_at timestamp DEFAULT current_timestamp);\nINSERT INTO users(username,email,role) VALUES ('Alex','alex@example.com','admin'),('Dana','dana@example.com','member');\nINSERT INTO visits(user_id,page) VALUES (1,'/products'),(1,'/product/1'),(2,'/');",
        "checkQuery": null,
        "starter": "",
        "id": "exam-foundation-schema-null",
        "requirements": [],
        "contextCode": "CREATE TYPE product_kind AS ENUM ('cake','pastry','icecream');\nCREATE TABLE products(id serial PRIMARY KEY, name varchar(50) UNIQUE NOT NULL, description text, price numeric(8,2) NOT NULL CHECK(price>=0), weight integer NOT NULL CHECK(weight>=0), kind product_kind DEFAULT 'cake', calories integer NOT NULL CHECK(calories>=0), ingredients varchar[], diabetic_friendly boolean NOT NULL DEFAULT false, created_at timestamp DEFAULT current_timestamp);\nINSERT INTO products(name,price,weight,kind,calories,ingredients,diabetic_friendly) VALUES ('Cake',12,200,'cake',400,ARRAY['flour','milk'],false),('Tea',4,100,'pastry',0,ARRAY['tea'],true),('Cookie',6,80,'pastry',250,ARRAY['flour'],false);\nCREATE TYPE user_role AS ENUM ('admin','moderator','member');\nCREATE TABLE users(id serial PRIMARY KEY, username varchar(50) UNIQUE NOT NULL, email varchar(100) NOT NULL, role user_role NOT NULL DEFAULT 'member', confirmed boolean DEFAULT false, created_at timestamp DEFAULT current_timestamp);\nCREATE TABLE visits(id serial PRIMARY KEY, user_id integer NULL REFERENCES users(id), page varchar(500) NOT NULL, visited_at timestamp DEFAULT current_timestamp);\nINSERT INTO users(username,email,role) VALUES ('Alex','alex@example.com','admin'),('Dana','dana@example.com','member');\nINSERT INTO visits(user_id,page) VALUES (1,'/products'),(1,'/product/1'),(2,'/');",
        "contextLabel": "Baza de date de la care pornești",
        "expectedResult": [
          {
            "name": "Cake"
          },
          {
            "name": "Tea"
          },
          {
            "name": "Cookie"
          }
        ],
        "tables": [
          {
            "name": "products",
            "columns": [
              "id",
              "name",
              "description",
              "price",
              "weight",
              "kind",
              "calories",
              "ingredients",
              "diabetic_friendly",
              "created_at"
            ],
            "rows": [
              {
                "id": 1,
                "name": "Cake",
                "description": null,
                "price": "12.00",
                "weight": 200,
                "kind": "cake",
                "calories": 400,
                "ingredients": [
                  "flour",
                  "milk"
                ],
                "diabetic_friendly": false,
                "created_at": "generated at start"
              },
              {
                "id": 2,
                "name": "Tea",
                "description": null,
                "price": "4.00",
                "weight": 100,
                "kind": "pastry",
                "calories": 0,
                "ingredients": [
                  "tea"
                ],
                "diabetic_friendly": true,
                "created_at": "generated at start"
              },
              {
                "id": 3,
                "name": "Cookie",
                "description": null,
                "price": "6.00",
                "weight": 80,
                "kind": "pastry",
                "calories": 250,
                "ingredients": [
                  "flour"
                ],
                "diabetic_friendly": false,
                "created_at": "generated at start"
              }
            ],
            "totalRows": 3
          }
        ]
      }
    },
    {
      "id": "exam-foundation-schema-not-null",
      "title": "Coloană obligatorie",
      "category": "sql",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "NOT NULL interzice lipsa unei valori în coloană. Nu interzice automat un text gol.",
      "steps": [
        "NOT NULL interzice lipsa unei valori în coloană. Nu interzice automat un text gol.",
        "NOT NULL interzice lipsa unei valori în coloană. Nu interzice automat un text gol. Nu trebuie să memorezi information_schema: această inspecție este făcută de verificare, după comanda ta."
      ],
      "answer": "",
      "rubric": [
        "Creează un tabel gol numit labels cu o singură coloană: name text NOT NULL. Verificarea inspectează automat structura.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "schema-not-null",
      "task": {
        "mode": "sql",
        "prompt": "Creează un tabel gol numit labels cu o singură coloană: name text NOT NULL. Verificarea inspectează automat structura.",
        "solution": "CREATE TABLE labels(name text NOT NULL);",
        "expected": [
          {
            "is_nullable": "NO"
          }
        ],
        "setup": "",
        "checkQuery": "SELECT is_nullable FROM information_schema.columns WHERE table_name='labels' AND column_name='name';",
        "starter": "",
        "id": "exam-foundation-schema-not-null",
        "requirements": [],
        "contextCode": "",
        "contextLabel": "Baza de date de la care pornești",
        "expectedResult": [
          {
            "is_nullable": "NO"
          }
        ],
        "revision": 3,
        "tables": []
      }
    },
    {
      "id": "exam-foundation-sql-distinct",
      "title": "Valori distincte",
      "category": "sql",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "DISTINCT elimină rândurile duplicate din rezultatul selectat; nu modifică datele stocate.",
      "steps": [
        "DISTINCT păstrează o singură apariție a fiecărei valori din rezultat.",
        "SELECT DISTINCT kind citește tipurile fără repetări.",
        "Conversia ::text schimbă tipul rezultatului, iar AS kind îi dă numele coloanei."
      ],
      "answer": "",
      "rubric": [
        "Returnează tipurile de produs distincte ca text, ordonate după kind.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "sql-distinct",
      "task": {
        "mode": "sql",
        "prompt": "Returnează tipurile de produs distincte ca text, ordonate după kind.",
        "solution": "SELECT DISTINCT kind::text AS kind FROM products ORDER BY kind;",
        "expected": [
          {
            "kind": "cake"
          },
          {
            "kind": "pastry"
          }
        ],
        "setup": "CREATE TYPE product_kind AS ENUM ('cake','pastry','icecream');\nCREATE TABLE products(id serial PRIMARY KEY, name varchar(50) UNIQUE NOT NULL, description text, price numeric(8,2) NOT NULL CHECK(price>=0), weight integer NOT NULL CHECK(weight>=0), kind product_kind DEFAULT 'cake', calories integer NOT NULL CHECK(calories>=0), ingredients varchar[], diabetic_friendly boolean NOT NULL DEFAULT false, created_at timestamp DEFAULT current_timestamp);\nINSERT INTO products(name,price,weight,kind,calories,ingredients,diabetic_friendly) VALUES ('Cake',12,200,'cake',400,ARRAY['flour','milk'],false),('Tea',4,100,'pastry',0,ARRAY['tea'],true),('Cookie',6,80,'pastry',250,ARRAY['flour'],false);\nCREATE TYPE user_role AS ENUM ('admin','moderator','member');\nCREATE TABLE users(id serial PRIMARY KEY, username varchar(50) UNIQUE NOT NULL, email varchar(100) NOT NULL, role user_role NOT NULL DEFAULT 'member', confirmed boolean DEFAULT false, created_at timestamp DEFAULT current_timestamp);\nCREATE TABLE visits(id serial PRIMARY KEY, user_id integer NULL REFERENCES users(id), page varchar(500) NOT NULL, visited_at timestamp DEFAULT current_timestamp);\nINSERT INTO users(username,email,role) VALUES ('Alex','alex@example.com','admin'),('Dana','dana@example.com','member');\nINSERT INTO visits(user_id,page) VALUES (1,'/products'),(1,'/product/1'),(2,'/');",
        "checkQuery": null,
        "starter": "",
        "id": "exam-foundation-sql-distinct",
        "requirements": [],
        "contextCode": "CREATE TYPE product_kind AS ENUM ('cake','pastry','icecream');\nCREATE TABLE products(id serial PRIMARY KEY, name varchar(50) UNIQUE NOT NULL, description text, price numeric(8,2) NOT NULL CHECK(price>=0), weight integer NOT NULL CHECK(weight>=0), kind product_kind DEFAULT 'cake', calories integer NOT NULL CHECK(calories>=0), ingredients varchar[], diabetic_friendly boolean NOT NULL DEFAULT false, created_at timestamp DEFAULT current_timestamp);\nINSERT INTO products(name,price,weight,kind,calories,ingredients,diabetic_friendly) VALUES ('Cake',12,200,'cake',400,ARRAY['flour','milk'],false),('Tea',4,100,'pastry',0,ARRAY['tea'],true),('Cookie',6,80,'pastry',250,ARRAY['flour'],false);\nCREATE TYPE user_role AS ENUM ('admin','moderator','member');\nCREATE TABLE users(id serial PRIMARY KEY, username varchar(50) UNIQUE NOT NULL, email varchar(100) NOT NULL, role user_role NOT NULL DEFAULT 'member', confirmed boolean DEFAULT false, created_at timestamp DEFAULT current_timestamp);\nCREATE TABLE visits(id serial PRIMARY KEY, user_id integer NULL REFERENCES users(id), page varchar(500) NOT NULL, visited_at timestamp DEFAULT current_timestamp);\nINSERT INTO users(username,email,role) VALUES ('Alex','alex@example.com','admin'),('Dana','dana@example.com','member');\nINSERT INTO visits(user_id,page) VALUES (1,'/products'),(1,'/product/1'),(2,'/');",
        "contextLabel": "Baza de date de la care pornești",
        "expectedResult": [
          {
            "kind": "cake"
          },
          {
            "kind": "pastry"
          }
        ],
        "tables": [
          {
            "name": "products",
            "columns": [
              "id",
              "name",
              "description",
              "price",
              "weight",
              "kind",
              "calories",
              "ingredients",
              "diabetic_friendly",
              "created_at"
            ],
            "rows": [
              {
                "id": 1,
                "name": "Cake",
                "description": null,
                "price": "12.00",
                "weight": 200,
                "kind": "cake",
                "calories": 400,
                "ingredients": [
                  "flour",
                  "milk"
                ],
                "diabetic_friendly": false,
                "created_at": "generated at start"
              },
              {
                "id": 2,
                "name": "Tea",
                "description": null,
                "price": "4.00",
                "weight": 100,
                "kind": "pastry",
                "calories": 0,
                "ingredients": [
                  "tea"
                ],
                "diabetic_friendly": true,
                "created_at": "generated at start"
              },
              {
                "id": 3,
                "name": "Cookie",
                "description": null,
                "price": "6.00",
                "weight": 80,
                "kind": "pastry",
                "calories": 250,
                "ingredients": [
                  "flour"
                ],
                "diabetic_friendly": false,
                "created_at": "generated at start"
              }
            ],
            "totalRows": 3
          }
        ]
      }
    },
    {
      "id": "exam-foundation-sql-and-or",
      "title": "Condiții combinate",
      "category": "sql",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "Parantezele clarifică gruparea dintre AND și OR.",
      "steps": [
        "Parantezele clarifică gruparea dintre AND și OR.",
        "Parantezele clarifică gruparea dintre AND și OR."
      ],
      "answer": "",
      "rubric": [
        "Alege produsele cake sau pastry cu preț de cel puțin 6; returnează name în ordinea id.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "sql-and-or",
      "task": {
        "mode": "sql",
        "prompt": "Alege produsele cake sau pastry cu preț de cel puțin 6; returnează name în ordinea id.",
        "solution": "SELECT name FROM products WHERE (kind='cake' OR kind='pastry') AND price>=6 ORDER BY id;",
        "expected": [
          {
            "name": "Cake"
          },
          {
            "name": "Cookie"
          }
        ],
        "setup": "CREATE TYPE product_kind AS ENUM ('cake','pastry','icecream');\nCREATE TABLE products(id serial PRIMARY KEY, name varchar(50) UNIQUE NOT NULL, description text, price numeric(8,2) NOT NULL CHECK(price>=0), weight integer NOT NULL CHECK(weight>=0), kind product_kind DEFAULT 'cake', calories integer NOT NULL CHECK(calories>=0), ingredients varchar[], diabetic_friendly boolean NOT NULL DEFAULT false, created_at timestamp DEFAULT current_timestamp);\nINSERT INTO products(name,price,weight,kind,calories,ingredients,diabetic_friendly) VALUES ('Cake',12,200,'cake',400,ARRAY['flour','milk'],false),('Tea',4,100,'pastry',0,ARRAY['tea'],true),('Cookie',6,80,'pastry',250,ARRAY['flour'],false);\nCREATE TYPE user_role AS ENUM ('admin','moderator','member');\nCREATE TABLE users(id serial PRIMARY KEY, username varchar(50) UNIQUE NOT NULL, email varchar(100) NOT NULL, role user_role NOT NULL DEFAULT 'member', confirmed boolean DEFAULT false, created_at timestamp DEFAULT current_timestamp);\nCREATE TABLE visits(id serial PRIMARY KEY, user_id integer NULL REFERENCES users(id), page varchar(500) NOT NULL, visited_at timestamp DEFAULT current_timestamp);\nINSERT INTO users(username,email,role) VALUES ('Alex','alex@example.com','admin'),('Dana','dana@example.com','member');\nINSERT INTO visits(user_id,page) VALUES (1,'/products'),(1,'/product/1'),(2,'/');",
        "checkQuery": null,
        "starter": "",
        "id": "exam-foundation-sql-and-or",
        "requirements": [],
        "contextCode": "CREATE TYPE product_kind AS ENUM ('cake','pastry','icecream');\nCREATE TABLE products(id serial PRIMARY KEY, name varchar(50) UNIQUE NOT NULL, description text, price numeric(8,2) NOT NULL CHECK(price>=0), weight integer NOT NULL CHECK(weight>=0), kind product_kind DEFAULT 'cake', calories integer NOT NULL CHECK(calories>=0), ingredients varchar[], diabetic_friendly boolean NOT NULL DEFAULT false, created_at timestamp DEFAULT current_timestamp);\nINSERT INTO products(name,price,weight,kind,calories,ingredients,diabetic_friendly) VALUES ('Cake',12,200,'cake',400,ARRAY['flour','milk'],false),('Tea',4,100,'pastry',0,ARRAY['tea'],true),('Cookie',6,80,'pastry',250,ARRAY['flour'],false);\nCREATE TYPE user_role AS ENUM ('admin','moderator','member');\nCREATE TABLE users(id serial PRIMARY KEY, username varchar(50) UNIQUE NOT NULL, email varchar(100) NOT NULL, role user_role NOT NULL DEFAULT 'member', confirmed boolean DEFAULT false, created_at timestamp DEFAULT current_timestamp);\nCREATE TABLE visits(id serial PRIMARY KEY, user_id integer NULL REFERENCES users(id), page varchar(500) NOT NULL, visited_at timestamp DEFAULT current_timestamp);\nINSERT INTO users(username,email,role) VALUES ('Alex','alex@example.com','admin'),('Dana','dana@example.com','member');\nINSERT INTO visits(user_id,page) VALUES (1,'/products'),(1,'/product/1'),(2,'/');",
        "contextLabel": "Baza de date de la care pornești",
        "expectedResult": [
          {
            "name": "Cake"
          },
          {
            "name": "Cookie"
          }
        ],
        "tables": [
          {
            "name": "products",
            "columns": [
              "id",
              "name",
              "description",
              "price",
              "weight",
              "kind",
              "calories",
              "ingredients",
              "diabetic_friendly",
              "created_at"
            ],
            "rows": [
              {
                "id": 1,
                "name": "Cake",
                "description": null,
                "price": "12.00",
                "weight": 200,
                "kind": "cake",
                "calories": 400,
                "ingredients": [
                  "flour",
                  "milk"
                ],
                "diabetic_friendly": false,
                "created_at": "generated at start"
              },
              {
                "id": 2,
                "name": "Tea",
                "description": null,
                "price": "4.00",
                "weight": 100,
                "kind": "pastry",
                "calories": 0,
                "ingredients": [
                  "tea"
                ],
                "diabetic_friendly": true,
                "created_at": "generated at start"
              },
              {
                "id": 3,
                "name": "Cookie",
                "description": null,
                "price": "6.00",
                "weight": 80,
                "kind": "pastry",
                "calories": 250,
                "ingredients": [
                  "flour"
                ],
                "diabetic_friendly": false,
                "created_at": "generated at start"
              }
            ],
            "totalRows": 3
          }
        ]
      }
    },
    {
      "id": "exam-foundation-sql-between",
      "title": "Interval inclusiv",
      "category": "sql",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "BETWEEN include ambele limite. Pentru intervale semi-deschise scrie explicit >= și <.",
      "steps": [
        "BETWEEN include ambele limite. Pentru intervale semi-deschise scrie explicit >= și <.",
        "BETWEEN include ambele limite. Pentru intervale semi-deschise scrie explicit >= și <."
      ],
      "answer": "",
      "rubric": [
        "Returnează name pentru prețuri între 4 și 6 inclusiv, în ordinea id.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "sql-between",
      "task": {
        "mode": "sql",
        "prompt": "Returnează name pentru prețuri între 4 și 6 inclusiv, în ordinea id.",
        "solution": "SELECT name FROM products WHERE price BETWEEN 4 AND 6 ORDER BY id;",
        "expected": [
          {
            "name": "Tea"
          },
          {
            "name": "Cookie"
          }
        ],
        "setup": "CREATE TYPE product_kind AS ENUM ('cake','pastry','icecream');\nCREATE TABLE products(id serial PRIMARY KEY, name varchar(50) UNIQUE NOT NULL, description text, price numeric(8,2) NOT NULL CHECK(price>=0), weight integer NOT NULL CHECK(weight>=0), kind product_kind DEFAULT 'cake', calories integer NOT NULL CHECK(calories>=0), ingredients varchar[], diabetic_friendly boolean NOT NULL DEFAULT false, created_at timestamp DEFAULT current_timestamp);\nINSERT INTO products(name,price,weight,kind,calories,ingredients,diabetic_friendly) VALUES ('Cake',12,200,'cake',400,ARRAY['flour','milk'],false),('Tea',4,100,'pastry',0,ARRAY['tea'],true),('Cookie',6,80,'pastry',250,ARRAY['flour'],false);\nCREATE TYPE user_role AS ENUM ('admin','moderator','member');\nCREATE TABLE users(id serial PRIMARY KEY, username varchar(50) UNIQUE NOT NULL, email varchar(100) NOT NULL, role user_role NOT NULL DEFAULT 'member', confirmed boolean DEFAULT false, created_at timestamp DEFAULT current_timestamp);\nCREATE TABLE visits(id serial PRIMARY KEY, user_id integer NULL REFERENCES users(id), page varchar(500) NOT NULL, visited_at timestamp DEFAULT current_timestamp);\nINSERT INTO users(username,email,role) VALUES ('Alex','alex@example.com','admin'),('Dana','dana@example.com','member');\nINSERT INTO visits(user_id,page) VALUES (1,'/products'),(1,'/product/1'),(2,'/');",
        "checkQuery": null,
        "starter": "",
        "id": "exam-foundation-sql-between",
        "requirements": [],
        "contextCode": "CREATE TYPE product_kind AS ENUM ('cake','pastry','icecream');\nCREATE TABLE products(id serial PRIMARY KEY, name varchar(50) UNIQUE NOT NULL, description text, price numeric(8,2) NOT NULL CHECK(price>=0), weight integer NOT NULL CHECK(weight>=0), kind product_kind DEFAULT 'cake', calories integer NOT NULL CHECK(calories>=0), ingredients varchar[], diabetic_friendly boolean NOT NULL DEFAULT false, created_at timestamp DEFAULT current_timestamp);\nINSERT INTO products(name,price,weight,kind,calories,ingredients,diabetic_friendly) VALUES ('Cake',12,200,'cake',400,ARRAY['flour','milk'],false),('Tea',4,100,'pastry',0,ARRAY['tea'],true),('Cookie',6,80,'pastry',250,ARRAY['flour'],false);\nCREATE TYPE user_role AS ENUM ('admin','moderator','member');\nCREATE TABLE users(id serial PRIMARY KEY, username varchar(50) UNIQUE NOT NULL, email varchar(100) NOT NULL, role user_role NOT NULL DEFAULT 'member', confirmed boolean DEFAULT false, created_at timestamp DEFAULT current_timestamp);\nCREATE TABLE visits(id serial PRIMARY KEY, user_id integer NULL REFERENCES users(id), page varchar(500) NOT NULL, visited_at timestamp DEFAULT current_timestamp);\nINSERT INTO users(username,email,role) VALUES ('Alex','alex@example.com','admin'),('Dana','dana@example.com','member');\nINSERT INTO visits(user_id,page) VALUES (1,'/products'),(1,'/product/1'),(2,'/');",
        "contextLabel": "Baza de date de la care pornești",
        "expectedResult": [
          {
            "name": "Tea"
          },
          {
            "name": "Cookie"
          }
        ],
        "tables": [
          {
            "name": "products",
            "columns": [
              "id",
              "name",
              "description",
              "price",
              "weight",
              "kind",
              "calories",
              "ingredients",
              "diabetic_friendly",
              "created_at"
            ],
            "rows": [
              {
                "id": 1,
                "name": "Cake",
                "description": null,
                "price": "12.00",
                "weight": 200,
                "kind": "cake",
                "calories": 400,
                "ingredients": [
                  "flour",
                  "milk"
                ],
                "diabetic_friendly": false,
                "created_at": "generated at start"
              },
              {
                "id": 2,
                "name": "Tea",
                "description": null,
                "price": "4.00",
                "weight": 100,
                "kind": "pastry",
                "calories": 0,
                "ingredients": [
                  "tea"
                ],
                "diabetic_friendly": true,
                "created_at": "generated at start"
              },
              {
                "id": 3,
                "name": "Cookie",
                "description": null,
                "price": "6.00",
                "weight": 80,
                "kind": "pastry",
                "calories": 250,
                "ingredients": [
                  "flour"
                ],
                "diabetic_friendly": false,
                "created_at": "generated at start"
              }
            ],
            "totalRows": 3
          }
        ]
      }
    },
    {
      "id": "exam-foundation-sql-in-values",
      "title": "Apartenență la o listă",
      "category": "sql",
      "minutes": 8,
      "level": "Fundamente",
      "hint": "IN verifică dacă valoarea apare în lista dată.",
      "steps": [
        "IN verifică dacă valoarea apare în lista dată.",
        "IN verifică dacă valoarea apare în lista dată."
      ],
      "answer": "",
      "rubric": [
        "Selectează Cake și Tea folosind IN și ordonează după id.",
        "Explică de ce ai ales această soluție."
      ],
      "lessonId": "sql-in-values",
      "task": {
        "mode": "sql",
        "prompt": "Selectează Cake și Tea folosind IN și ordonează după id.",
        "solution": "SELECT name FROM products WHERE name IN ('Tea','Cake') ORDER BY id;",
        "expected": [
          {
            "name": "Cake"
          },
          {
            "name": "Tea"
          }
        ],
        "setup": "CREATE TYPE product_kind AS ENUM ('cake','pastry','icecream');\nCREATE TABLE products(id serial PRIMARY KEY, name varchar(50) UNIQUE NOT NULL, description text, price numeric(8,2) NOT NULL CHECK(price>=0), weight integer NOT NULL CHECK(weight>=0), kind product_kind DEFAULT 'cake', calories integer NOT NULL CHECK(calories>=0), ingredients varchar[], diabetic_friendly boolean NOT NULL DEFAULT false, created_at timestamp DEFAULT current_timestamp);\nINSERT INTO products(name,price,weight,kind,calories,ingredients,diabetic_friendly) VALUES ('Cake',12,200,'cake',400,ARRAY['flour','milk'],false),('Tea',4,100,'pastry',0,ARRAY['tea'],true),('Cookie',6,80,'pastry',250,ARRAY['flour'],false);\nCREATE TYPE user_role AS ENUM ('admin','moderator','member');\nCREATE TABLE users(id serial PRIMARY KEY, username varchar(50) UNIQUE NOT NULL, email varchar(100) NOT NULL, role user_role NOT NULL DEFAULT 'member', confirmed boolean DEFAULT false, created_at timestamp DEFAULT current_timestamp);\nCREATE TABLE visits(id serial PRIMARY KEY, user_id integer NULL REFERENCES users(id), page varchar(500) NOT NULL, visited_at timestamp DEFAULT current_timestamp);\nINSERT INTO users(username,email,role) VALUES ('Alex','alex@example.com','admin'),('Dana','dana@example.com','member');\nINSERT INTO visits(user_id,page) VALUES (1,'/products'),(1,'/product/1'),(2,'/');",
        "checkQuery": null,
        "starter": "",
        "id": "exam-foundation-sql-in-values",
        "requirements": [],
        "contextCode": "CREATE TYPE product_kind AS ENUM ('cake','pastry','icecream');\nCREATE TABLE products(id serial PRIMARY KEY, name varchar(50) UNIQUE NOT NULL, description text, price numeric(8,2) NOT NULL CHECK(price>=0), weight integer NOT NULL CHECK(weight>=0), kind product_kind DEFAULT 'cake', calories integer NOT NULL CHECK(calories>=0), ingredients varchar[], diabetic_friendly boolean NOT NULL DEFAULT false, created_at timestamp DEFAULT current_timestamp);\nINSERT INTO products(name,price,weight,kind,calories,ingredients,diabetic_friendly) VALUES ('Cake',12,200,'cake',400,ARRAY['flour','milk'],false),('Tea',4,100,'pastry',0,ARRAY['tea'],true),('Cookie',6,80,'pastry',250,ARRAY['flour'],false);\nCREATE TYPE user_role AS ENUM ('admin','moderator','member');\nCREATE TABLE users(id serial PRIMARY KEY, username varchar(50) UNIQUE NOT NULL, email varchar(100) NOT NULL, role user_role NOT NULL DEFAULT 'member', confirmed boolean DEFAULT false, created_at timestamp DEFAULT current_timestamp);\nCREATE TABLE visits(id serial PRIMARY KEY, user_id integer NULL REFERENCES users(id), page varchar(500) NOT NULL, visited_at timestamp DEFAULT current_timestamp);\nINSERT INTO users(username,email,role) VALUES ('Alex','alex@example.com','admin'),('Dana','dana@example.com','member');\nINSERT INTO visits(user_id,page) VALUES (1,'/products'),(1,'/product/1'),(2,'/');",
        "contextLabel": "Baza de date de la care pornești",
        "expectedResult": [
          {
            "name": "Cake"
          },
          {
            "name": "Tea"
          }
        ],
        "tables": [
          {
            "name": "products",
            "columns": [
              "id",
              "name",
              "description",
              "price",
              "weight",
              "kind",
              "calories",
              "ingredients",
              "diabetic_friendly",
              "created_at"
            ],
            "rows": [
              {
                "id": 1,
                "name": "Cake",
                "description": null,
                "price": "12.00",
                "weight": 200,
                "kind": "cake",
                "calories": 400,
                "ingredients": [
                  "flour",
                  "milk"
                ],
                "diabetic_friendly": false,
                "created_at": "generated at start"
              },
              {
                "id": 2,
                "name": "Tea",
                "description": null,
                "price": "4.00",
                "weight": 100,
                "kind": "pastry",
                "calories": 0,
                "ingredients": [
                  "tea"
                ],
                "diabetic_friendly": true,
                "created_at": "generated at start"
              },
              {
                "id": 3,
                "name": "Cookie",
                "description": null,
                "price": "6.00",
                "weight": 80,
                "kind": "pastry",
                "calories": 250,
                "ingredients": [
                  "flour"
                ],
                "diabetic_friendly": false,
                "created_at": "generated at start"
              }
            ],
            "totalRows": 3
          }
        ]
      }
    },
    {
      "id": "exam-bridge-css-first-letter",
      "title": "Prima literă și prima linie",
      "category": "css",
      "minutes": 15,
      "level": "Bilet practic",
      "hint": "Selectorul alege elementele, iar declarațiile dintre acolade le schimbă aspectul. Observă rezultatul înainte să continui.",
      "steps": [
        "p selectează paragraful. ::first-letter selectează prima literă a primei linii formatate, inclusiv unele semne de punctuație alăturate. color: navy o colorează; font-size: 32px stabilește dimensiunea."
      ],
      "answer": "",
      "rubric": [
        "Rezolvă cerința fără erori.",
        "Verifică și cazul opus.",
        "Explică fiecare etapă."
      ],
      "lessonId": "css-first-letter",
      "task": {
        "mode": "css",
        "prompt": "Stilizează HTML-ul furnizat pentru a obține aspectul descris mai jos.",
        "solution": "p::first-letter { color: navy; font-size: 32px; }",
        "fixture": "<p>Welcome to Demo Catalog.</p>",
        "tests": [
          {
            "kind": "pseudo",
            "selector": "p",
            "pseudo": "::first-letter",
            "name": "color",
            "includes": "0, 0, 128",
            "label": "Pentru p::first-letter, color include 0, 0, 128."
          },
          {
            "kind": "pseudo",
            "selector": "p",
            "pseudo": "::first-letter",
            "name": "font-size",
            "includes": "32px",
            "label": "Prima literă are 32px."
          }
        ],
        "starter": "",
        "id": "exam-bridge-css-first-letter",
        "requirements": [
          "Pentru p::first-letter, color include 0, 0, 128.",
          "Prima literă are 32px."
        ],
        "revision": 3
      }
    },
    {
      "id": "exam-bridge-css-fixed-viewport",
      "title": "Un link față de viewport",
      "category": "css",
      "minutes": 15,
      "level": "Bilet practic",
      "hint": "top și left dau distanțele.",
      "steps": [
        "#back selectează linkul.",
        "fixed îl scoate din flux.",
        "top și left dau distanțele."
      ],
      "answer": "",
      "rubric": [
        "Rezolvă cerința fără erori.",
        "Verifică și cazul opus.",
        "Explică fiecare etapă."
      ],
      "lessonId": "css-fixed-viewport",
      "task": {
        "mode": "css",
        "prompt": "Fixează #back la stânga viewport-ului, la 100px de sus.",
        "solution": "#back {\n  position: fixed;\n  top: 100px;\n  left: 0;\n}",
        "fixture": "<a id=\"back\" href=\"#top\">Back to top</a>",
        "tests": [
          {
            "kind": "style",
            "selector": "#back",
            "name": "position",
            "value": "fixed",
            "label": "`#back`: `position: fixed`"
          },
          {
            "kind": "style",
            "selector": "#back",
            "name": "top",
            "value": "100px",
            "label": "`#back`: `top: 100px`"
          },
          {
            "kind": "style",
            "selector": "#back",
            "name": "left",
            "value": "0px",
            "label": "`#back`: `left: 0px`"
          }
        ],
        "starter": "",
        "id": "exam-bridge-css-fixed-viewport"
      }
    },
    {
      "id": "exam-bridge-css-scale-horizontal",
      "title": "Înjumătățește lățimea vizuală",
      "category": "css",
      "minutes": 15,
      "level": "Bilet practic",
      "hint": "2em dublează fontul.",
      "steps": [
        "even înseamnă poziții pare.",
        "scaleX(0.5) comprimă orizontal.",
        "2em dublează fontul."
      ],
      "answer": "",
      "rubric": [
        "Rezolvă cerința fără erori.",
        "Verifică și cazul opus.",
        "Explică fiecare etapă."
      ],
      "lessonId": "css-scale-horizontal",
      "task": {
        "mode": "css",
        "prompt": "Comprimă numai paragrafele pare la jumătate orizontal. Prima literă a fiecărui paragraf are 32px, iar restul 16px.",
        "solution": ".words p { font-size: 16px; }\n.words p:nth-child(even) { transform: scaleX(0.5); }\n.words p::first-letter { font-size: 2em; }",
        "fixture": "<div class=\"words\"><p>Alpha</p><p>Beta</p><p>Gamma</p><p>Delta</p></div>",
        "tests": [
          {
            "kind": "style",
            "selector": ".words p:nth-child(2)",
            "name": "transform",
            "value": "matrix(0.5, 0, 0, 1, 0, 0)",
            "label": "`.words p:nth-child(2)`: `transform: matrix(0.5, 0, 0, 1, 0, 0)`"
          },
          {
            "kind": "style",
            "selector": ".words p",
            "name": "transform",
            "value": "none",
            "label": "`.words p`: `transform: none`"
          },
          {
            "kind": "pseudo",
            "selector": ".words p",
            "pseudo": "::first-letter",
            "name": "font-size",
            "includes": "32px",
            "label": "Prima literă este dublă."
          }
        ],
        "starter": "",
        "id": "exam-bridge-css-scale-horizontal"
      }
    },
    {
      "id": "exam-bridge-scss-bootstrap",
      "title": "Personalizează sursele Bootstrap",
      "category": "css",
      "minutes": 15,
      "level": "Bilet practic",
      "hint": "Setează variabilele înainte de import; nu rescrie manual h1 după el.",
      "steps": [
        "$h1-font-size: 40px configurează h1. $enable-rfs: false dezactivează micșorarea responsivă în acest exercițiu, pentru exact 40px inclusiv pe ecrane mici. Importul încarcă sursele reale Bootstrap 5 furnizate virtual. În proiectul propriu instalezi bootstrap și sass cu npm, salvezi custom.scss, apoi rulezi npx sass --load-path=node_modules custom.scss custom.css și încarci custom.css prin link. Browserul citește CSS. Bootstrap 5 încă folosește @import; avertismentele de depreciere nu opresc compilarea."
      ],
      "answer": "",
      "rubric": [
        "Rezolvă cerința fără erori.",
        "Verifică și cazul opus.",
        "Explică fiecare etapă."
      ],
      "lessonId": "scss-bootstrap",
      "task": {
        "mode": "scss",
        "prompt": "Compilează sursele Bootstrap furnizate cu h1 implicit de 40px și RFS dezactivat. Butonul trebuie să primească stilurile bibliotecii. Nu scrie manual reguli h1 sau .btn.",
        "solution": "$h1-font-size: 40px;\n$enable-rfs: false;\n@import \"bootstrap/scss/bootstrap\";",
        "fixture": "<h1>Catalog</h1><button class=\"btn btn-primary\">Products</button>",
        "tests": [
          {
            "kind": "style",
            "selector": "h1",
            "name": "font-size",
            "value": "40px",
            "label": "`h1`: `font-size: 40px`"
          },
          {
            "kind": "style",
            "selector": ".btn",
            "name": "display",
            "value": "inline-block",
            "label": "`.btn`: `display: inline-block`"
          }
        ],
        "starter": "$h1-font-size: ;\n$enable-rfs: false;\n@import \"bootstrap/scss/bootstrap\";",
        "id": "exam-bridge-scss-bootstrap",
        "requirements": [
          "`h1`: `font-size: 40px`",
          "`.btn`: `display: inline-block`"
        ],
        "bootstrap": true,
        "revision": 3
      }
    },
    {
      "id": "exam-bridge-dulc-filter-dom",
      "title": "Aplică filtrul în DOM",
      "category": "client",
      "minutes": 15,
      "level": "Bilet practic",
      "hint": "Începe cu numele și apoi adaugă stocul, prețul și categoria. Filtrarea în browser schimbă doar afișarea cardurilor, nu rândurile din PostgreSQL.",
      "steps": [
        "Începe cu numele și apoi adaugă stocul, prețul și categoria. Filtrarea în browser schimbă doar afișarea cardurilor, nu rândurile din PostgreSQL."
      ],
      "answer": "",
      "rubric": [
        "Rezolvă cerința fără erori.",
        "Verifică și cazul opus.",
        "Explică fiecare etapă."
      ],
      "lessonId": "dulc-filter-dom",
      "task": {
        "mode": "dom",
        "prompt": "La click pe Filter citește prefixul, ignorând spațiile și majusculele. Cu not, afișează Notebook și ascunde Pen.",
        "solution": "document.querySelector(\"#filter\").onclick = function () {\n  const prefix = document.querySelector(\"#name-prefix\").value.trim().toLowerCase();\n  for (const card of document.querySelectorAll(\".product\")) {\n    const name = card.querySelector(\".product-name\").textContent.trim().toLowerCase();\n    card.style.display = name.startsWith(prefix) ? \"block\" : \"none\";\n  }\n};",
        "fixture": "<input id=\"name-prefix\" value=\"not\"><button id=\"filter\">Filter</button><article class=\"product\" id=\"notebook\"><span class=\"product-name\">Notebook</span></article><article class=\"product\" id=\"pen\"><span class=\"product-name\">Pen</span></article>",
        "tests": [
          {
            "kind": "style",
            "selector": "#notebook",
            "name": "display",
            "value": "block",
            "label": "`#notebook`: `display: block`"
          },
          {
            "kind": "style",
            "selector": "#pen",
            "name": "display",
            "value": "none",
            "label": "`#pen`: `display: none`"
          }
        ],
        "actions": [
          {
            "type": "click",
            "selector": "#filter"
          }
        ],
        "starter": "",
        "id": "exam-bridge-dulc-filter-dom",
        "revision": 4,
        "requirements": [
          "`#notebook`: `display: block`",
          "`#pen`: `display: none`"
        ]
      }
    },
    {
      "id": "exam-bridge-project-sort",
      "title": "Sortarea în ambele sensuri",
      "category": "client",
      "minutes": 15,
      "level": "Bilet practic",
      "hint": "Copiază vectorul înainte de sortare. Convertește price cu Number și folosește name ca al doilea criteriu. Pentru carduri DOM, appendChild mută elementele în ordinea calculată.",
      "steps": [
        "Copia protejează input.",
        "Compară prețurile numeric.",
        "La egalitate, compară numele.",
        "Aplică sign ambelor criterii.",
        "Returnează id-urile în ordine."
      ],
      "answer": "",
      "rubric": [
        "Rezolvă cerința fără erori.",
        "Verifică și cazul opus.",
        "Explică fiecare etapă."
      ],
      "lessonId": "project-sort",
      "task": {
        "mode": "js",
        "prompt": "Returnează id-urile sortate după preț și apoi nume.",
        "solution": "function solve(input) {\n  const products = [...input.products];\n  function compareProducts(first, second) {\n    const priceDifference = Number(first.price) - Number(second.price);\n    if (priceDifference !== 0) {\n      return input.sign * priceDifference;\n    }\n    const firstName = first.name.toLowerCase();\n    const secondName = second.name.toLowerCase();\n    return input.sign * firstName.localeCompare(secondName);\n  }\n  products.sort(compareProducts);\n  return products.map(function (product) {\n    return product.id;\n  });\n}",
        "cases": [
          {
            "input": {
              "products": [
                {
                  "id": 1,
                  "name": "Notebook",
                  "price": "7.50",
                  "stock": 400,
                  "category": "standard"
                },
                {
                  "id": 2,
                  "name": "Pen",
                  "price": "6.00",
                  "stock": 400,
                  "category": "standard"
                },
                {
                  "id": 6,
                  "name": "Sticker",
                  "price": "10.00",
                  "stock": 0,
                  "category": "limited"
                }
              ],
              "sign": 1
            },
            "expected": [
              2,
              1,
              6
            ]
          },
          {
            "input": {
              "products": [
                {
                  "id": 1,
                  "name": "Notebook",
                  "price": "7.50",
                  "stock": 400,
                  "category": "standard"
                },
                {
                  "id": 2,
                  "name": "Pen",
                  "price": "6.00",
                  "stock": 400,
                  "category": "standard"
                },
                {
                  "id": 6,
                  "name": "Sticker",
                  "price": "10.00",
                  "stock": 0,
                  "category": "limited"
                }
              ],
              "sign": -1
            },
            "expected": [
              6,
              1,
              2
            ]
          },
          {
            "input": {
              "products": [
                {
                  "id": 2,
                  "name": "B",
                  "price": "7"
                },
                {
                  "id": 1,
                  "name": "A",
                  "price": "7"
                }
              ],
              "sign": -1
            },
            "expected": [
              2,
              1
            ]
          }
        ],
        "starter": "function solve(input) {\n  // Write your code here.\n}\n",
        "id": "exam-bridge-project-sort",
        "revision": 4
      }
    },
    {
      "id": "exam-bridge-project-json-error-page",
      "title": "O eroare personalizată din JSON",
      "category": "server",
      "minutes": 20,
      "level": "Bilet practic",
      "hint": "render și return încheie tratarea.",
      "steps": [
        "Datele sunt în JSON.",
        "Condiția precedă răspunsul normal.",
        "status stabilește codul HTTP.",
        "render și return încheie tratarea."
      ],
      "answer": "",
      "rubric": [
        "Rezolvă cerința fără erori.",
        "Verifică și cazul opus.",
        "Explică fiecare etapă."
      ],
      "lessonId": "project-json-error-page",
      "task": {
        "mode": "express",
        "prompt": "Din errors.json și error.ejs furnizate, afișează eroarea invalidType cu status 400 pentru /products?type=unknown. Pentru /products răspunde Products cu 200.",
        "solution": "const express = require(\"express\");\nconst fs = require(\"fs\");\nconst app = express();\napp.set(\"view engine\", \"ejs\");\nconst messages = JSON.parse(fs.readFileSync(\"errors.json\", \"utf8\"));\n\napp.get(\"/products\", function (request, response) {\n  if (request.query.type === \"unknown\") {\n    response.status(400).render(\"error\", { error: messages.invalidType });\n    return;\n  }\n  response.send(\"Products\");\n});\nmodule.exports = app;",
        "requests": [
          {
            "path": "/products?type=unknown",
            "status": 400,
            "includes": "<h1>Invalid type</h1>"
          },
          {
            "path": "/products",
            "bodyExpected": "Products"
          }
        ],
        "starter": "const express = require(\"express\");\nconst app = express();\n\n// Add your routes here.\n\nmodule.exports = app;\n",
        "files": {
          "errors.json": "{\"invalidType\":{\"title\":\"Invalid type\",\"message\":\"Choose a known type.\"}}",
          "views/error.ejs": "<h1><%= error.title %></h1><p><%= error.message %></p>"
        },
        "id": "exam-bridge-project-json-error-page"
      }
    },
    {
      "id": "exam-bridge-project-pg-ejs-route",
      "title": "Din PostgreSQL până la pagina EJS",
      "category": "server",
      "minutes": 20,
      "level": "Bilet practic",
      "hint": "render construiește HTML din template.",
      "steps": [
        "GET activează ruta.",
        "SELECT citește numele; ORDER BY sortează.",
        "result.rows conține obiectele.",
        "render construiește HTML din template."
      ],
      "answer": "",
      "rubric": [
        "Rezolvă cerința fără erori.",
        "Verifică și cazul opus.",
        "Explică fiecare etapă."
      ],
      "lessonId": "project-pg-ejs-route",
      "task": {
        "mode": "express",
        "prompt": "La GET /product-names citește numele din PostgreSQL alfabetic și transmite result.rows către names.ejs ca products. Conexiunea și datele de test sunt virtuale.",
        "solution": "const express = require(\"express\");\nconst { Pool } = require(\"pg\");\nconst app = express();\nconst pool = new Pool();\napp.set(\"view engine\", \"ejs\");\n\napp.get(\"/product-names\", async function (request, response, next) {\n  try {\n    const result = await pool.query(\"SELECT name FROM products ORDER BY name\");\n    response.render(\"names\", { products: result.rows });\n  } catch (error) {\n    next(error);\n  }\n});\nmodule.exports = app;",
        "requests": [
          {
            "path": "/product-names",
            "bodyExpected": "<h1>Product names</h1>\n<ul><li>Notebook</li><li>Pen</li></ul>"
          }
        ],
        "starter": "const express = require(\"express\");\nconst app = express();\n\n// Add your routes here.\n\nmodule.exports = app;\n",
        "database": "CREATE TABLE products (name text); INSERT INTO products VALUES ('Pen'), ('Notebook');",
        "files": {
          "views/names.ejs": "<h1>Product names</h1>\n<ul><% for (const product of products) { %><li><%= product.name %></li><% } %></ul>",
          "schema.sql": "CREATE TABLE products (name text); INSERT INTO products VALUES ('Pen'), ('Notebook');"
        },
        "tables": [
          {
            "name": "products",
            "columns": [
              "name"
            ],
            "rows": [
              {
                "name": "Pen"
              },
              {
                "name": "Notebook"
              }
            ],
            "totalRows": 2
          }
        ],
        "variants": [
          {
            "label": "Alte date și escapare",
            "database": "CREATE TABLE products (name text); INSERT INTO products VALUES ('<Tea>');",
            "requests": [
              {
                "path": "/product-names",
                "includes": "<li>&lt;Tea&gt;</li>"
              }
            ]
          },
          {
            "label": "Tabel gol",
            "database": "CREATE TABLE products (name text);",
            "requests": [
              {
                "path": "/product-names",
                "includes": "<ul></ul>"
              }
            ]
          }
        ],
        "id": "exam-bridge-project-pg-ejs-route"
      }
    },
    {
      "id": "exam-css-hover-transition",
      "title": "Text dublat gradual și revenire",
      "category": "css",
      "minutes": 15,
      "level": "Bilet practic",
      "hint": "Pune transition pe regula de bază, nu numai pe :hover.",
      "steps": [
        "inline-block permite transformarea textului.",
        "Regula de bază definește durata în ambele sensuri.",
        ":hover schimbă numai transform."
      ],
      "answer": "",
      "rubric": [
        "Verifică trecerea în ambele sensuri în previzualizare.",
        "Textul își păstrează forma și se dublează."
      ],
      "lessonId": null,
      "task": {
        "mode": "css",
        "prompt": "Doar prin CSS, fă textul Welcome să devină de două ori mai mare în o secundă la hover și să revină gradual când cursorul pleacă. Păstrează HTML-ul.",
        "solution": "#welcome { display: inline-block; transition: transform 1s; }\n#welcome:hover { transform: scale(2); }",
        "fixture": "<h1><span id=\"welcome\">Welcome</span></h1>",
        "tests": [
          {
            "kind": "style",
            "selector": "#welcome",
            "name": "transition-duration",
            "value": "1s",
            "label": "`#welcome`: `transition-duration: 1s`"
          },
          {
            "kind": "style",
            "selector": "#welcome",
            "name": "display",
            "value": "inline-block",
            "label": "`#welcome`: `display: inline-block`"
          },
          {
            "kind": "cssIncludes",
            "value": "#welcome:hover",
            "label": "Există starea hover."
          },
          {
            "kind": "cssIncludes",
            "value": "scale(2)",
            "label": "Mărirea este dublă."
          }
        ],
        "starter": "",
        "id": "exam-css-hover-transition"
      }
    },
    {
      "id": "exam-css-timetable",
      "title": "Hover numai pe zi și numai pe anumite coloane",
      "category": "css",
      "minutes": 15,
      "level": "Bilet practic",
      "hint": "~ selectează frații ulteriori ai celulei cu ziua.",
      "steps": [
        "Limitează rândurile în tbody.",
        "Aplică :hover pe th, nu pe tr.",
        "Selectează celulele 2 și 4 dintre frații ulteriori."
      ],
      "answer": "",
      "rubric": [
        "Verifică manual toate cele patru zile.",
        "Pauza și ziua rămân necolorate.",
        "Hover pe altă celulă nu produce efect."
      ],
      "lessonId": null,
      "task": {
        "mode": "css",
        "prompt": "În primele trei rânduri ale tabelului, hover pe celula cu ziua colorează albastru numai Morning și Evening. Hover pe oră, pauză sau Thursday nu are efect. Nu modifica HTML-ul.",
        "solution": "#hours tbody tr:nth-child(-n+3) th:hover ~ td:nth-child(2),\n#hours tbody tr:nth-child(-n+3) th:hover ~ td:nth-child(4) {\n  background: blue;\n}",
        "fixture": "<table id=\"hours\"><thead><tr><th>Day</th><th>Morning</th><th>Break</th><th>Evening</th></tr></thead><tbody><tr><th>Monday</th><td>10-12</td><td>12-14</td><td>14-20</td></tr><tr><th>Tuesday</th><td>10-12</td><td>12-14</td><td>14-20</td></tr><tr><th>Wednesday</th><td>10-12</td><td>12-14</td><td>14-20</td></tr><tr><th>Thursday</th><td>10-12</td><td>12-14</td><td>14-20</td></tr></tbody></table>",
        "tests": [
          {
            "kind": "cssIncludes",
            "value": "th:hover",
            "label": "Starea este pe celula zilei."
          },
          {
            "kind": "cssIncludes",
            "value": "nth-child(-n+3)",
            "label": "Sunt restrânse primele trei rânduri."
          },
          {
            "kind": "cssIncludes",
            "value": "background:blue",
            "label": "Este definit albastrul."
          }
        ],
        "starter": "",
        "id": "exam-css-timetable"
      }
    },
    {
      "id": "exam-css-columns-counter",
      "title": "Două coloane și numere generate prin CSS",
      "category": "css",
      "minutes": 15,
      "level": "Bilet practic",
      "hint": "Trei rânduri și grid-auto-flow: column păstrează primele trei elemente pe aceeași coloană.",
      "steps": [
        "Definește cele trei rânduri.",
        "Lasă Grid să umple coloana înainte de următoarea.",
        "Resetează contorul, incrementează-l și afișează-l în ::after."
      ],
      "answer": "",
      "rubric": [
        "Ordinea vizuală este 1–3 la stânga și 4–6 la dreapta.",
        "Numerotarea este generată, nu adăugată în HTML."
      ],
      "lessonId": null,
      "task": {
        "mode": "css",
        "prompt": "Aranjează cele șase elemente în două coloane, primele trei pe coloana stângă. După fiecare text generează numărul între paranteze prin CSS, fără tabel sau numere scrise în HTML.",
        "solution": "#topics { display: grid; grid-template-rows: repeat(3, auto); grid-auto-flow: column; counter-reset: topic; }\n#topics li { counter-increment: topic; }\n#topics li::after { content: \" (\" counter(topic) \")\"; }",
        "fixture": "<ol id=\"topics\"><li>HTML</li><li>CSS</li><li>JavaScript</li><li>Node</li><li>EJS</li><li>SQL</li></ol>",
        "tests": [
          {
            "kind": "style",
            "selector": "#topics",
            "name": "grid-auto-flow",
            "value": "column",
            "label": "`#topics`: `grid-auto-flow: column`"
          },
          {
            "kind": "cssIncludes",
            "value": "counter-increment:topic",
            "label": "Numerotarea folosește contor."
          },
          {
            "kind": "pseudo",
            "selector": "#topics li",
            "pseudo": "::after",
            "name": "content",
            "includes": "counter",
            "label": "Numărul este generat în pseudo-element."
          }
        ],
        "starter": "",
        "id": "exam-css-columns-counter"
      }
    },
    {
      "id": "exam-client-description",
      "title": "Un filtru nou pentru descriere",
      "category": "client",
      "minutes": 15,
      "level": "Bilet practic",
      "hint": "dataset.description citește data-description. Șirul gol este inclus în orice text.",
      "steps": [
        "Citește termenul la click.",
        "Normalizează termenul și descrierea la fel.",
        "Schimbă hidden pentru fiecare articol."
      ],
      "answer": "",
      "rubric": [
        "Nu confunda textul numelui cu descrierea.",
        "Filtrul gol și literele mari funcționează."
      ],
      "lessonId": null,
      "task": {
        "mode": "dom",
        "prompt": "La click pe Filter păstrează articolele a căror descriere conține termenul introdus, fără diferențe de majuscule și ignorând spațiile de la capete. Termenul gol afișează tot.",
        "solution": "document.querySelector(\"#filter\").onclick = function () {\n  const term = document.querySelector(\"#description\").value.trim().toLowerCase();\n  for (const card of document.querySelectorAll(\"article\")) {\n    const description = card.dataset.description.toLowerCase();\n    card.hidden = !description.includes(term);\n  }\n};",
        "fixture": "<label>Description <input id=\"description\"></label><button id=\"filter\">Filter</button><article id=\"first\" data-description=\"Blue paper notebook\">Notebook</article><article id=\"second\" data-description=\"Black ink pen\">Pen</article>",
        "tests": [
          {
            "kind": "style",
            "selector": "#first",
            "name": "display",
            "value": "block",
            "label": "`#first`: `display: block`"
          },
          {
            "kind": "style",
            "selector": "#second",
            "name": "display",
            "value": "none",
            "label": "`#second`: `display: none`"
          }
        ],
        "actions": [
          {
            "type": "fill",
            "selector": "#description",
            "value": " BLUE "
          },
          {
            "type": "click",
            "selector": "#filter"
          }
        ],
        "starter": "",
        "variants": [
          {
            "label": "Filtru gol",
            "actions": [
              {
                "type": "click",
                "selector": "#filter"
              }
            ],
            "tests": [
              {
                "kind": "style",
                "selector": "#first",
                "name": "display",
                "value": "block",
                "label": "`#first`: `display: block`"
              },
              {
                "kind": "style",
                "selector": "#second",
                "name": "display",
                "value": "block",
                "label": "`#second`: `display: block`"
              }
            ]
          },
          {
            "label": "Altă descriere",
            "actions": [
              {
                "type": "fill",
                "selector": "#description",
                "value": "ink"
              },
              {
                "type": "click",
                "selector": "#filter"
              }
            ],
            "tests": [
              {
                "kind": "style",
                "selector": "#first",
                "name": "display",
                "value": "none",
                "label": "`#first`: `display: none`"
              },
              {
                "kind": "style",
                "selector": "#second",
                "name": "display",
                "value": "block",
                "label": "`#second`: `display: block`"
              }
            ]
          }
        ],
        "id": "exam-client-description"
      }
    },
    {
      "id": "exam-client-slider-storage",
      "title": "Slider, culoare și contor după reîncărcare",
      "category": "client",
      "minutes": 15,
      "level": "Bilet practic",
      "hint": "Citește contorul o dată pentru paragraf. La input salvează separat noua valoare.",
      "steps": [
        "Citirea inițială actualizează paragraful.",
        "updateValue schimbă numai output.",
        "Evenimentul input incrementează stocarea virtuală."
      ],
      "answer": "",
      "rubric": [
        "La prima vizită contorul pornește de la zero.",
        "Valoarea salvată se schimbă, paragraful rămâne fix.",
        "Reîncărcarea citește noul total."
      ],
      "lessonId": null,
      "task": {
        "mode": "dom",
        "prompt": "Afișează valoarea sliderului îngroșat, roșie peste mijloc și neagră în rest. La fiecare input crește priceChanges în localStorage. Paragraful Previous changes afișează doar valoarea citită la încărcare, fără actualizare în timp ce muți sliderul.",
        "solution": "const slider = document.querySelector(\"#price\");\nconst output = document.querySelector(\"#value\");\nconst previous = Number(localStorage.getItem(\"priceChanges\") || \"0\");\ndocument.querySelector(\"#previous\").textContent = \"Previous changes: \" + previous;\nfunction updateValue() {\n  const value = Number(slider.value);\n  output.textContent = slider.value;\n  output.style.fontWeight = \"bold\";\n  output.style.color = value > (Number(slider.min) + Number(slider.max)) / 2 ? \"red\" : \"black\";\n}\nupdateValue();\nslider.addEventListener(\"input\", function () {\n  const total = Number(localStorage.getItem(\"priceChanges\") || \"0\");\n  localStorage.setItem(\"priceChanges\", String(total + 1));\n  updateValue();\n});",
        "fixture": "<input id=\"price\" type=\"range\" min=\"0\" max=\"100\" value=\"0\"><output id=\"value\"></output><p id=\"previous\"></p>",
        "tests": [
          {
            "kind": "text",
            "selector": "#value",
            "value": "90",
            "label": "`#value` afișează `90`"
          },
          {
            "kind": "style",
            "selector": "#value",
            "name": "font-weight",
            "value": "700",
            "label": "`#value`: `font-weight: 700`"
          },
          {
            "kind": "style",
            "selector": "#value",
            "name": "color",
            "value": "rgb(255, 0, 0)",
            "label": "`#value`: `color: rgb(255, 0, 0)`"
          },
          {
            "kind": "text",
            "selector": "#previous",
            "value": "Previous changes: 3",
            "label": "`#previous` afișează `Previous changes: 3`"
          },
          {
            "kind": "storage",
            "key": "priceChanges",
            "value": "5",
            "label": "Două evenimente au incrementat contorul."
          }
        ],
        "actions": [
          {
            "type": "fill",
            "selector": "#price",
            "value": "40"
          },
          {
            "type": "fill",
            "selector": "#price",
            "value": "90"
          }
        ],
        "starter": "",
        "storage": {
          "priceChanges": "3"
        },
        "variants": [
          {
            "label": "După reîncărcare",
            "storage": {
              "priceChanges": "5"
            },
            "actions": [],
            "tests": [
              {
                "kind": "text",
                "selector": "#previous",
                "value": "Previous changes: 5",
                "label": "`#previous` afișează `Previous changes: 5`"
              },
              {
                "kind": "style",
                "selector": "#value",
                "name": "color",
                "value": "rgb(0, 0, 0)",
                "label": "`#value`: `color: rgb(0, 0, 0)`"
              }
            ]
          }
        ],
        "id": "exam-client-slider-storage"
      }
    },
    {
      "id": "exam-client-radio-storage",
      "title": "Grup radio, filtrare și ultima opțiune",
      "category": "client",
      "minutes": 15,
      "level": "Bilet practic",
      "hint": "Folosește același name numai pentru cele patru opțiuni de produse.",
      "steps": [
        "Citește preferința la încărcare.",
        "La click citește opțiunea :checked.",
        "Aplică condiția și salvează alegerea."
      ],
      "answer": "",
      "rubric": [
        "Grupurile nu se influențează.",
        "all afișează toate articolele.",
        "Marcajul se face la încărcare."
      ],
      "lessonId": null,
      "task": {
        "mode": "dom",
        "prompt": "La Filter afișează tipul selectat sau toate articolele pentru all. Salvează alegerea sub productType. La încărcare marchează cu border albastru eticheta opțiunii salvate. Nu schimba grupul radio other.",
        "solution": "const saved = localStorage.getItem(\"productType\");\nfor (const option of document.querySelectorAll('input[name=\"productType\"]')) {\n  if (option.value === saved) option.parentElement.style.border = \"2px solid blue\";\n}\ndocument.querySelector(\"#filter\").onclick = function () {\n  const selected = document.querySelector('input[name=\"productType\"]:checked').value;\n  localStorage.setItem(\"productType\", selected);\n  for (const card of document.querySelectorAll(\"article\")) {\n    card.hidden = selected !== \"all\" && card.dataset.type !== selected;\n  }\n};",
        "fixture": "<fieldset><label><input type=\"radio\" name=\"productType\" value=\"books\">books</label><label><input type=\"radio\" name=\"productType\" value=\"stationery\">stationery</label><label><input type=\"radio\" name=\"productType\" value=\"accessories\">accessories</label><label><input type=\"radio\" name=\"productType\" value=\"all\" checked>all</label></fieldset><input type=\"radio\" name=\"other\" checked><button id=\"filter\">Filter</button><article id=\"book\" data-type=\"books\">Book</article><article id=\"pen\" data-type=\"stationery\">Pen</article>",
        "tests": [
          {
            "kind": "style",
            "selector": "#book",
            "name": "display",
            "value": "none",
            "label": "`#book`: `display: none`"
          },
          {
            "kind": "style",
            "selector": "#pen",
            "name": "display",
            "value": "block",
            "label": "`#pen`: `display: block`"
          },
          {
            "kind": "count",
            "selector": "input[name=\"other\"]:checked",
            "min": 1,
            "label": "Elementul `input[name=\"other\"]:checked` există"
          },
          {
            "kind": "storage",
            "key": "productType",
            "value": "stationery",
            "label": "Alegerea este salvată."
          }
        ],
        "actions": [
          {
            "type": "check",
            "selector": "input[value=\"stationery\"]",
            "checked": true
          },
          {
            "type": "click",
            "selector": "#filter"
          }
        ],
        "starter": "",
        "variants": [
          {
            "label": "Opțiune salvată",
            "storage": {
              "productType": "books"
            },
            "actions": [],
            "tests": [
              {
                "kind": "style",
                "selector": "input[value=\"books\"]",
                "name": "display",
                "value": "inline-block",
                "label": "`input[value=\"books\"]`: `display: inline-block`"
              },
              {
                "kind": "style",
                "selector": "label:has(input[value=\"books\"])",
                "name": "border-top-color",
                "value": "rgb(0, 0, 255)",
                "label": "`label:has(input[value=\"books\"])`: `border-top-color: rgb(0, 0, 255)`"
              }
            ]
          }
        ],
        "id": "exam-client-radio-storage"
      }
    },
    {
      "id": "exam-server-gallery-periods",
      "title": "Galerie JSON filtrată pe intervale de minute",
      "category": "server",
      "minutes": 20,
      "level": "Bilet practic",
      "hint": "Calculează intervalul o dată. Verifică existența vectorului înainte de includes.",
      "steps": [
        "Citește și parsează JSON.",
        "Calculează perioada din minute.",
        "Filtrează lista fără să modifici datele.",
        "Oferă lista către EJS."
      ],
      "answer": "",
      "rubric": [
        "Minutele 0,19,20,39,40,59 sunt corecte.",
        "always și lipsa proprietății sunt tratate."
      ],
      "lessonId": null,
      "task": {
        "mode": "express",
        "prompt": "La /gallery citește gallery.json. Folosește minutele UTC ale timpului curent: [0,20) start, [20,40) middle, [40,60) end. always se afișează mereu. Lipsa periods exclude imaginea. Randează gallery.ejs. Sunt verificate granițele intervalelor.",
        "solution": "const express = require(\"express\");\nconst fs = require(\"fs\");\nconst app = express();\napp.set(\"view engine\", \"ejs\");\napp.get(\"/gallery\", function (request, response) {\n  const data = JSON.parse(fs.readFileSync(\"gallery.json\", \"utf8\"));\n  const minute = new Date().getUTCMinutes();\n  let period = \"end\";\n  if (minute < 20) period = \"start\";\n  else if (minute < 40) period = \"middle\";\n  const images = data.images.filter(function (image) {\n    return Array.isArray(image.periods) &&\n      (image.periods.includes(\"always\") || image.periods.includes(period));\n  });\n  response.render(\"gallery\", { images: images });\n});\nmodule.exports = app;",
        "requests": [
          {
            "path": "/gallery",
            "bodyExpected": "<h1>Gallery</h1><ul><li>First</li><li>Always</li></ul>"
          }
        ],
        "starter": "const express = require(\"express\");\nconst app = express();\n\n// Add your routes here.\n\nmodule.exports = app;\n",
        "files": {
          "gallery.json": "{\"images\": [{\"name\": \"First\", \"periods\": [\"start\"]}, {\"name\": \"Middle\", \"periods\": [\"middle\"]}, {\"name\": \"Last\", \"periods\": [\"end\"]}, {\"name\": \"Always\", \"periods\": [\"always\"]}, {\"name\": \"Hidden\"}]}",
          "views/gallery.ejs": "<h1>Gallery</h1><ul><% for (const image of images) { %><li><%= image.name %></li><% } %></ul>"
        },
        "now": "2026-10-25T10:00:00Z",
        "variants": [
          {
            "label": "Minutul 19",
            "now": "2026-10-25T10:19:00Z",
            "requests": [
              {
                "path": "/gallery",
                "bodyExpected": "<h1>Gallery</h1><ul><li>First</li><li>Always</li></ul>"
              }
            ]
          },
          {
            "label": "Minutul 20",
            "now": "2026-10-25T10:20:00Z",
            "requests": [
              {
                "path": "/gallery",
                "bodyExpected": "<h1>Gallery</h1><ul><li>Middle</li><li>Always</li></ul>"
              }
            ]
          },
          {
            "label": "Minutul 39",
            "now": "2026-10-25T10:39:00Z",
            "requests": [
              {
                "path": "/gallery",
                "bodyExpected": "<h1>Gallery</h1><ul><li>Middle</li><li>Always</li></ul>"
              }
            ]
          },
          {
            "label": "Minutul 40",
            "now": "2026-10-25T10:40:00Z",
            "requests": [
              {
                "path": "/gallery",
                "bodyExpected": "<h1>Gallery</h1><ul><li>Last</li><li>Always</li></ul>"
              }
            ]
          },
          {
            "label": "Minutul 59",
            "now": "2026-10-25T10:59:00Z",
            "requests": [
              {
                "path": "/gallery",
                "bodyExpected": "<h1>Gallery</h1><ul><li>Last</li><li>Always</li></ul>"
              }
            ]
          }
        ],
        "id": "exam-server-gallery-periods"
      }
    },
    {
      "id": "exam-server-vowel-errors",
      "title": "Erori din JSON cu peste șapte vocale",
      "category": "server",
      "minutes": 20,
      "level": "Bilet practic",
      "hint": "match poate întoarce null; tratează acest caz ca zero potriviri.",
      "steps": [
        "Citește errors.json.",
        "Numără numai în message.",
        "Păstrează strict peste 7.",
        "Randează ol cu id și mesaj."
      ],
      "answer": "",
      "rubric": [
        "Exact 7 este exclus.",
        "Lipsa vocalelor nu produce eroare.",
        "Titlul nu intră în numărătoare."
      ],
      "lessonId": null,
      "task": {
        "mode": "express",
        "prompt": "La /vowel-errors afișează o listă ordonată cu id și message pentru erorile cu mai mult de 7 vocale în message. Nu număra vocalele din title. Consideră vocalele engleze a,e,i,o,u fără diferență de majuscule.",
        "solution": "const express = require(\"express\");\nconst fs = require(\"fs\");\nconst app = express();\napp.set(\"view engine\", \"ejs\");\napp.get(\"/vowel-errors\", function (request, response) {\n  const data = JSON.parse(fs.readFileSync(\"errors.json\", \"utf8\"));\n  const errors = data.errors.filter(function (error) {\n    const matches = error.message.match(/[aeiou]/gi);\n    return (matches ? matches.length : 0) > 7;\n  });\n  response.render(\"errors\", { errors: errors });\n});\nmodule.exports = app;",
        "requests": [
          {
            "path": "/vowel-errors",
            "bodyExpected": "<h1>Vowel errors</h1><ol><li>3: AEIOUaei</li></ol>"
          }
        ],
        "starter": "const express = require(\"express\");\nconst app = express();\n\n// Add your routes here.\n\nmodule.exports = app;\n",
        "files": {
          "errors.json": "{\"errors\": [{\"id\": 1, \"title\": \"AEIOUAEIOU\", \"message\": \"rhythm\"}, {\"id\": 2, \"title\": \"No\", \"message\": \"aeiouae\"}, {\"id\": 3, \"title\": \"No\", \"message\": \"AEIOUaei\"}]}",
          "views/errors.ejs": "<h1>Vowel errors</h1><ol><% for (const error of errors) { %><li><%= error.id %>: <%= error.message %></li><% } %></ol>"
        },
        "id": "exam-server-vowel-errors"
      }
    },
    {
      "id": "exam-server-offers-time",
      "title": "Oferte, time și evidențiere condiționată",
      "category": "server",
      "minutes": 20,
      "level": "Bilet practic",
      "hint": "Lunile încep de la indexul 0. Separă formatul vizibil de atributul datetime.",
      "steps": [
        "Construiește obiectul Date.",
        "Folosește luna ca index în months.",
        "Păstrează timpul complet în datetime.",
        "Testează Attention pe întregul text."
      ],
      "answer": "",
      "rubric": [
        "Luna vine din vector.",
        "Nu se îngroașă doar cuvântul Attention.",
        "Data vizibilă nu include ora."
      ],
      "lessonId": null,
      "task": {
        "mode": "ejs",
        "prompt": "Afișează ofertele în ul. Data, fără oră, apare roșie în time, folosind vectorul months. datetime include timpul ISO. Îngroașă tot textul doar dacă include Attention case-sensitive. Exemplele de antrenament au texte în engleză.",
        "solution": "<ul>\n<% for (const offer of offers) {\n  const date = new Date(offer.date);\n  const label = date.getUTCDate() + \" \" + months[date.getUTCMonth()] + \" \" + date.getUTCFullYear();\n%>\n  <li><time datetime=\"<%= date.toISOString() %>\" style=\"color:red\"><%= label %></time>\n  <% if (offer.text.includes(\"Attention\")) { %><strong><%= offer.text %></strong><% } else { %><span><%= offer.text %></span><% } %></li>\n<% } %>\n</ul>",
        "data": {
          "months": [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
          ],
          "offers": [
            {
              "date": "2026-10-25T09:30:00Z",
              "text": "Attention: new stock"
            },
            {
              "date": "2026-01-02T11:00:00Z",
              "text": "Regular offer"
            }
          ]
        },
        "tests": [
          {
            "kind": "text",
            "selector": "time",
            "value": "25 October 2026",
            "label": "`time` afișează `25 October 2026`"
          },
          {
            "kind": "attr",
            "selector": "time",
            "name": "datetime",
            "value": "2026-10-25T09:30:00.000Z",
            "label": "`time` are `datetime=\"2026-10-25T09:30:00.000Z\"`"
          },
          {
            "kind": "style",
            "selector": "time",
            "name": "color",
            "value": "rgb(255, 0, 0)",
            "label": "`time`: `color: rgb(255, 0, 0)`"
          },
          {
            "kind": "text",
            "selector": "strong",
            "value": "Attention: new stock",
            "label": "`strong` afișează `Attention: new stock`"
          },
          {
            "kind": "text",
            "selector": "li:nth-child(2) span",
            "value": "Regular offer",
            "label": "`li:nth-child(2) span` afișează `Regular offer`"
          }
        ],
        "starter": "",
        "partials": {},
        "variants": [
          {
            "label": "Lista goală",
            "data": {
              "months": [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December"
              ],
              "offers": []
            },
            "tests": [
              {
                "kind": "absent",
                "selector": "li",
                "label": "Lista nu are oferte."
              }
            ]
          },
          {
            "label": "Diferență de majuscule",
            "data": {
              "months": [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December"
              ],
              "offers": [
                {
                  "date": "2026-01-02T11:00:00Z",
                  "text": "attention: ordinary text"
                }
              ]
            },
            "tests": [
              {
                "kind": "text",
                "selector": "li span",
                "value": "attention: ordinary text",
                "label": "`li span` afișează `attention: ordinary text`"
              },
              {
                "kind": "absent",
                "selector": "strong",
                "label": "Nu îngroașă attention cu literă mică."
              }
            ]
          }
        ],
        "id": "exam-server-offers-time"
      }
    },
    {
      "id": "exam-server-clock-folder",
      "title": "Ora serverului și director cu timestamp",
      "category": "server",
      "minutes": 20,
      "level": "Bilet practic",
      "hint": "Date folosește milisecunde; împarte la 1000 și aplică Math.floor pentru secunde.",
      "steps": [
        "Citește timpul la fiecare cerere.",
        "Calculează perioada.",
        "Creează directorul numai pe ruta cerută.",
        "Păstrează fragmentele comune."
      ],
      "answer": "",
      "rubric": [
        "Formatul include zerouri.",
        "Timestamp-ul are secunde.",
        "Pagina păstrează antetul și subsolul."
      ],
      "lessonId": null,
      "task": {
        "mode": "express",
        "prompt": "Creează /server-time și /server-time/folder. Afișează ora UTC HH:mm:ss și Start pentru minute [0,20), Middle pentru [20,40), End pentru [40,60). Numai ruta cu folder creează temp/<timestamp în secunde>. Folosește template-ul cu header/footer furnizat.",
        "solution": "const express = require(\"express\");\nconst fs = require(\"fs\");\nconst app = express();\napp.set(\"view engine\", \"ejs\");\nfunction showTime(request, response) {\n  const now = new Date();\n  const minute = now.getUTCMinutes();\n  const period = minute < 20 ? \"Start\" : minute < 40 ? \"Middle\" : \"End\";\n  if (request.path.endsWith(\"/folder\")) {\n    fs.mkdirSync(\"temp/\" + Math.floor(now.getTime() / 1000), { recursive: true });\n  }\n  response.render(\"clock\", { time: now.toISOString().slice(11, 19), period: period });\n}\napp.get(\"/server-time\", showTime);\napp.get(\"/server-time/folder\", showTime);\nmodule.exports = app;",
        "requests": [
          {
            "path": "/server-time",
            "includes": "10:20:30",
            "fileAbsent": "temp/1792923630"
          },
          {
            "path": "/server-time/folder",
            "includes": "Middle",
            "fileExists": "temp/1792923630"
          }
        ],
        "starter": "const express = require(\"express\");\nconst app = express();\n\n// Add your routes here.\n\nmodule.exports = app;\n",
        "now": "2026-10-25T10:20:30Z",
        "files": {
          "views/clock.ejs": "<%- include(\"header\") %><h1>Server time</h1><p><%= time %> - <%= period %></p><%- include(\"footer\") %>",
          "views/header.ejs": "<header>Catalog</header>",
          "views/footer.ejs": "<footer>Contact</footer>"
        },
        "id": "exam-server-clock-folder"
      }
    },
    {
      "id": "exam-transfer-reason-cascade",
      "title": "de ce nu câștigă ultima regulă?",
      "category": "css",
      "minutes": 15,
      "level": "Raționament",
      "hint": "Ce compari înaintea ordinii?",
      "steps": [
        "Selectorul cu ID are specificitate mai mare. O excepție locală poate folosi aceeași specificitate și poate apărea după regula inițială, fără important.",
        "Aplicarea important peste tot poate ascunde cauza fără să explice cascada."
      ],
      "answer": "",
      "rubric": [
        "De ce o simplă regulă .urgent poate pierde?",
        "Ce compari înaintea ordinii?"
      ],
      "lessonId": "reason-cascade",
      "task": {
        "mode": "css",
        "prompt": "Păstrează regulile de pornire și adaugă o excepție fără !important: numai .urgent din #panel devine roșie; nota obișnuită rămâne navy.",
        "solution": "#panel .note { color: navy; }\n.note { color: black; }\n#panel .urgent { color: red; }",
        "fixture": "<div id=\"panel\"><p class=\"note\">Normal</p><p class=\"note urgent\">Urgent</p></div>",
        "tests": [
          {
            "kind": "style",
            "selector": ".note:not(.urgent)",
            "name": "color",
            "value": "rgb(0, 0, 128)",
            "label": "`.note:not(.urgent)`: `color: rgb(0, 0, 128)`"
          },
          {
            "kind": "style",
            "selector": ".urgent",
            "name": "color",
            "value": "rgb(255, 0, 0)",
            "label": "`.urgent`: `color: rgb(255, 0, 0)`"
          }
        ],
        "starter": "#panel .note { color: navy; }\n.note { color: black; }\n",
        "id": "exam-transfer-reason-cascade"
      },
      "reasoning": {
        "prerequisites": [
          "css-specificity",
          "css-inherit"
        ],
        "questions": [
          "De ce o simplă regulă .urgent poate pierde?",
          "Ce compari înaintea ordinii?"
        ],
        "explanation": "Selectorul cu ID are specificitate mai mare. O excepție locală poate folosi aceeași specificitate și poate apărea după regula inițială, fără important.",
        "counterexample": "Aplicarea important peste tot poate ascunde cauza fără să explice cascada."
      }
    },
    {
      "id": "exam-transfer-reason-selector",
      "title": "combină condițiile fără selectări în plus",
      "category": "css",
      "minutes": 15,
      "level": "Raționament",
      "hint": "Poți explica fiecare segment al selectorului?",
      "steps": [
        "> cere copil direct; atributul verifică starea; :not exclude clasa. Spațiul în loc de > poate include descendenți nedoriți.",
        "Un selector prea larg ar colora și prețul 9 din containerul intermediar."
      ],
      "answer": "",
      "rubric": [
        "Unde este necesar copil direct?",
        "Ce condiție exclude fiecare element apropiat?",
        "Poți explica fiecare segment al selectorului?"
      ],
      "lessonId": "reason-selector",
      "task": {
        "mode": "css",
        "prompt": "Colorează navy numai prețul 12. Celelalte patru prețuri rămân negre. Nu modifica HTML-ul și nu selecta după textul numărului.",
        "solution": ".price { color: black; }\n#catalog > article[data-state=\"ready\"]:not(.featured) > .price { color: navy; }",
        "fixture": "<main id=\"catalog\"><article data-state=\"ready\"><p class=\"price\">12</p></article><article data-state=\"ready\" class=\"featured\"><p class=\"price\">20</p></article><article data-state=\"draft\"><p class=\"price\">5</p></article><div><article data-state=\"ready\"><p class=\"price\">9</p></article></div></main><aside><p class=\"price\">7</p></aside>",
        "tests": [
          {
            "kind": "style",
            "selector": "#catalog > article:first-child .price",
            "name": "color",
            "value": "rgb(0, 0, 128)",
            "label": "`#catalog > article:first-child .price`: `color: rgb(0, 0, 128)`"
          },
          {
            "kind": "style",
            "selector": ".featured .price",
            "name": "color",
            "value": "rgb(0, 0, 0)",
            "label": "`.featured .price`: `color: rgb(0, 0, 0)`"
          },
          {
            "kind": "style",
            "selector": "[data-state=\"draft\"] .price",
            "name": "color",
            "value": "rgb(0, 0, 0)",
            "label": "`[data-state=\"draft\"] .price`: `color: rgb(0, 0, 0)`"
          },
          {
            "kind": "style",
            "selector": "#catalog > div .price",
            "name": "color",
            "value": "rgb(0, 0, 0)",
            "label": "`#catalog > div .price`: `color: rgb(0, 0, 0)`"
          },
          {
            "kind": "style",
            "selector": "aside .price",
            "name": "color",
            "value": "rgb(0, 0, 0)",
            "label": "`aside .price`: `color: rgb(0, 0, 0)`"
          }
        ],
        "starter": "",
        "id": "exam-transfer-reason-selector"
      },
      "reasoning": {
        "prerequisites": [
          "css-descendant",
          "css-attributes",
          "selector-not"
        ],
        "questions": [
          "Unde este necesar copil direct?",
          "Ce condiție exclude fiecare element apropiat?",
          "Poți explica fiecare segment al selectorului?"
        ],
        "explanation": "> cere copil direct; atributul verifică starea; :not exclude clasa. Spațiul în loc de > poate include descendenți nedoriți.",
        "counterexample": "Un selector prea larg ar colora și prețul 9 din containerul intermediar."
      }
    },
    {
      "id": "exam-transfer-reason-nth-type",
      "title": "a doua poziție dintre ce elemente?",
      "category": "css",
      "minutes": 15,
      "level": "Raționament",
      "hint": "Ce se schimbă dacă apare încă un titlu?",
      "steps": [
        "Titlul și aside intră în numărătoarea tuturor copiilor, dar nu în numărătoarea paragrafelor.",
        "p:nth-child(2) ar colora First în structura dată."
      ],
      "answer": "",
      "rubric": [
        "Numeri toți frații sau numai paragrafele?",
        "Ce se schimbă dacă apare încă un titlu?"
      ],
      "lessonId": "reason-nth-type",
      "task": {
        "mode": "css",
        "prompt": "Colorează navy numai paragraful Second. First și Third trebuie să rămână negre.",
        "solution": "#notes p { color: black; }\n#notes > p:nth-of-type(2) { color: navy; }",
        "fixture": "<section id=\"notes\"><h2>Notes</h2><p>First</p><aside>Extra</aside><p>Second</p><p>Third</p></section>",
        "tests": [
          {
            "kind": "style",
            "selector": "#notes p:nth-of-type(1)",
            "name": "color",
            "value": "rgb(0, 0, 0)",
            "label": "`#notes p:nth-of-type(1)`: `color: rgb(0, 0, 0)`"
          },
          {
            "kind": "style",
            "selector": "#notes p:nth-of-type(2)",
            "name": "color",
            "value": "rgb(0, 0, 128)",
            "label": "`#notes p:nth-of-type(2)`: `color: rgb(0, 0, 128)`"
          },
          {
            "kind": "style",
            "selector": "#notes p:nth-of-type(3)",
            "name": "color",
            "value": "rgb(0, 0, 0)",
            "label": "`#notes p:nth-of-type(3)`: `color: rgb(0, 0, 0)`"
          }
        ],
        "starter": "",
        "id": "exam-transfer-reason-nth-type"
      },
      "reasoning": {
        "prerequisites": [
          "selector-nth-type",
          "selector-nth-even"
        ],
        "questions": [
          "Numeri toți frații sau numai paragrafele?",
          "Ce se schimbă dacă apare încă un titlu?"
        ],
        "explanation": "Titlul și aside intră în numărătoarea tuturor copiilor, dar nu în numărătoarea paragrafelor.",
        "counterexample": "p:nth-child(2) ar colora First în structura dată."
      }
    },
    {
      "id": "exam-transfer-reason-box",
      "title": "de ce depășește cardul containerul?",
      "category": "css",
      "minutes": 15,
      "level": "Raționament",
      "hint": "Poți calcula dimensiunea exterioară înainte de corecție?",
      "steps": [
        "Într-un container de 300px, un card content-box de 100% cu 40px padding și 10px bordură poate avea exteriorul de 350px.",
        "overflow:hidden poate tăia textul, fără să corecteze dimensiunea cardului."
      ],
      "answer": "",
      "rubric": [
        "Ce include width în fiecare model?",
        "Poți calcula dimensiunea exterioară înainte de corecție?"
      ],
      "lessonId": "reason-box",
      "task": {
        "mode": "css",
        "prompt": "Containerul are 300px. Include padding 20px și bordură 5px în lățimea de 100% a cardului, fără să ascunzi conținutul.",
        "solution": "#container { width: 300px; }\n.card { width: 100%; padding: 20px; border: 5px solid navy; box-sizing: border-box; }",
        "fixture": "<div id=\"container\"><article class=\"card\">Details</article></div>",
        "tests": [
          {
            "kind": "style",
            "selector": ".card",
            "name": "box-sizing",
            "value": "border-box",
            "label": "`.card`: `box-sizing: border-box`"
          },
          {
            "kind": "style",
            "selector": ".card",
            "name": "width",
            "value": "300px",
            "label": "`.card`: `width: 300px`"
          },
          {
            "kind": "style",
            "selector": ".card",
            "name": "padding-left",
            "value": "20px",
            "label": "`.card`: `padding-left: 20px`"
          },
          {
            "kind": "style",
            "selector": ".card",
            "name": "border-left-width",
            "value": "5px",
            "label": "`.card`: `border-left-width: 5px`"
          }
        ],
        "starter": "",
        "id": "exam-transfer-reason-box"
      },
      "reasoning": {
        "prerequisites": [
          "css-box",
          "css-responsive"
        ],
        "questions": [
          "Ce include width în fiecare model?",
          "Poți calcula dimensiunea exterioară înainte de corecție?"
        ],
        "explanation": "Într-un container de 300px, un card content-box de 100% cu 40px padding și 10px bordură poate avea exteriorul de 350px.",
        "counterexample": "overflow:hidden poate tăia textul, fără să corecteze dimensiunea cardului."
      }
    },
    {
      "id": "exam-transfer-reason-grid-boundary",
      "title": "verifică ambele părți ale limitei",
      "category": "css",
      "minutes": 15,
      "level": "Raționament",
      "hint": "Ce regulă trebuie să câștige la 501px?",
      "steps": [
        "max-width include valoarea de 500px; regula de bază rămâne activă la 501px. Coloanele sunt egale prin 1fr.",
        "Un layout poate părea corect într-o singură captură și să fie greșit imediat lângă prag."
      ],
      "answer": "",
      "rubric": [
        "Ce înseamnă inclusiv la limită?",
        "Ce regulă trebuie să câștige la 501px?"
      ],
      "lessonId": "reason-grid-boundary",
      "task": {
        "mode": "css",
        "prompt": "Afișează două coloane egale la 800px și 501px, dar o coloană la 500px și 390px.",
        "solution": ".cards { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }\n@media (max-width: 500px) { .cards { grid-template-columns: 1fr; } }",
        "fixture": "<div class=\"cards\"><article>One</article><article>Two</article><article>Three</article></div>",
        "tests": [
          {
            "kind": "columns",
            "selector": ".cards",
            "count": 2,
            "viewport": 800,
            "label": "La 800px, `.cards` are 2 coloane egale"
          },
          {
            "kind": "columns",
            "selector": ".cards",
            "count": 2,
            "viewport": 501,
            "label": "La 501px, `.cards` are 2 coloane egale"
          },
          {
            "kind": "columns",
            "selector": ".cards",
            "count": 1,
            "viewport": 500,
            "label": "La 500px, `.cards` are 1 coloane egale"
          },
          {
            "kind": "columns",
            "selector": ".cards",
            "count": 1,
            "viewport": 390,
            "label": "La 390px, `.cards` are 1 coloane egale"
          }
        ],
        "starter": "",
        "id": "exam-transfer-reason-grid-boundary"
      },
      "reasoning": {
        "prerequisites": [
          "css-grid",
          "css-responsive"
        ],
        "questions": [
          "Ce înseamnă inclusiv la limită?",
          "Ce regulă trebuie să câștige la 501px?"
        ],
        "explanation": "max-width include valoarea de 500px; regula de bază rămâne activă la 501px. Coloanele sunt egale prin 1fr.",
        "counterexample": "Un layout poate părea corect într-o singură captură și să fie greșit imediat lângă prag."
      }
    },
    {
      "id": "exam-transfer-reason-conversion",
      "title": "numere care vin ca texte",
      "category": "client",
      "minutes": 15,
      "level": "Raționament",
      "hint": "Ce ar produce + fără conversie?",
      "steps": [
        "+ poate concatena texte. Conversia rezultatului concatenării este prea târzie.",
        "Number(\"10\" + \"2\") produce 102, nu 12."
      ],
      "answer": "",
      "rubric": [
        "Ce tip au valorile înaintea operației?",
        "Ce ar produce + fără conversie?"
      ],
      "lessonId": "reason-conversion",
      "task": {
        "mode": "js",
        "prompt": "input are price și fee ca texte. Returnează suma numerică fără să modifici input.",
        "solution": "function solve(input) { return Number(input.price) + Number(input.fee); }",
        "cases": [
          {
            "input": {
              "price": "10",
              "fee": "2"
            },
            "expected": 12
          },
          {
            "input": {
              "price": "0",
              "fee": "5"
            },
            "expected": 5
          },
          {
            "input": {
              "price": "2.5",
              "fee": "0.5"
            },
            "expected": 3
          },
          {
            "input": {
              "price": "-2",
              "fee": "3"
            },
            "expected": 1
          }
        ],
        "starter": "function solve(input) {\n  // Write your code here.\n}\n",
        "id": "exam-transfer-reason-conversion"
      },
      "reasoning": {
        "prerequisites": [
          "js-convert",
          "js-if"
        ],
        "questions": [
          "Ce tip au valorile înaintea operației?",
          "Ce ar produce + fără conversie?"
        ],
        "explanation": "+ poate concatena texte. Conversia rezultatului concatenării este prea târzie.",
        "counterexample": "Number(\"10\" + \"2\") produce 102, nu 12."
      }
    },
    {
      "id": "exam-transfer-reason-zero",
      "title": "zero nu este absență",
      "category": "client",
      "minutes": 15,
      "level": "Raționament",
      "hint": "Care valori activează fiecare operator?",
      "steps": [
        "?? folosește alternativa numai pentru null și undefined. || o folosește și pentru 0.",
        "stock || 10 ar transforma stocul epuizat în 10."
      ],
      "answer": "",
      "rubric": [
        "Ce semnifică zero în această problemă?",
        "Care valori activează fiecare operator?"
      ],
      "lessonId": "reason-zero",
      "task": {
        "mode": "js",
        "prompt": "Păstrează input.stock dacă nu este null sau undefined. Numai pentru acestea întoarce 10.",
        "solution": "function solve(input) { return input.stock ?? 10; }",
        "cases": [
          {
            "input": {
              "stock": 0
            },
            "expected": 0
          },
          {
            "input": {
              "stock": 7
            },
            "expected": 7
          },
          {
            "input": {
              "stock": null
            },
            "expected": 10
          },
          {
            "input": {},
            "expected": 10
          }
        ],
        "starter": "function solve(input) {\n  // Write your code here.\n}\n",
        "id": "exam-transfer-reason-zero"
      },
      "reasoning": {
        "prerequisites": [
          "nullish-values"
        ],
        "questions": [
          "Ce semnifică zero în această problemă?",
          "Care valori activează fiecare operator?"
        ],
        "explanation": "?? folosește alternativa numai pentru null și undefined. || o folosește și pentru 0.",
        "counterexample": "stock || 10 ar transforma stocul epuizat în 10."
      }
    },
    {
      "id": "exam-transfer-reason-sort",
      "title": "sortare fără distrugerea sursei",
      "category": "client",
      "minutes": 15,
      "level": "Raționament",
      "hint": "Ce se întâmplă cu 2 și 10 fără comparator?",
      "steps": [
        "Copia păstrează intrarea; comparatorul evită ordinea textuală implicită a numerelor.",
        "Inversarea sortării nu reconstruiește ordinea inițială arbitrară."
      ],
      "answer": "",
      "rubric": [
        "Ce metodă modifică sursa?",
        "Ce se întâmplă cu 2 și 10 fără comparator?"
      ],
      "lessonId": "reason-sort",
      "task": {
        "mode": "js",
        "prompt": "Returnează numerele crescător, fără să modifici input.",
        "solution": "function solve(input) { return [...input].sort(function (a, b) { return a - b; }); }",
        "cases": [
          {
            "input": [
              10,
              2,
              1
            ],
            "expected": [
              1,
              2,
              10
            ]
          },
          {
            "input": [],
            "expected": []
          },
          {
            "input": [
              0,
              -3,
              2
            ],
            "expected": [
              -3,
              0,
              2
            ]
          },
          {
            "input": [
              2,
              2,
              1
            ],
            "expected": [
              1,
              2,
              2
            ]
          }
        ],
        "starter": "function solve(input) {\n  // Write your code here.\n}\n",
        "id": "exam-transfer-reason-sort"
      },
      "reasoning": {
        "prerequisites": [
          "array-sort",
          "array-copy"
        ],
        "questions": [
          "Ce metodă modifică sursa?",
          "Ce se întâmplă cu 2 și 10 fără comparator?"
        ],
        "explanation": "Copia păstrează intrarea; comparatorul evită ordinea textuală implicită a numerelor.",
        "counterexample": "Inversarea sortării nu reconstruiește ordinea inițială arbitrară."
      }
    },
    {
      "id": "exam-transfer-reason-missing-index",
      "title": "căutare fără rezultat",
      "category": "client",
      "minutes": 15,
      "level": "Raționament",
      "hint": "Cum interpretează splice un index negativ?",
      "steps": [
        "splice(-1,1) șterge ultimul element. Absența id-ului nu trebuie să elimine un element fără legătură.",
        "Testarea numai cu un id existent nu descoperă ștergerea accidentală a ultimului element."
      ],
      "answer": "",
      "rubric": [
        "Cum semnalează căutarea absența?",
        "Cum interpretează splice un index negativ?"
      ],
      "lessonId": "reason-missing-index",
      "task": {
        "mode": "js",
        "prompt": "Returnează o copie a input.items fără elementul cu id=input.id. Dacă id-ul lipsește, păstrează tot.",
        "solution": "function solve(input) { const items = [...input.items]; const index = items.findIndex(function (item) { return item.id === input.id; }); if (index !== -1) items.splice(index, 1); return items; }",
        "cases": [
          {
            "input": {
              "items": [
                {
                  "id": 1
                },
                {
                  "id": 2
                }
              ],
              "id": 9
            },
            "expected": [
              {
                "id": 1
              },
              {
                "id": 2
              }
            ]
          },
          {
            "input": {
              "items": [
                {
                  "id": 1
                },
                {
                  "id": 2
                }
              ],
              "id": 1
            },
            "expected": [
              {
                "id": 2
              }
            ]
          },
          {
            "input": {
              "items": [],
              "id": 1
            },
            "expected": []
          }
        ],
        "starter": "function solve(input) {\n  // Write your code here.\n}\n",
        "id": "exam-transfer-reason-missing-index"
      },
      "reasoning": {
        "prerequisites": [
          "array-find-index",
          "array-splice-removed"
        ],
        "questions": [
          "Cum semnalează căutarea absența?",
          "Cum interpretează splice un index negativ?"
        ],
        "explanation": "splice(-1,1) șterge ultimul element. Absența id-ului nu trebuie să elimine un element fără legătură.",
        "counterexample": "Testarea numai cu un id existent nu descoperă ștergerea accidentală a ultimului element."
      }
    },
    {
      "id": "exam-transfer-reason-search",
      "title": "căutare tolerantă la majuscule",
      "category": "client",
      "minutes": 15,
      "level": "Raționament",
      "hint": "Ce rezultat dorești pentru termenul gol?",
      "steps": [
        "trim elimină spațiile de la capetele termenului. Textul gol este inclus în orice text și poate reafișa toate rezultatele.",
        "startsWith ar respinge Blue pen pentru termenul pen, deși cerința cere apariția oriunde."
      ],
      "answer": "",
      "rubric": [
        "Ce normalizezi în fiecare parte?",
        "Ce rezultat dorești pentru termenul gol?"
      ],
      "lessonId": "reason-search",
      "task": {
        "mode": "js",
        "prompt": "Returnează textele din input.names care conțin input.term, ignorând majusculele și spațiile de la capetele termenului.",
        "solution": "function solve(input) { const term = input.term.trim().toLowerCase(); return input.names.filter(function (name) { return name.toLowerCase().includes(term); }); }",
        "cases": [
          {
            "input": {
              "names": [
                "Blue pen",
                "Notebook"
              ],
              "term": " PEN "
            },
            "expected": [
              "Blue pen"
            ]
          },
          {
            "input": {
              "names": [
                "Tea",
                "Cake"
              ],
              "term": ""
            },
            "expected": [
              "Tea",
              "Cake"
            ]
          },
          {
            "input": {
              "names": [
                "Tea"
              ],
              "term": "milk"
            },
            "expected": []
          }
        ],
        "starter": "function solve(input) {\n  // Write your code here.\n}\n",
        "id": "exam-transfer-reason-search"
      },
      "reasoning": {
        "prerequisites": [
          "string-trim",
          "string-case",
          "string-search"
        ],
        "questions": [
          "Ce normalizezi în fiecare parte?",
          "Ce rezultat dorești pentru termenul gol?"
        ],
        "explanation": "trim elimină spațiile de la capetele termenului. Textul gol este inclus în orice text și poate reafișa toate rezultatele.",
        "counterexample": "startsWith ar respinge Blue pen pentru termenul pen, deși cerința cere apariția oriunde."
      }
    },
    {
      "id": "exam-transfer-reason-whole",
      "title": "format complet sau fragment?",
      "category": "client",
      "minutes": 15,
      "level": "Raționament",
      "hint": "Ce exemple apropiate trebuie respinse?",
      "steps": [
        "Ancorele cer întregul text, iar cuantificatorii cer lungimi exacte.",
        "Flagul g nu transformă o căutare de fragment într-o validare completă."
      ],
      "answer": "",
      "rubric": [
        "Validezi întregul text sau cauți o parte?",
        "Ce exemple apropiate trebuie respinse?"
      ],
      "lessonId": "reason-whole",
      "task": {
        "mode": "js",
        "prompt": "Acceptă numai exact două litere mari A-Z și trei cifre. Returnează boolean.",
        "solution": "function solve(input) { return /^[A-Z]{2}[0-9]{3}$/.test(input); }",
        "cases": [
          {
            "input": "AB123",
            "expected": true
          },
          {
            "input": "xAB123y",
            "expected": false
          },
          {
            "input": "ab123",
            "expected": false
          },
          {
            "input": "AB1234",
            "expected": false
          },
          {
            "input": "AB12",
            "expected": false
          },
          {
            "input": "",
            "expected": false
          }
        ],
        "starter": "function solve(input) {\n  // Write your code here.\n}\n",
        "id": "exam-transfer-reason-whole"
      },
      "reasoning": {
        "prerequisites": [
          "regex-exact",
          "regex-full-quant-exact"
        ],
        "questions": [
          "Validezi întregul text sau cauți o parte?",
          "Ce exemple apropiate trebuie respinse?"
        ],
        "explanation": "Ancorele cer întregul text, iar cuantificatorii cer lungimi exacte.",
        "counterexample": "Flagul g nu transformă o căutare de fragment într-o validare completă."
      }
    },
    {
      "id": "exam-transfer-reason-utc-month",
      "title": "luna se poate schimba după conversie",
      "category": "client",
      "minutes": 15,
      "level": "Raționament",
      "hint": "Ce se schimbă la traversarea miezului nopții?",
      "steps": [
        "Momentul din exemplu este încă în februarie la UTC. getUTCMonth numără lunile de la 0.",
        "Extragerea caracterelor lunii din text ar ignora offsetul."
      ],
      "answer": "",
      "rubric": [
        "Se cere timp local sau UTC?",
        "Ce se schimbă la traversarea miezului nopții?"
      ],
      "lessonId": "reason-utc-month",
      "task": {
        "mode": "js",
        "prompt": "Returnează luna UTC a momentului input, numerotată de la 1 la 12.",
        "solution": "function solve(input) { return new Date(input).getUTCMonth() + 1; }",
        "cases": [
          {
            "input": "2026-03-01T00:30:00+02:00",
            "expected": 2
          },
          {
            "input": "2026-01-01T00:30:00+02:00",
            "expected": 12
          },
          {
            "input": "2026-07-15T12:00:00Z",
            "expected": 7
          }
        ],
        "starter": "function solve(input) {\n  // Write your code here.\n}\n",
        "id": "exam-transfer-reason-utc-month"
      },
      "reasoning": {
        "prerequisites": [
          "date-full-getUTCMonth",
          "date-full-getUTCFullYear"
        ],
        "questions": [
          "Se cere timp local sau UTC?",
          "Ce se schimbă la traversarea miezului nopții?"
        ],
        "explanation": "Momentul din exemplu este încă în februarie la UTC. getUTCMonth numără lunile de la 0.",
        "counterexample": "Extragerea caracterelor lunii din text ar ignora offsetul."
      }
    },
    {
      "id": "exam-transfer-reason-event-time",
      "title": "când citești valoarea?",
      "category": "client",
      "minutes": 15,
      "level": "Raționament",
      "hint": "Citești proprietatea curentă sau atributul inițial?",
      "steps": [
        "Handler-ul citește după modificările utilizatorului. Atributul HTML value poate rămâne neschimbat, deși proprietatea value a fost modificată.",
        "Un const name=input.value creat înainte de eveniment poate păstra Old."
      ],
      "answer": "",
      "rubric": [
        "În ce moment se poate modifica valoarea?",
        "Citești proprietatea curentă sau atributul inițial?"
      ],
      "lessonId": "reason-event-time",
      "task": {
        "mode": "dom",
        "prompt": "La Apply afișează valoarea curentă din input în #result. Se testează și o altă valoare introdusă după încărcare.",
        "solution": "document.querySelector(\"#apply\").onclick = function () { document.querySelector(\"#result\").textContent = document.querySelector(\"#name\").value; };",
        "fixture": "<input id=\"name\" value=\"Old\"><button id=\"apply\">Apply</button><p id=\"result\"></p>",
        "tests": [
          {
            "kind": "text",
            "selector": "#result",
            "value": "New",
            "label": "`#result` afișează `New`"
          }
        ],
        "actions": [
          {
            "type": "fill",
            "selector": "#name",
            "value": "New"
          },
          {
            "type": "click",
            "selector": "#apply"
          }
        ],
        "starter": "",
        "variants": [
          {
            "label": "Alt nume",
            "actions": [
              {
                "type": "fill",
                "selector": "#name",
                "value": "Alex"
              },
              {
                "type": "click",
                "selector": "#apply"
              }
            ],
            "tests": [
              {
                "kind": "text",
                "selector": "#result",
                "value": "Alex",
                "label": "`#result` afișează `Alex`"
              }
            ]
          }
        ],
        "id": "exam-transfer-reason-event-time"
      },
      "reasoning": {
        "prerequisites": [
          "dom-click",
          "dom-value"
        ],
        "questions": [
          "În ce moment se poate modifica valoarea?",
          "Citești proprietatea curentă sau atributul inițial?"
        ],
        "explanation": "Handler-ul citește după modificările utilizatorului. Atributul HTML value poate rămâne neschimbat, deși proprietatea value a fost modificată.",
        "counterexample": "Un const name=input.value creat înainte de eveniment poate păstra Old."
      }
    },
    {
      "id": "exam-transfer-reason-text",
      "title": "text sau markup?",
      "category": "client",
      "minutes": 15,
      "level": "Raționament",
      "hint": "Cum verifici absența elementelor interpretate?",
      "steps": [
        "textContent păstrează textul literal, fără să creeze un element b.",
        "Un test doar cu Notebook ar trece și pentru innerHTML."
      ],
      "answer": "",
      "rubric": [
        "Vrei text sau elemente noi?",
        "Cum verifici absența elementelor interpretate?"
      ],
      "lessonId": "reason-text",
      "task": {
        "mode": "dom",
        "prompt": "Copiază valoarea din input în #result ca text literal, fără un element b în rezultat.",
        "solution": "document.querySelector(\"#result\").textContent = document.querySelector(\"#name\").value;",
        "fixture": "<input id=\"name\" value=\"&lt;b&gt;Notebook&lt;/b&gt;\"><div id=\"result\"></div>",
        "tests": [
          {
            "kind": "text",
            "selector": "#result",
            "value": "<b>Notebook</b>",
            "label": "`#result` afișează `<b>Notebook</b>`"
          },
          {
            "kind": "absent",
            "selector": "#result b",
            "label": "`#result b` nu există"
          }
        ],
        "actions": [],
        "starter": "",
        "id": "exam-transfer-reason-text"
      },
      "reasoning": {
        "prerequisites": [
          "dom-text",
          "dom-create"
        ],
        "questions": [
          "Vrei text sau elemente noi?",
          "Cum verifici absența elementelor interpretate?"
        ],
        "explanation": "textContent păstrează textul literal, fără să creeze un element b.",
        "counterexample": "Un test doar cu Notebook ar trece și pentru innerHTML."
      }
    },
    {
      "id": "exam-transfer-reason-boundary",
      "title": "din text JSON până la rezultat",
      "category": "client",
      "minutes": 15,
      "level": "Raționament",
      "hint": "Ce întorci pentru o listă fără rezultate?",
      "steps": [
        "Înaintea parsării ai text. După parsare poți accesa items ca vector și calcula un rezultat.",
        "stringify ar serializa încă o dată textul, nu ar oferi obiectul cu items."
      ],
      "answer": "",
      "rubric": [
        "Ce tip ai înainte și după JSON.parse?",
        "Ce întorci pentru o listă fără rezultate?"
      ],
      "lessonId": "reason-boundary",
      "task": {
        "mode": "js",
        "prompt": "input este text JSON cu items. Returnează numele elementelor cu available=true, în ordine.",
        "solution": "function solve(input) { const data = JSON.parse(input); return data.items.filter(function (item) { return item.available === true; }).map(function (item) { return item.name; }); }",
        "cases": [
          {
            "input": "{\"items\":[{\"name\":\"Pen\",\"available\":true},{\"name\":\"Book\",\"available\":false}]}",
            "expected": [
              "Pen"
            ]
          },
          {
            "input": "{\"items\":[]}",
            "expected": []
          },
          {
            "input": "{\"items\":[{\"name\":\"Tea\",\"available\":false}]}",
            "expected": []
          }
        ],
        "starter": "function solve(input) {\n  // Write your code here.\n}\n",
        "id": "exam-transfer-reason-boundary"
      },
      "reasoning": {
        "prerequisites": [
          "json-parse",
          "json-nested"
        ],
        "questions": [
          "Ce tip ai înainte și după JSON.parse?",
          "Ce întorci pentru o listă fără rezultate?"
        ],
        "explanation": "Înaintea parsării ai text. După parsare poți accesa items ca vector și calcula un rezultat.",
        "counterexample": "stringify ar serializa încă o dată textul, nu ar oferi obiectul cu items."
      }
    },
    {
      "id": "exam-transfer-reason-restore",
      "title": "date salvate absente sau invalide",
      "category": "client",
      "minutes": 15,
      "level": "Raționament",
      "hint": "De ce nu ștergi preferințe fără legătură?",
      "steps": [
        "JSON valid nu garantează forma necesară aplicației. Validez obiectul și tipul contorului, păstrând valoarea validă zero.",
        "Datele {\"count\":\"8\"} sunt JSON valid, dar nu respectă contractul acestui contor."
      ],
      "answer": "",
      "rubric": [
        "Este parsarea suficientă pentru a garanta tipurile?",
        "De ce nu ștergi preferințe fără legătură?"
      ],
      "lessonId": "reason-restore",
      "task": {
        "mode": "js",
        "prompt": "input este text salvat sau null. Returnează count numai dacă este numeric și nenegativ într-un obiect JSON; în rest returnează 0.",
        "solution": "function solve(input) { try { const data = JSON.parse(input); if (data && typeof data.count === \"number\" && data.count >= 0) return data.count; } catch (error) { return 0; } return 0; }",
        "cases": [
          {
            "input": "{\"count\":0}",
            "expected": 0
          },
          {
            "input": "{\"count\":8}",
            "expected": 8
          },
          {
            "input": null,
            "expected": 0
          },
          {
            "input": "broken",
            "expected": 0
          },
          {
            "input": "{\"count\":\"8\"}",
            "expected": 0
          },
          {
            "input": "{\"count\":-1}",
            "expected": 0
          }
        ],
        "starter": "function solve(input) {\n  // Write your code here.\n}\n",
        "id": "exam-transfer-reason-restore"
      },
      "reasoning": {
        "prerequisites": [
          "storage-restore",
          "json-errors"
        ],
        "questions": [
          "Este parsarea suficientă pentru a garanta tipurile?",
          "De ce nu ștergi preferințe fără legătură?"
        ],
        "explanation": "JSON valid nu garantează forma necesară aplicației. Validez obiectul și tipul contorului, păstrând valoarea validă zero.",
        "counterexample": "Datele {\"count\":\"8\"} sunt JSON valid, dar nu respectă contractul acestui contor."
      }
    },
    {
      "id": "exam-transfer-reason-theme",
      "title": "valoare de build sau de utilizare?",
      "category": "css",
      "minutes": 15,
      "level": "Raționament",
      "hint": "Ce expresie trebuie păstrată în CSS pentru tema din browser?",
      "steps": [
        "CSS-ul rezultat păstrează var(--accent), dar padding devine 12px. Schimbarea variabilei Sass ar necesita o nouă compilare.",
        "Modificarea lui $accent în sursa SCSS nu schimbă singură CSS-ul deja descărcat."
      ],
      "answer": "",
      "rubric": [
        "Ce se calculează la build?",
        "Ce expresie trebuie păstrată în CSS pentru tema din browser?"
      ],
      "lessonId": "reason-theme",
      "task": {
        "mode": "scss",
        "prompt": "Scrie SCSS care folosește $spacing pentru padding 12px și păstrează culoarea legată de --accent, nu o valoare fixă.",
        "solution": "$spacing: 12px;\n.card { padding: $spacing; color: var(--accent); }",
        "fixture": "<article class=\"card\" style=\"--accent:navy\">Catalog</article>",
        "tests": [
          {
            "kind": "style",
            "selector": ".card",
            "name": "padding-left",
            "value": "12px",
            "label": "`.card`: `padding-left: 12px`"
          },
          {
            "kind": "style",
            "selector": ".card",
            "name": "color",
            "value": "rgb(0, 0, 128)",
            "label": "`.card`: `color: rgb(0, 0, 128)`"
          },
          {
            "kind": "cssIncludes",
            "value": "var(--accent)",
            "label": "Culoarea rămâne legată de variabila CSS."
          }
        ],
        "starter": "",
        "id": "exam-transfer-reason-theme"
      },
      "reasoning": {
        "prerequisites": [
          "scss-variables",
          "css-variables"
        ],
        "questions": [
          "Ce se calculează la build?",
          "Ce expresie trebuie păstrată în CSS pentru tema din browser?"
        ],
        "explanation": "CSS-ul rezultat păstrează var(--accent), dar padding devine 12px. Schimbarea variabilei Sass ar necesita o nouă compilare.",
        "counterexample": "Modificarea lui $accent în sursa SCSS nu schimbă singură CSS-ul deja descărcat."
      }
    },
    {
      "id": "exam-transfer-reason-file-flow",
      "title": "rezultatul trebuie să vină din fișier",
      "category": "server",
      "minutes": 20,
      "level": "Raționament",
      "hint": "Ce trebuie să depindă de input.file?",
      "steps": [
        "utf8 cere text în loc de Buffer. După parsare poți filtra items. Alt fișier trebuie să poată produce alt rezultat.",
        "return [\"Pen\"] trece primul caz, dar nu rezolvă problema generală."
      ],
      "answer": "",
      "rubric": [
        "Ce întoarce citirea cu utf8?",
        "Ce trebuie să depindă de input.file?"
      ],
      "lessonId": "reason-file-flow",
      "task": {
        "mode": "node",
        "prompt": "Citește input.file și returnează numele elementelor cu stock>0. Nu fixa numele fișierului sau rezultatul.",
        "solution": "const fs = require(\"fs\");\nfunction solve(input) { const data = JSON.parse(fs.readFileSync(input.file, \"utf8\")); return data.items.filter(function (item) { return item.stock > 0; }).map(function (item) { return item.name; }); }",
        "cases": [
          {
            "input": {
              "file": "stock.json"
            },
            "expected": [
              "Pen"
            ]
          },
          {
            "input": {
              "file": "empty.json"
            },
            "expected": []
          },
          {
            "input": {
              "file": "other.json"
            },
            "expected": [
              "Book",
              "Tea"
            ]
          }
        ],
        "starter": "function solve(input) {\n  // Write your code here.\n}\n",
        "files": {
          "stock.json": "{\"items\":[{\"name\":\"Pen\",\"stock\":2},{\"name\":\"Notebook\",\"stock\":0}]}",
          "empty.json": "{\"items\":[]}",
          "other.json": "{\"items\":[{\"name\":\"Book\",\"stock\":1},{\"name\":\"Tea\",\"stock\":5}]}"
        },
        "id": "exam-transfer-reason-file-flow"
      },
      "reasoning": {
        "prerequisites": [
          "node-json-file",
          "node-buffer"
        ],
        "questions": [
          "Ce întoarce citirea cu utf8?",
          "Ce trebuie să depindă de input.file?"
        ],
        "explanation": "utf8 cere text în loc de Buffer. După parsare poți filtra items. Alt fișier trebuie să poată produce alt rezultat.",
        "counterexample": "return [\"Pen\"] trece primul caz, dar nu rezolvă problema generală."
      }
    },
    {
      "id": "exam-transfer-reason-query",
      "title": "absent nu înseamnă invalid",
      "category": "server",
      "minutes": 20,
      "level": "Raționament",
      "hint": "Ce valori aparent apropiate trebuie respinse?",
      "steps": [
        "Numai absența primește 10. Pentru valori prezente verific intervalul și integritatea numărului, apoi răspund cu 400 dacă nu sunt valide.",
        "parseInt(\"2abc\") ar produce 2, deși textul nu reprezintă întregul cerut."
      ],
      "answer": "",
      "rubric": [
        "Cum distingi lipsa de zero?",
        "Ce valori aparent apropiate trebuie respinse?"
      ],
      "lessonId": "reason-query",
      "task": {
        "mode": "express",
        "prompt": "La /items fără limit întoarce JSON {\"limit\":10}. Acceptă întregi 1–50. Pentru zero, text, fracție sau valori peste 50 întoarce 400 și Invalid limit.",
        "solution": "const express = require(\"express\");\nconst app = express();\napp.get(\"/items\", function (request, response) {\n  const raw = request.query.limit;\n  if (raw === undefined) { response.json({ limit: 10 }); return; }\n  const limit = Number(raw);\n  if (!Number.isInteger(limit) || limit < 1 || limit > 50) {\n    response.status(400).send(\"Invalid limit\"); return;\n  }\n  response.json({ limit: limit });\n});\nmodule.exports = app;",
        "requests": [
          {
            "path": "/items",
            "json": {
              "limit": 10
            }
          },
          {
            "path": "/items?limit=2",
            "json": {
              "limit": 2
            }
          },
          {
            "path": "/items?limit=0",
            "status": 400,
            "bodyExpected": "Invalid limit"
          },
          {
            "path": "/items?limit=abc",
            "status": 400,
            "bodyExpected": "Invalid limit"
          },
          {
            "path": "/items?limit=2.5",
            "status": 400,
            "bodyExpected": "Invalid limit"
          },
          {
            "path": "/items?limit=51",
            "status": 400,
            "bodyExpected": "Invalid limit"
          }
        ],
        "starter": "const express = require(\"express\");\nconst app = express();\n\n// Add your routes here.\n\nmodule.exports = app;\n",
        "id": "exam-transfer-reason-query"
      },
      "reasoning": {
        "prerequisites": [
          "express-query",
          "express-numbers",
          "express-status"
        ],
        "questions": [
          "Cum distingi lipsa de zero?",
          "Ce valori aparent apropiate trebuie respinse?"
        ],
        "explanation": "Numai absența primește 10. Pentru valori prezente verific intervalul și integritatea numărului, apoi răspund cu 400 dacă nu sunt valide.",
        "counterexample": "parseInt(\"2abc\") ar produce 2, deși textul nu reprezintă întregul cerut."
      }
    },
    {
      "id": "exam-transfer-reason-order",
      "title": "ruta există, dar cererea nu ajunge la ea",
      "category": "server",
      "minutes": 20,
      "level": "Raționament",
      "hint": "Unde trebuie așezat fallback-ul?",
      "steps": [
        "Fallback-ul 404 vine după rutele cunoscute. Dacă răspunde înaintea lor fără next, oprește cererea.",
        "Schimbarea textului erorii nu rezolvă ordinea greșită."
      ],
      "answer": "",
      "rubric": [
        "Ce se execută primul?",
        "Ce încheie răspunsul?",
        "Unde trebuie așezat fallback-ul?"
      ],
      "lessonId": "reason-order",
      "task": {
        "mode": "express",
        "prompt": "Configurează /status cu 200 și Ready. Toate căile necunoscute primesc 404 și Not found.",
        "solution": "const express = require(\"express\");\nconst app = express();\napp.get(\"/status\", function (request, response) { response.send(\"Ready\"); });\napp.use(function (request, response) { response.status(404).send(\"Not found\"); });\nmodule.exports = app;",
        "requests": [
          {
            "path": "/status",
            "bodyExpected": "Ready"
          },
          {
            "path": "/missing",
            "status": 404,
            "bodyExpected": "Not found"
          },
          {
            "path": "/other",
            "status": 404,
            "bodyExpected": "Not found"
          }
        ],
        "starter": "const express = require(\"express\");\nconst app = express();\n\n// Add your routes here.\n\nmodule.exports = app;\n",
        "id": "exam-transfer-reason-order"
      },
      "reasoning": {
        "prerequisites": [
          "express-order",
          "express-next"
        ],
        "questions": [
          "Ce se execută primul?",
          "Ce încheie răspunsul?",
          "Unde trebuie așezat fallback-ul?"
        ],
        "explanation": "Fallback-ul 404 vine după rutele cunoscute. Dacă răspunde înaintea lor fără next, oprește cererea.",
        "counterexample": "Schimbarea textului erorii nu rezolvă ordinea greșită."
      }
    },
    {
      "id": "exam-transfer-reason-escape-empty",
      "title": "text neobișnuit și listă goală",
      "category": "server",
      "minutes": 20,
      "level": "Raționament",
      "hint": "Ce trebuie afișat când nu ai elemente?",
      "steps": [
        "Escaparea păstrează numele ca text. O ramură pentru lista goală îi explică utilizatorului de ce nu vede elemente.",
        "Un test doar cu Pen nu descoperă interpretarea accidentală a tagurilor."
      ],
      "answer": "",
      "rubric": [
        "Vrei text sau markup?",
        "Ce trebuie afișat când nu ai elemente?"
      ],
      "lessonId": "reason-escape-empty",
      "task": {
        "mode": "ejs",
        "prompt": "Afișează numele din items ca text, în li. Pentru items gol afișează No items într-un p, fără ul.",
        "solution": "<% if (items.length === 0) { %><p>No items</p><% } else { %><ul><% for (const item of items) { %><li><%= item.name %></li><% } %></ul><% } %>",
        "data": {
          "items": [
            {
              "name": "<b>Pen</b>"
            }
          ]
        },
        "tests": [
          {
            "kind": "text",
            "selector": "li",
            "value": "<b>Pen</b>",
            "label": "`li` afișează `<b>Pen</b>`"
          },
          {
            "kind": "absent",
            "selector": "li b",
            "label": "`li b` nu există"
          },
          {
            "kind": "count",
            "selector": "ul",
            "min": 1,
            "label": "Elementul `ul` există"
          }
        ],
        "starter": "",
        "partials": {},
        "variants": [
          {
            "label": "Listă goală",
            "data": {
              "items": []
            },
            "tests": [
              {
                "kind": "text",
                "selector": "p",
                "value": "No items",
                "label": "`p` afișează `No items`"
              },
              {
                "kind": "absent",
                "selector": "ul",
                "label": "`ul` nu există"
              }
            ]
          },
          {
            "label": "Alte nume",
            "data": {
              "items": [
                {
                  "name": "Tea"
                },
                {
                  "name": "Book"
                }
              ]
            },
            "tests": [
              {
                "kind": "text",
                "selector": "li:first-child",
                "value": "Tea",
                "label": "`li:first-child` afișează `Tea`"
              },
              {
                "kind": "text",
                "selector": "li:last-child",
                "value": "Book",
                "label": "`li:last-child` afișează `Book`"
              }
            ]
          }
        ],
        "id": "exam-transfer-reason-escape-empty",
        "inputData": {
          "items": [
            {
              "name": "<b>Pen</b>"
            }
          ]
        }
      },
      "reasoning": {
        "prerequisites": [
          "ejs-escape",
          "ejs-empty"
        ],
        "questions": [
          "Vrei text sau markup?",
          "Ce trebuie afișat când nu ai elemente?"
        ],
        "explanation": "Escaparea păstrează numele ca text. O ramură pentru lista goală îi explică utilizatorului de ce nu vede elemente.",
        "counterexample": "Un test doar cu Pen nu descoperă interpretarea accidentală a tagurilor."
      }
    },
    {
      "id": "exam-transfer-reason-sql-logic",
      "title": "parantezele schimbă rezultatul",
      "category": "sql",
      "minutes": 15,
      "level": "Raționament",
      "hint": "Ce rând descoperă lipsa parantezelor?",
      "steps": [
        "Fără paranteze, prioritatea AND poate accepta produse books fără stoc. Rândul Book este un contraexemplu util.",
        "Book are categoria potrivită, dar nu are stoc și trebuie exclus."
      ],
      "answer": "",
      "rubric": [
        "Ce condiție este comună ambelor categorii?",
        "Ce rând descoperă lipsa parantezelor?"
      ],
      "lessonId": "reason-sql-logic",
      "task": {
        "mode": "sql",
        "prompt": "Afișează name pentru books sau stationery cu stock>0, în ordinea id-ului.",
        "solution": "SELECT name FROM products WHERE (category = 'books' OR category = 'stationery') AND stock > 0 ORDER BY id;",
        "expected": [
          {
            "name": "Pen"
          },
          {
            "name": "Notebook"
          }
        ],
        "setup": "CREATE TABLE products (id integer, name text, category text, stock integer); INSERT INTO products VALUES (1,'Book','books',0),(2,'Pen','stationery',3),(3,'Notebook','books',2),(4,'Mug','accessories',4);",
        "checkQuery": null,
        "starter": "",
        "id": "exam-transfer-reason-sql-logic",
        "contextCode": "CREATE TABLE products (id integer, name text, category text, stock integer); INSERT INTO products VALUES (1,'Book','books',0),(2,'Pen','stationery',3),(3,'Notebook','books',2),(4,'Mug','accessories',4);",
        "expectedResult": [
          {
            "name": "Pen"
          },
          {
            "name": "Notebook"
          }
        ],
        "tables": [
          {
            "name": "products",
            "columns": [
              "id",
              "name",
              "category",
              "stock"
            ],
            "rows": [
              {
                "id": 1,
                "name": "Book",
                "category": "books",
                "stock": 0
              },
              {
                "id": 2,
                "name": "Pen",
                "category": "stationery",
                "stock": 3
              },
              {
                "id": 3,
                "name": "Notebook",
                "category": "books",
                "stock": 2
              },
              {
                "id": 4,
                "name": "Mug",
                "category": "accessories",
                "stock": 4
              }
            ],
            "totalRows": 4
          }
        ]
      },
      "reasoning": {
        "prerequisites": [
          "sql-and-or"
        ],
        "questions": [
          "Ce condiție este comună ambelor categorii?",
          "Ce rând descoperă lipsa parantezelor?"
        ],
        "explanation": "Fără paranteze, prioritatea AND poate accepta produse books fără stoc. Rândul Book este un contraexemplu util.",
        "counterexample": "Book are categoria potrivită, dar nu are stoc și trebuie exclus."
      }
    },
    {
      "id": "exam-transfer-reason-sql-zero",
      "title": "păstrează și numără corect cazurile fără potrivire",
      "category": "sql",
      "minutes": 15,
      "level": "Raționament",
      "hint": "Ce conține visits.id în acel rând?",
      "steps": [
        "Rândul fără accesare are visits.id NULL. COUNT(visits.id) ignoră NULL, în timp ce COUNT(*) numără și rândul păstrat.",
        "COUNT(*) ar raporta 1 pentru Sam după acest LEFT JOIN."
      ],
      "answer": "",
      "rubric": [
        "Cine trebuie păstrat fără potriviri?",
        "Ce conține visits.id în acel rând?"
      ],
      "lessonId": "reason-sql-zero",
      "task": {
        "mode": "sql",
        "prompt": "Afișează name și total pentru toți utilizatorii, inclusiv cei fără accesări. Sortează după users.id.",
        "solution": "SELECT users.name, COUNT(visits.id)::int AS total FROM users LEFT JOIN visits ON visits.user_id = users.id GROUP BY users.id, users.name ORDER BY users.id;",
        "expected": [
          {
            "name": "Alex",
            "total": 2
          },
          {
            "name": "Sam",
            "total": 0
          }
        ],
        "setup": "CREATE TABLE users (id integer, name text); CREATE TABLE visits (id integer, user_id integer); INSERT INTO users VALUES (1,'Alex'),(2,'Sam'); INSERT INTO visits VALUES (10,1),(11,1);",
        "checkQuery": null,
        "starter": "",
        "id": "exam-transfer-reason-sql-zero",
        "contextCode": "CREATE TABLE users (id integer, name text); CREATE TABLE visits (id integer, user_id integer); INSERT INTO users VALUES (1,'Alex'),(2,'Sam'); INSERT INTO visits VALUES (10,1),(11,1);",
        "expectedResult": [
          {
            "name": "Alex",
            "total": 2
          },
          {
            "name": "Sam",
            "total": 0
          }
        ],
        "tables": [
          {
            "name": "users",
            "columns": [
              "id",
              "name"
            ],
            "rows": [
              {
                "id": 1,
                "name": "Alex"
              },
              {
                "id": 2,
                "name": "Sam"
              }
            ],
            "totalRows": 2
          },
          {
            "name": "visits",
            "columns": [
              "id",
              "user_id"
            ],
            "rows": [
              {
                "id": 10,
                "user_id": 1
              },
              {
                "id": 11,
                "user_id": 1
              }
            ],
            "totalRows": 2
          }
        ]
      },
      "reasoning": {
        "prerequisites": [
          "sql-left-join",
          "sql-count-user-visits"
        ],
        "questions": [
          "Cine trebuie păstrat fără potriviri?",
          "Ce conține visits.id în acel rând?"
        ],
        "explanation": "Rândul fără accesare are visits.id NULL. COUNT(visits.id) ignoră NULL, în timp ce COUNT(*) numără și rândul păstrat.",
        "counterexample": "COUNT(*) ar raporta 1 pentru Sam după acest LEFT JOIN."
      }
    },
    {
      "id": "exam-oral-html-tag",
      "title": "Ce exprimă un tag HTML?",
      "category": "oral",
      "minutes": 2,
      "level": "Prezentare orală",
      "hint": "Spune ce fișier deschizi, de ce și ce efect are fiecare linie.",
      "steps": [],
      "answer": "Un element precum <p>Hello</p> marchează un paragraf: <p> deschide, Hello este conținutul și </p> închide. Există și elemente fără tag final, de exemplu img.",
      "rubric": [
        "Identifică p.",
        "Explică textul vizibil.",
        "Menționează elementele fără închidere."
      ],
      "lessonId": "html-tags",
      "prompt": "Explică diferența dintre element, tag de deschidere, conținut și tag de închidere. Dă un exemplu cu p."
    },
    {
      "id": "exam-oral-html-validate",
      "title": "Validează HTML în direct",
      "category": "oral",
      "minutes": 2,
      "level": "Prezentare orală",
      "hint": "Spune ce fișier deschizi, de ce și ce efect are fiecare linie.",
      "steps": [],
      "answer": "Deschid validatorul HTML înainte de prezentare, încarc fișierul sau lipesc sursa, citesc prima eroare cu linia indicată, corectez cauza și validez din nou. Un afișaj aparent corect în browser nu dovedește validitatea.",
      "rubric": [
        "Validator deschis.",
        "Fișierul corect.",
        "Corectare și reverificare."
      ],
      "lessonId": "validation-html",
      "prompt": "Descrie pașii pentru validarea fișierului și remedierea erorilor."
    },
    {
      "id": "exam-oral-css-variable",
      "title": "Variabilă CSS și utilizarea ei",
      "category": "oral",
      "minutes": 2,
      "level": "Prezentare orală",
      "hint": "Spune ce fișier deschizi, de ce și ce efect are fiecare linie.",
      "steps": [],
      "answer": "Declar --accent: navy în :root și folosesc color: var(--accent) pe selectorul dorit. Proprietățile personalizate se moștenesc și participă la cascadă; variabila Sass este evaluată la compilare.",
      "rubric": [
        "Declarație.",
        "var().",
        "Diferență față de Sass."
      ],
      "lessonId": "css-variables",
      "prompt": "Arată unde declari o variabilă CSS și unde o folosești."
    },
    {
      "id": "exam-oral-css-swap",
      "title": "Inversează vizual două secțiuni",
      "category": "oral",
      "minutes": 2,
      "level": "Prezentare orală",
      "hint": "Spune ce fișier deschizi, de ce și ce efect are fiecare linie.",
      "steps": [],
      "answer": "În containerul Grid schimb grid-template-areas sau coordonatele grid-row; în Flexbox pot folosi order. Ordinea din HTML și de citire rămâne aceeași, deci verific și accesibilitatea.",
      "rubric": [
        "Containerul potrivit.",
        "Proprietate concretă.",
        "Ordine DOM versus vizuală."
      ],
      "lessonId": "css-grid-areas",
      "prompt": "Cum schimbi ordinea vizuală a secțiunilor prin CSS?"
    },
    {
      "id": "exam-oral-css-selector",
      "title": "Descompune un selector combinat",
      "category": "oral",
      "minutes": 2,
      "level": "Prezentare orală",
      "hint": "Spune ce fișier deschizi, de ce și ce efect are fiecare linie.",
      "steps": [],
      "answer": "#hours identifică tabelul; spațiile cer descendenți; tbody restrânge corpul tabelului; nth-child(-n+3) păstrează primele trei rânduri; th:hover cere cursorul pe zi; ~ alege frați ulteriori; td:nth-child(4) cere a patra celulă din rând.",
      "rubric": [
        "Fiecare segment.",
        "Rolul ~.",
        "Poziții numărate de la 1."
      ],
      "lessonId": "css-scale-horizontal",
      "prompt": "Explică #hours tbody tr:nth-child(-n+3) th:hover ~ td:nth-child(4)."
    },
    {
      "id": "exam-oral-css-fixed",
      "title": "Link la 100px față de viewport",
      "category": "oral",
      "minutes": 2,
      "level": "Prezentare orală",
      "hint": "Spune ce fișier deschizi, de ce și ce efect are fiecare linie.",
      "steps": [],
      "answer": "Selectez linkul și aplic position: fixed; top: 100px; left: 0. În pagina simplă referința este viewport-ul. Verific dacă vreun strămoș transformat schimbă blocul de referință.",
      "rubric": [
        "fixed.",
        "top și left.",
        "Referință corectă."
      ],
      "lessonId": "css-fixed-viewport",
      "prompt": "Cum poziționezi linkul în stânga, la 100px de sus?"
    },
    {
      "id": "exam-oral-bootstrap-h1",
      "title": "H1 implicit de 40px",
      "category": "oral",
      "minutes": 2,
      "level": "Prezentare orală",
      "hint": "Spune ce fișier deschizi, de ce și ce efect are fiecare linie.",
      "steps": [],
      "answer": "În SCSS atribui $h1-font-size: 40px înaintea importului Bootstrap. Pentru exact 40px pe toate lățimile dezactivez RFS în acest exercițiu. Compilez apoi în CSS și încarc CSS-ul generat.",
      "rubric": [
        "Variabilă înainte de import.",
        "Compilare.",
        "CSS încărcat."
      ],
      "lessonId": "scss-bootstrap",
      "prompt": "Cum personalizezi Bootstrap fără a rescrie manual h1 după compilare?"
    },
    {
      "id": "exam-oral-css-tabs",
      "title": "Taburi centrate față de iframe",
      "category": "oral",
      "minutes": 2,
      "level": "Prezentare orală",
      "hint": "Spune ce fișier deschizi, de ce și ce efect are fiecare linie.",
      "steps": [],
      "answer": "Pun taburile și iframe-ul într-un container comun de aceeași lățime. Grupul taburilor primește display:flex și justify-content:center; iframe-ul are width:100%. Centrarea se raportează astfel la aceeași zonă.",
      "rubric": [
        "Container comun.",
        "Flex și justify-content.",
        "Aceeași lățime."
      ],
      "lessonId": "css-flex",
      "prompt": "Cum centrezi grupul de taburi față de iframe?"
    },
    {
      "id": "exam-oral-node-error",
      "title": "Adaugă o eroare personalizată",
      "category": "oral",
      "minutes": 2,
      "level": "Prezentare orală",
      "hint": "Spune ce fișier deschizi, de ce și ce efect are fiecare linie.",
      "steps": [],
      "answer": "Adaug intrarea în JSON-ul erorilor, aleg identificatorul în validarea parametrilor, setez statusul HTTP și transmit datele către template-ul comun. return încheie ruta după trimiterea răspunsului.",
      "rubric": [
        "Intrare JSON.",
        "Condiție.",
        "Status, render și return."
      ],
      "lessonId": "project-json-error-page",
      "prompt": "Descrie traseul de la condiția invalidă până la pagina erorii."
    },
    {
      "id": "exam-oral-ejs-shared",
      "title": "Imagine comună tuturor paginilor",
      "category": "oral",
      "minutes": 2,
      "level": "Prezentare orală",
      "hint": "Spune ce fișier deschizi, de ce și ce efect are fiecare linie.",
      "steps": [],
      "answer": "Creez un partial cu img și îl includ în footer-ul comun, iar paginile includ footer-ul. Folosesc <%- include(...) %> pentru HTML-ul controlat al fragmentului. URL-ul imaginii este unul public, nu o cale locală de pe PC.",
      "rubric": [
        "Partial.",
        "Include comun.",
        "URL de resursă."
      ],
      "lessonId": "ejs-include",
      "prompt": "Cum adaugi același fragment EJS fără a duplica markup-ul imaginii?"
    },
    {
      "id": "exam-oral-json-gallery",
      "title": "Explică citirea galeriei rând cu rând",
      "category": "oral",
      "minutes": 2,
      "level": "Prezentare orală",
      "hint": "Spune ce fișier deschizi, de ce și ce efect are fiecare linie.",
      "steps": [],
      "answer": "readFileSync primește calea și citește textul când specific utf8. JSON.parse transformă textul JSON în obiect JavaScript. Accesez vectorul de imagini, apoi filter creează o listă nouă pe baza condiției. Transmit rezultatul template-ului.",
      "rubric": [
        "Text versus obiect.",
        "Proprietatea vectorului.",
        "Filtrare și render."
      ],
      "lessonId": "node-json-file",
      "prompt": "Ce fac readFileSync, utf8, JSON.parse și filter?"
    },
    {
      "id": "exam-oral-scss-compile",
      "title": "Când se compilează SCSS?",
      "category": "oral",
      "minutes": 2,
      "level": "Prezentare orală",
      "hint": "Spune ce fișier deschizi, de ce și ce efect are fiecare linie.",
      "steps": [],
      "answer": "Browserul nu execută SCSS. O comandă manuală compilează o dată. --watch urmărește schimbările și recompilă. Un script de pornire poate compila înainte să pornească serverul, numai dacă a fost configurat explicit. nodemon repornește Node și nu înlocuiește automat Sass watch.",
      "rubric": [
        "CSS rezultat.",
        "Trei situații.",
        "Rolul nodemon."
      ],
      "lessonId": "scss-compile",
      "prompt": "Distinge compilarea manuală, watch și compilarea la pornire."
    },
    {
      "id": "exam-oral-pg-list",
      "title": "Rută nouă cu nume din PostgreSQL",
      "category": "oral",
      "minutes": 2,
      "level": "Prezentare orală",
      "hint": "Spune ce fișier deschizi, de ce și ce efect are fiecare linie.",
      "steps": [],
      "answer": "Adaug app.get pentru cale, execut SELECT name cu pool.query și await, transmit result.rows ca products către render, apoi parcurg vectorul în EJS pentru li. Tratez și tabelul gol și eroarea de interogare.",
      "rubric": [
        "result.rows.",
        "render.",
        "Buclă EJS și erori."
      ],
      "lessonId": "project-pg-ejs-route",
      "prompt": "Explică cerere → SQL → rânduri → EJS → HTML."
    },
    {
      "id": "exam-oral-client-sort",
      "title": "Explică comparatorul rând cu rând",
      "category": "oral",
      "minutes": 2,
      "level": "Prezentare orală",
      "hint": "Spune ce fișier deschizi, de ce și ce efect are fiecare linie.",
      "steps": [],
      "answer": "Copiez vectorul, convertesc prețurile cu Number și scad al doilea preț din primul, first-second. Dacă diferența este zero, compar numele normalizate cu localeCompare. Înmulțesc rezultatul cu sign. sort modifică vectorul, deci copia protejează intrarea.",
      "rubric": [
        "Comparator negativ/zero/pozitiv.",
        "Preț numeric.",
        "Criteriu secundar și sign."
      ],
      "lessonId": "project-sort",
      "prompt": "Cum sortezi numeric după preț, apoi după nume, în ambele sensuri?"
    },
    {
      "id": "exam-oral-client-description",
      "title": "Adaugă filtrarea descrierii",
      "category": "oral",
      "minutes": 2,
      "level": "Prezentare orală",
      "hint": "Spune ce fișier deschizi, de ce și ce efect are fiecare linie.",
      "steps": [],
      "answer": "Asigur câmpul description în datele primite, îl afișez sau îl expun într-un data attribute în EJS, adaug input text și citesc valoarea la filtrare. Normalizez ambele texte și verific includes. Combin rezultatul cu filtrele existente.",
      "rubric": [
        "Date.",
        "EJS și control.",
        "Condiție combinată."
      ],
      "lessonId": "project-filter",
      "prompt": "Ce modifici în date, template și script?"
    },
    {
      "id": "exam-oral-storage-reload",
      "title": "Salvare versus afișare la reîncărcare",
      "category": "oral",
      "minutes": 2,
      "level": "Prezentare orală",
      "hint": "Spune ce fișier deschizi, de ce și ce efect are fiecare linie.",
      "steps": [],
      "answer": "La încărcare citesc totalul și actualizez paragraful o dată. În eveniment incrementez numai valoarea salvată. La următoarea încărcare, paragraful va citi totalul nou. getItem întoarce text sau null, deci convertesc numeric.",
      "rubric": [
        "Două momente distincte.",
        "Text în stocare.",
        "Cazul primei vizite."
      ],
      "lessonId": "storage-model",
      "prompt": "De ce contorul salvat poate diferi de cel afișat în paragraf?"
    },
    {
      "id": "exam-oral-callback-return",
      "title": "De ce return din callback nu returnează din solve?",
      "category": "oral",
      "minutes": 2,
      "level": "Prezentare orală",
      "hint": "Spune ce fișier deschizi, de ce și ce efect are fiecare linie.",
      "steps": [],
      "answer": "Callback-ul rulează separat când operația termină. return încheie acea funcție, nu funcția exterioară deja întoarsă. Pentru rezultat asincron returnez o promisiune pe care o îndeplinesc cu resolve și o resping cu reject.",
      "rubric": [
        "Funcție exterioară versus callback.",
        "Ordine.",
        "Promise."
      ],
      "lessonId": "node-read-callback",
      "prompt": "Arată cine apelează callback-ul și ce funcție încheie return."
    },
    {
      "id": "exam-oral-nodemon",
      "title": "De ce pornești cu nodemon?",
      "category": "oral",
      "minutes": 2,
      "level": "Prezentare orală",
      "hint": "Spune ce fișier deschizi, de ce și ce efect are fiecare linie.",
      "steps": [],
      "answer": "Instalez nodemon ca dependență de dezvoltare și definesc dev: nodemon app.js în scripts din package.json. npm run dev pornește aplicația și repornește Node la schimbări. Reîncarc pagina separat. Ctrl+C oprește procesul.",
      "rubric": [
        "Instalare locală.",
        "Script.",
        "Browser versus server."
      ],
      "lessonId": "express-nodemon",
      "prompt": "Explică fișierul de intrare, scriptul și reluarea după salvare."
    },
    {
      "id": "exam-oral-sql-order",
      "title": "SELECT și ordinea rândurilor",
      "category": "oral",
      "minutes": 2,
      "level": "Prezentare orală",
      "hint": "Spune ce fișier deschizi, de ce și ce efect are fiecare linie.",
      "steps": [],
      "answer": "SELECT alege coloanele, FROM sursa, WHERE filtrează și ORDER BY stabilește ordinea rezultatului. Fără ORDER BY, SQL nu garantează ordinea rândurilor. Nu confund filtrarea cu ștergerea.",
      "rubric": [
        "Rolul clauzelor.",
        "Ordine explicită.",
        "Datele originale rămân."
      ],
      "lessonId": "sql-order",
      "prompt": "De ce ordinea din tabel nu garantează ordinea rezultatului?"
    },
    {
      "id": "exam-oral-pg-params",
      "title": "Parametri SQL versus concatenare",
      "category": "oral",
      "minutes": 2,
      "level": "Prezentare orală",
      "hint": "Spune ce fișier deschizi, de ce și ce efect are fiecare linie.",
      "steps": [],
      "answer": "Validez tipul față de opțiunile acceptate și folosesc WHERE type = $1 cu vectorul [type] ca al doilea argument query. Valorile nu se concatenează în SQL; numele coloanelor nu pot fi înlocuite astfel cu parametri de valori.",
      "rubric": [
        "Validare.",
        "$1 și vector.",
        "Valori versus identificatori."
      ],
      "lessonId": "sql-parameters",
      "prompt": "Cum trimiți un tip de produs în query în siguranță?"
    },
    {
      "id": "exam-oral-ejs-escape",
      "title": "<%= versus <%-",
      "category": "oral",
      "minutes": 2,
      "level": "Prezentare orală",
      "hint": "Spune ce fișier deschizi, de ce și ce efect are fiecare linie.",
      "steps": [],
      "answer": "<%= îl escapează și îl afișează ca text, prevenind interpretarea ca markup. <%- inserează HTML neescapat și îl rezerv fragmentelor controlate precum include. Nu îl folosesc pe text furnizat de utilizator.",
      "rubric": [
        "Escapare.",
        "Partial de încredere.",
        "Text necontrolat."
      ],
      "lessonId": "ejs-escape",
      "prompt": "Ce se întâmplă cu un nume de produs care conține taguri?"
    },
    {
      "id": "exam-oral-radio",
      "title": "De ce grupurile radio au name diferit?",
      "category": "oral",
      "minutes": 2,
      "level": "Prezentare orală",
      "hint": "Spune ce fișier deschizi, de ce și ce efect are fiecare linie.",
      "steps": [],
      "answer": "Butoanele radio cu același name și același proprietar de formular formează un grup exclusiv. Aleg un name comun numai opțiunilor filtrului de tip, diferit de celelalte grupuri. citesc :checked la aplicarea filtrului.",
      "rubric": [
        "name.",
        "Separarea grupurilor.",
        "Citirea opțiunii."
      ],
      "lessonId": "project-filter",
      "prompt": "Ce determină exclusivitatea opțiunilor?"
    },
    {
      "id": "exam-oral-timestamp",
      "title": "Timestamp în secunde",
      "category": "oral",
      "minutes": 2,
      "level": "Prezentare orală",
      "hint": "Spune ce fișier deschizi, de ce și ce efect are fiecare linie.",
      "steps": [],
      "answer": "Date.now() sau getTime() oferă milisecunde de la epocă. Math.floor(timestamp / 1000) produce numărul întreg de secunde. Construiesc calea în directorul temp și creez directorul numai când ruta o cere.",
      "rubric": [
        "Milisecunde.",
        "Împărțire și floor.",
        "Locul și momentul creării."
      ],
      "lessonId": "node-mkdir-sync",
      "prompt": "Cum construiești numele directorului din ora curentă?"
    },
    {
      "id": "exam-oral-periods",
      "title": "Intervalele [0,20), [20,40), [40,60)",
      "category": "oral",
      "minutes": 2,
      "level": "Prezentare orală",
      "hint": "Spune ce fișier deschizi, de ce și ce efect are fiecare linie.",
      "steps": [],
      "answer": "Folosesc minute < 20 pentru început, else if minute < 40 pentru mijloc, altfel final. Minutul 20 intră în mijloc, iar 40 în final. Verific separat always și lipsa proprietății de perioade.",
      "rubric": [
        "Limite.",
        "else if.",
        "Date absente."
      ],
      "lessonId": "js-if",
      "prompt": "Cum tratezi minutele 20 și 40 fără goluri?"
    }
  ]
};

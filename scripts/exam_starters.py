"""Starting files contain the existing application, without the requested changes."""
import re


def prepare_starters(exercises,base_style):
    css_base=base_style.removeprefix('<style>').removesuffix('</style>')
    css_base=re.sub(r'([^{}]+)\{([^{}]*)\}',lambda m:m[1].strip()+' {\n'+''.join('  '+line.strip()+';\n' for line in m[2].split(';') if line.strip())+'}\n\n',css_base)
    for item in exercises:
        task=item['task'];previous=task.get('starter','');key=item['id'];mode=task['mode']
        if mode=='css':
            selected=task['baseStyles'].removeprefix('<style>').removesuffix('</style>')
            selected=re.sub(r'([^{}]+)\{([^{}]*)\}',lambda m:m[1].strip()+' {\n'+''.join('  '+line.strip()+';\n' for line in m[2].split(';') if line.strip())+'}\n\n',selected)
            task['starter']=selected+'/* Add or change the rules required by the ticket below. */\n'
        elif mode=='dom' and key.endswith('-dom'):
            # Keep the existing name filter and result counter; the student adds
            # the radio filter and its combination with the existing search.
            start=task['solution'].index('const visible=')
            end=task['solution'].index(';document.querySelector',start)
            task['starter']=task['solution'][:start]+'// Add the selected radio criteria to the existing name filter.\nconst visible=p.name.toLowerCase().includes(term)'+task['solution'][end:]
        elif mode=='express' and key.startswith('ticket-client-'):
            task['starter']='''const express = require("express");
const { Pool } = require("pg");
const app = express();
const pool = new Pool();

app.get("/products", async (request, response, next) => {
  try {
    const value = request.query.value;
    let sql = "SELECT id,name,type,price,weight,stock,description,allergen,promo FROM products";
    const parameters = [];
    // Add the requested filters here, using SQL parameters.
    sql += " ORDER BY id";
    const result = await pool.query(sql, parameters);
    response.json(result.rows);
  } catch (error) {
    next(error);
  }
});
module.exports = app;
'''
        elif key.startswith('ticket-server-'):
            task['starter']='''const express = require("express");
const fs = require("fs");
const app = express();
app.set("view engine", "ejs");

app.get("/catalog", (request, response) => {
  const items = JSON.parse(fs.readFileSync("products.json", "utf8"));
  // Adapt the existing catalogue to the ticket requirements.
  const products = items;
  response.render("catalog", { products });
});
module.exports = app;
'''
        elif key=='exam-server-offers-time':
            task['starter']+='''<section id="offers">
  <ul>
    <% for (const offer of offers) { %>
      <li>
        <!-- Add the formatted date and conditional emphasis. -->
        <span><%= offer.text %></span>
      </li>
    <% } %>
  </ul>
</section>
'''
        elif key=='exam-transfer-reason-escape-empty':
            task['starter']='''<ul>
  <% for (const item of items) { %>
    <!-- Change the output and add the empty-list case. -->
    <li><%- item.name %></li>
  <% } %>
</ul>
'''
        elif key in ['exam-server-gallery-periods','exam-server-vowel-errors']:
            gallery=key=='exam-server-gallery-periods'
            route,filename,field,view=('gallery','gallery.json','images','gallery') if gallery else ('vowel-errors','errors.json','errors','errors')
            task['starter']=f'''const express = require("express");
const fs = require("fs");
const app = express();
app.set("view engine", "ejs");

app.get("/{route}", (request, response) => {{
  const data = JSON.parse(fs.readFileSync("{filename}", "utf8"));
  // Add the selection required by the ticket.
  const {field} = data.{field};
  response.render("{view}", {{ {field} }});
}});
module.exports = app;
'''
        elif key=='exam-server-clock-folder':
            task['starter']='''const express = require("express");
const fs = require("fs");
const app = express();
app.set("view engine", "ejs");

function showTime(request, response) {
  const now = new Date();
  const time = now.toISOString().slice(11, 19);
  // Calculate the period and create the folder when requested.
  const period = "";
  response.render("clock", { time, period });
}
app.get("/server-time", showTime);
app.get("/server-time/folder", showTime);
module.exports = app;
'''
        elif key=='exam-bridge-project-json-error-page':
            task['starter']='''const express = require("express");
const fs = require("fs");
const app = express();
app.set("view engine", "ejs");
const messages = JSON.parse(fs.readFileSync("errors.json", "utf8"));

app.get("/products", (request, response) => {
  // Add validation and render the existing error template when needed.
  response.send("Products");
});
module.exports = app;
'''
        elif key=='exam-bridge-project-pg-ejs-route':
            task['starter']='''const express = require("express");
const { Pool } = require("pg");
const app = express();
const pool = new Pool();
app.set("view engine", "ejs");

app.get("/product-names", async (request, response, next) => {
  try {
    // Read the names from PostgreSQL and pass them to the existing template.
    const products = [];
    response.render("names", { products });
  } catch (error) {
    next(error);
  }
});
module.exports = app;
'''
        elif key=='exam-transfer-reason-query':
            task['starter']='''const express = require("express");
const app = express();
app.get("/items", (request, response) => {
  const raw = request.query.limit;
  // Add the default value and validate the requested limit.
  response.json({ limit: raw });
});
module.exports = app;
'''
        if task.get('starter','')!=previous:
            task['previousStarters']=[previous]
            if mode=='css':task['previousStarters'].append(css_base+'/* Add or change the rules required by the ticket below. */\n')

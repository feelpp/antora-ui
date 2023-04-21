!function(){"use strict";var e,o,r,v=/^sect(\d)$/,i=document.querySelector(".nav-container"),a=document.querySelector(".nav-toggle"),c=i.querySelector(".nav"),s=(a.addEventListener("click",function(e){if(a.classList.contains("is-active"))return l(e);d(e);var e=document.documentElement,t=(e.classList.add("is-clipped--nav"),a.classList.add("is-active"),i.classList.add("is-active"),c.getBoundingClientRect()),n=window.innerHeight-Math.round(t.top);Math.round(t.height)!==n&&(c.style.height=n+"px");e.addEventListener("click",l)}),i.addEventListener("click",d),i.querySelector("[data-panel=menu]"));function t(){var e,t,n=window.location.hash;if(n&&(n.indexOf("%")&&(n=decodeURIComponent(n)),!(e=s.querySelector('.nav-link[href="'+n+'"]')))){n=document.getElementById(n.slice(1));if(n)for(var i=n,a=document.querySelector("article.doc");(i=i.parentNode)&&i!==a;){var c=i.id;if((c=!c&&(c=v.test(i.className))?(i.firstElementChild||{}).id:c)&&(e=s.querySelector('.nav-link[href="#'+c+'"]')))break}}if(e)t=e.parentNode;else{if(!r)return;e=(t=r).querySelector(".nav-link")}t!==o&&(u(s,".nav-item.is-active").forEach(function(e){e.classList.remove("is-active","is-current-path","is-current-page")}),t.classList.add("is-current-page"),p(o=t),h(s,e))}function p(e){for(var t,n=e.parentNode;!(t=n.classList).contains("nav-menu");)"LI"===n.tagName&&t.contains("nav-item")&&t.add("is-active","is-current-path"),n=n.parentNode;e.classList.add("is-active")}function n(){var e,t,n,i;this.classList.toggle("is-active")&&(e=parseFloat(window.getComputedStyle(this).marginTop),t=this.getBoundingClientRect(),n=s.getBoundingClientRect(),0<(i=(t.bottom-n.top-n.height+e).toFixed())&&(s.scrollTop+=Math.min((t.top-n.top-e).toFixed(),i)))}function l(e){d(e);e=document.documentElement;e.classList.remove("is-clipped--nav"),a.classList.remove("is-active"),i.classList.remove("is-active"),e.removeEventListener("click",l)}function d(e){e.stopPropagation()}function h(e,t){var n=e.getBoundingClientRect(),i=n.height,a=window.getComputedStyle(c);"sticky"===a.position&&(i-=n.top-parseFloat(a.top)),e.scrollTop=Math.max(0,.5*(t.getBoundingClientRect().height-i)+t.offsetTop)}function u(e,t){return[].slice.call(e.querySelectorAll(t))}s&&(e=i.querySelector("[data-panel=explore]"),o=s.querySelector(".is-current-page"),(r=o)?(p(o),h(s,o.querySelector(".nav-link"))):s.scrollTop=0,u(s,".nav-item-toggle").forEach(function(e){var t=e.parentElement,e=(e.addEventListener("click",n.bind(t)),function(e,t){e=e.nextElementSibling;return(!e||!t||e[e.matches?"matches":"msMatchesSelector"](t))&&e}(e,".nav-text"));e&&(e.style.cursor="pointer",e.addEventListener("click",n.bind(t)))}),e&&e.querySelector(".context").addEventListener("click",function(){u(c,"[data-panel]").forEach(function(e){e.classList.toggle("is-active")})}),s.addEventListener("mousedown",function(e){1<e.detail&&e.preventDefault()}),s.querySelector('.nav-link[href^="#"]')&&(window.location.hash&&t(),window.addEventListener("hashchange",t)))}();
!function(){"use strict";var e=document.querySelector("aside.toc.sidebar");if(e){if(document.querySelector("body.-toc"))return e.parentNode.removeChild(e);var l=parseInt(e.dataset.levels||2,10);if(!(l<0)){for(var u="article.doc",m=document.querySelector(u),f=[],t=0;t<=l;t++){var p=[u];if(t){for(var h=1;h<=t;h++)p.push((2===h?".sectionbody>":"")+".sect"+h);p.push("h"+(t+1)+"[id]")}else p.push("h1[id].sect0");f.push(p.join(">"))}v=f.join(","),o=m.parentNode;var d,s=[].slice.call((o||document).querySelectorAll(v));if(!s.length)return e.parentNode.removeChild(e);var a={},r=s.reduce(function(e,t){var n=document.createElement("a"),i=(n.textContent=t.textContent,(a[n.href="#"+t.id]=n).addEventListener("click",function(e,t){t.isTrusted&&window.setTimeout(function(){e.click()},0)}.bind(null,n)),document.createElement("li"));return i.dataset.level=parseInt(t.nodeName.slice(1),10)-1,i.appendChild(n),e.appendChild(i),e},document.createElement("ul")),n=e.querySelector(".toc-menu"),i=(n||((n=document.createElement("div")).className="toc-menu"),e.querySelector(".toc-title")),o=(i||((i=document.createElement("div")).className="toc-title"),i.textContent=e.dataset.title||"Contents",n.querySelector("#vbtn-and-title")),c=(o||((o=document.createElement("span")).id="vbtn-and-title"),n.querySelector(".nav-item-toggle")),v=(c||((c=document.createElement("button")).className="nav-item-toggle"),o.appendChild(c),o.appendChild(i),n.appendChild(o),n.appendChild(r),c.addEventListener("click",function(){e.classList.toggle("is-hidden-toc"),n.classList.toggle("is-hidden-toc"),i.classList.toggle("is-hidden-toc"),c.classList.toggle("is-hidden-toc")}),!document.getElementById("toc")&&m.querySelector("h1.page ~ :not(.is-before-toc)"));v&&((o=document.createElement("aside")).className="toc embedded",o.appendChild(n.cloneNode(!0)),v.parentNode.insertBefore(o,v)),window.addEventListener("load",function(){g(),window.addEventListener("scroll",g)})}}function g(){var i,o,t,e=window.pageYOffset,n=1.15*y(document.documentElement,"fontSize"),c=m.offsetTop;if(e&&window.innerHeight+e+2>=document.documentElement.scrollHeight)return d=Array.isArray(d)?d:Array(d||0),i=[],o=s.length-1,s.forEach(function(e,t){var n="#"+e.id;t===o||e.getBoundingClientRect().top+y(e,"paddingTop")>c?(i.push(n),d.indexOf(n)<0&&a[n].classList.add("is-active")):~d.indexOf(n)&&a[d.shift()].classList.remove("is-active")}),r.scrollTop=r.scrollHeight-r.offsetHeight,void(d=1<i.length?i:i[0]);Array.isArray(d)&&(d.forEach(function(e){a[e].classList.remove("is-active")}),d=void 0),s.some(function(e){if(e.getBoundingClientRect().top+y(e,"paddingTop")-n>c)return!0;t="#"+e.id}),t?t!==d&&(d&&a[d].classList.remove("is-active"),(e=a[t]).classList.add("is-active"),r.scrollHeight>r.offsetHeight&&(r.scrollTop=Math.max(0,e.offsetTop+e.offsetHeight-r.offsetHeight)),d=t):d&&(a[d].classList.remove("is-active"),d=void 0)}function y(e,t){return parseFloat(window.getComputedStyle(e)[t])}}();
!function(){"use strict";var o,t;function i(e){return e&&(~e.indexOf("%")?decodeURIComponent(e):e).slice(1)}function c(e){if(e){if(e.altKey||e.ctrlKey)return;window.location.hash="#"+this.id,e.preventDefault()}window.scrollTo(0,function e(t,n){return o.contains(t)?e(t.offsetParent,t.offsetTop+n):n}(this,0)-t.getBoundingClientRect().bottom)}!document.documentMode||(o=document.querySelector("article.doc"),t=document.querySelector(".toolbar"),window.addEventListener("load",function e(t){var n,o;(n=i(window.location.hash))&&(o=document.getElementById(n))&&(c.bind(o)(),setTimeout(c.bind(o),0)),window.removeEventListener("load",e)}),Array.prototype.slice.call(document.querySelectorAll('a[href^="#"]')).forEach(function(e){var t,n;(t=i(e.hash))&&(n=document.getElementById(t))&&e.addEventListener("click",c.bind(n))}))}();
!function(){"use strict";var t,e=document.querySelector(".page-versions .version-menu-toggle");e&&(t=document.querySelector(".page-versions"),e.addEventListener("click",function(e){t.classList.toggle("is-active"),e.stopPropagation()}),document.documentElement.addEventListener("click",function(){t.classList.remove("is-active")}))}();
!function(){"use strict";var t=document.querySelector(".navbar-burger");t&&t.addEventListener("click",function(t){t.stopPropagation(),document.documentElement.classList.toggle("is-clipped--navbar"),this.classList.toggle("is-active");t=document.getElementById(this.dataset.target);{var e;t.classList.toggle("is-active")&&(t.style.maxHeight="",e=window.innerHeight-Math.round(t.getBoundingClientRect().top),parseInt(window.getComputedStyle(t).maxHeight,10)!==e&&(t.style.maxHeight=e+"px"))}}.bind(t))}();
!function(){"use strict";var o=/^\$ (\S[^\\\n]*(\\\n(?!\$ )[^\\\n]*)*)(?=\n|$)/gm,s=/( ) *\\\n *|\\\n( ?) */g,l=/ +$/gm,e=(document.getElementById("site-script")||{dataset:{}}).dataset,d=null==e.uiRootPath?".":e.uiRootPath,r=e.svgAs,p=window.navigator.clipboard;[].slice.call(document.querySelectorAll(".doc pre.highlight, .doc .literalblock pre")).forEach(function(e){var t,n,a,c;if(e.classList.contains("highlight"))(i=(t=e.querySelector("code")).dataset.lang)&&"console"!==i&&((a=document.createElement("span")).className="source-lang",a.appendChild(document.createTextNode(i)));else{if(!e.innerText.startsWith("$ "))return;var i=e.parentNode.parentNode;i.classList.remove("literalblock"),i.classList.add("listingblock"),e.classList.add("highlightjs","highlight"),(t=document.createElement("code")).className="language-console hljs",t.dataset.lang="console",t.appendChild(e.firstChild),e.appendChild(t)}(i=document.createElement("div")).className="source-toolbox",a&&i.appendChild(a),p&&((n=document.createElement("button")).className="copy-button",n.setAttribute("title","Copy to clipboard"),"svg"===r?((a=document.createElementNS("http://www.w3.org/2000/svg","svg")).setAttribute("class","copy-icon"),(c=document.createElementNS("http://www.w3.org/2000/svg","use")).setAttribute("href",d+"/img/octicons-16.svg#icon-clippy"),a.appendChild(c),n.appendChild(a)):((c=document.createElement("img")).src=d+"/img/octicons-16.svg#view-clippy",c.alt="copy icon",c.className="copy-icon",n.appendChild(c)),(a=document.createElement("span")).className="copy-toast",a.appendChild(document.createTextNode("Copied!")),n.appendChild(a),i.appendChild(n)),e.parentNode.appendChild(i),n&&n.addEventListener("click",function(e){var t=e.innerText.replace(l,"");"console"===e.dataset.lang&&t.startsWith("$ ")&&(t=function(e){var t,n=[];for(;t=o.exec(e);)n.push(t[1].replace(s,"$1$2"));return n.join(" && ")}(t));window.navigator.clipboard.writeText(t).then(function(){this.classList.add("clicked"),this.offsetHeight,this.classList.remove("clicked")}.bind(this),function(){})}.bind(n,t))})}();
var checkActiveClass,hash=window.location.hash,queueData=[],tabOnLargeScreen=5,tabOnSmallScreen=1,smallBreak=768;function activateTab(e){e.preventDefault();var t=this.tab,a=this.pane,e=document.querySelector(".tabs ul"),n=t.parentNode.parentNode.parentNode.querySelector(".tabs > ul"),s=t.parentNode;"other-tablist"===t.parentNode.classList[0]&&(s.appendChild(n.lastElementChild),n.appendChild(t),s.classList.remove("show")),t.classList.contains("is-active")&&e.classList.remove("show"),find(".tabs li, .tab-pane",this.tabset).forEach(function(e){e===t||e===a?e.classList.add("is-active"):e.classList.remove("is-active")})}function find(e,t){return Array.prototype.slice.call((t||document).querySelectorAll(e))}function getPane(t,e){return find(".tab-pane",e).find(function(e){return e.getAttribute("aria-labelledby")===t})}find(".doc .tabset").forEach(function(s){var i,o,e=s.querySelector(".tabs");e&&(find("ul",e).forEach(function(e,t){e&&find("li",e).forEach(function(a,e){var t,n=(a.querySelector("a[id]")||a).id;window.innerWidth<smallBreak?tabOnSmallScreen-1<e&&queueData.push(a):tabOnLargeScreen-1<e&&queueData.push(a),checkActiveClass=setTimeout(function(){var e,t;a.classList.contains("is-active")&&0<queueData.length&&(window.innerWidth>smallBreak&&a.parentNode.childElementCount>tabOnLargeScreen-1?a.parentNode.parentNode.insertAdjacentHTML("beforeend",'<div class="other-tab-box"><a href="#" class="dropddown-btn dropdown-btn-down">More... </a> <ul class="other-tablist"></ul></div>'):a.parentNode.parentNode.insertAdjacentHTML("beforeend",'<div class="other-tab-box desktop-hide"><a href="#" class="dropddown-btn dropdown-btn-down">More... </a> <ul class="other-tablist"></ul></div>'),e=a.parentNode.parentNode.querySelector(".dropdown-btn-down"),t=a.parentNode.parentNode.querySelector(".tabs .other-tablist"),e.addEventListener("click",function(e){e.preventDefault(),"block"===t.style.display||t.classList.contains("show")?(t.classList.remove("show"),t.classList.add("hide")):(t.classList.add("show"),t.classList.remove("hide"))}))},40),n&&(t=getPane(n,s),e||(o={tab:a,pane:t}),!i&&hash==="#"+n&&(i=!0)?(a.classList.add("is-active"),t&&t.classList.add("is-active")):e||(a.classList.remove("is-active"),t&&t.classList.remove("is-active")),a.addEventListener("click",activateTab.bind({tabset:s,tab:a,pane:t})))})}),!i&&o&&(o.tab.classList.add("is-active"),o.pane&&o.pane.classList.add("is-active"))),s.classList.remove("is-loading"),clearTimeout(checkActiveClass,2e4)}),setTimeout(function(){queueData.length&&queueData.forEach(function(e){e.parentNode.nextElementSibling.lastElementChild.appendChild(e)})},200),setTimeout(function(){document.querySelector(" .dropddown-btn")&&document.querySelector(" .dropddown-btn").addEventListener("click",function(e){e.preventDefault()})},200);
!function(){"use strict";[].slice.call(document.querySelectorAll("td.icon > i.fa")).forEach(function(e){e.classList.remove("fa")}),[].slice.call(document.querySelectorAll(".edition a")).forEach(function(e){~e.innerText.toLowerCase().indexOf("community")&&e.parentNode.classList.add("page-edition")}),[].slice.call(document.querySelectorAll("table.tableblock")).forEach(function(e){e.caption&&e.classList.add("caption-table")})}();
!function(){"use strict";const e=Array.from(document.querySelectorAll(".literalblock.pseudocode pre"));if(e&&e.length){const t=document.createElement("link"),d=(t.rel="stylesheet",t.href="https://cdn.jsdelivr.net/npm/pseudocode@latest/build/pseudocode.min.css",document.createElement("script"));d.src="https://cdn.jsdelivr.net/npm/pseudocode@latest/build/pseudocode.min.js",document.body.appendChild(t),document.body.appendChild(d),d.onload=function(){e.forEach(e=>{pseudocode.renderElement(e)})}}}();
//# sourceMappingURL=site.js.map
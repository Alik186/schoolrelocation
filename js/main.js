(function () {
  "use strict";
  var hdr = document.querySelector(".hdr");
  var burger = document.querySelector(".burger");
  var nav = document.getElementById("nav");

  // шапка с тенью при прокрутке
  function onScroll() { hdr.classList.toggle("is-scrolled", window.scrollY > 10); }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  // мобильное меню
  function setMenu(open) {
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
  }
  burger.addEventListener("click", function () { setMenu(burger.getAttribute("aria-expanded") !== "true"); });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  window.addEventListener("resize", function () { if (window.innerWidth > 1024) setMenu(false); });

  // подсветка пункта меню текущей секции
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav__list a[href^="#"]'));
  if ("IntersectionObserver" in window) {
    var map = {};
    links.forEach(function (a) { var s = document.querySelector(a.getAttribute("href")); if (s) map[s.id] = a; });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting && map[en.target.id]) {
          links.forEach(function (l) { l.classList.remove("is-active"); });
          map[en.target.id].classList.add("is-active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(map).forEach(function (id) { io.observe(document.getElementById(id)); });

    // плавное появление блоков
    var rv = document.querySelectorAll(".sh, .split, .principle, .point, .card, .col, .pcard, .step, .adv__item, .quote--wide, .how, .band__quote");
    var io2 = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io2.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    rv.forEach(function (el) { el.classList.add("rv"); io2.observe(el); });
  }

  // кнопки программ выбирают программу в форме
  var sel = document.querySelector('select[name="programme"]');
  document.querySelectorAll("[data-prog]").forEach(function (b) {
    b.addEventListener("click", function () { if (sel) sel.value = b.getAttribute("data-prog"); });
  });

  // «Важная информация» в подвале
  var ib = document.querySelector(".info-btn"), ip = document.getElementById("info");
  if (ib && ip) ib.addEventListener("click", function () {
    var open = ib.getAttribute("aria-expanded") !== "true";
    ib.setAttribute("aria-expanded", open ? "true" : "false"); ip.hidden = !open;
  });

  // форма заявки
  var form = document.getElementById("form");
  if (form) {
    var st = form.querySelector(".form__status");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      ["name", "phone"].forEach(function (n) {
        var f = form.elements[n], bad = !f.value.trim();
        f.closest(".fld").classList.toggle("is-bad", bad);
        if (bad) ok = false;
      });
      var em = form.elements.email;
      if (em.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value)) { em.closest(".fld").classList.add("is-bad"); ok = false; }
      else em.closest(".fld").classList.remove("is-bad");
      if (!ok) return;
      form.classList.add("is-sending");
      st.className = "form__status"; st.textContent = "";
      fetch(form.action, { method: "POST", body: new FormData(form), headers: { "Accept": "application/json" } })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (d && d.ok) { st.classList.add("ok"); st.textContent = st.dataset.ok; form.reset(); }
          else throw new Error("fail");
        })
        .catch(function () { st.classList.add("err"); st.textContent = st.dataset.err; })
        .then(function () { form.classList.remove("is-sending"); });
    });
  }
})();

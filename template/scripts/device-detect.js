/* ── OutSystems Device Class Detection ────────────────
   In the real OutSystems platform, a runtime script detects
   the viewport size and applies device + orientation classes
   to <body>. Since we render static .visual.html files
   outside the platform, this script replicates that behavior.

   Breakpoints (matches OS runtime):
     phone:   width < 768
     tablet:  768 ≤ width ≤ 1024
     desktop: width > 1024

   Orientation:
     landscape: width > height
     portrait:  width ≤ height

   Usage: add <script src="../theme/device-detect.js"></script>
   at the end of <body>, AFTER the HTML content.
──────────────────────────────────────────────────────── */
(function () {
  var PHONE = 'phone';
  var TABLET = 'tablet';
  var DESKTOP = 'desktop';
  var PORTRAIT = 'portrait';
  var LANDSCAPE = 'landscape';
  var ALL_CLASSES = [PHONE, TABLET, DESKTOP, PORTRAIT, LANDSCAPE];

  function applyDeviceClasses() {
    var w = window.innerWidth || document.documentElement.clientWidth;
    var h = window.innerHeight || document.documentElement.clientHeight;
    var device = w < 768 ? PHONE : w <= 1024 ? TABLET : DESKTOP;
    var orientation = w > h ? LANDSCAPE : PORTRAIT;
    var body = document.body;

    ALL_CLASSES.forEach(function (c) { body.classList.remove(c); });
    body.classList.add(device, orientation);
  }

  applyDeviceClasses();
  window.addEventListener('resize', applyDeviceClasses);
})();

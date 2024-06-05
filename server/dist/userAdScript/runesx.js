"use strict";

(function (funcName, baseObj) {
  // The public function name defaults to window.docReady
  // but you can pass in your own object and own function name and those will be used
  // if you want to put them in a different namespace
  funcName = funcName || "docReady";
  baseObj = baseObj || window;
  var readyList = [];
  var readyFired = false;
  var readyEventHandlersInstalled = false;

  // call this when the document is ready
  // this function protects itself against being called more than once
  function ready() {
    if (!readyFired) {
      // this must be set to true before we start calling callbacks
      readyFired = true;
      for (var i = 0; i < readyList.length; i++) {
        // if a callback here happens to add new ready handlers,
        // the docReady() function will see that it already fired
        // and will schedule the callback to run right after
        // this event loop finishes so all handlers will still execute
        // in order and no new ones will be added to the readyList
        // while we are processing the list
        readyList[i].fn.call(window, readyList[i].ctx);
      }
      // allow any closures held by these functions to free
      readyList = [];
    }
  }

  function readyStateChange() {
    if (document.readyState === "complete") {
      ready();
    }
  }

  // This is the one public interface
  // docReady(fn, context);
  // the context argument is optional - if present, it will be passed
  // as an argument to the callback
  baseObj[funcName] = function (callback, context) {
    if (typeof callback !== "function") {
      throw new TypeError("callback for docReady(fn) must be a function");
    }
    // if ready has already fired, then just schedule the callback
    // to fire asynchronously, but right away
    if (readyFired) {
      setTimeout(function () {
        callback(context);
      }, 1);
      return;
    }
    // add the function and context to the list
    readyList.push({ fn: callback, ctx: context });

    // if document already ready to go, schedule the ready function to run
    if (document.readyState === "complete") {
      setTimeout(ready, 1);
    } else if (!readyEventHandlersInstalled) {
      // otherwise if we don't have event handlers installed, install them
      if (document.addEventListener) {
        // first choice is DOMContentLoaded event
        document.addEventListener("DOMContentLoaded", ready, false);
        // backup is window load event
        window.addEventListener("load", ready, false);
      } else {
        // must be IE
        document.attachEvent("onreadystatechange", readyStateChange);
        window.attachEvent("onload", ready);
      }
      readyEventHandlersInstalled = true;
    }
  };
})("docReady", window);

var FingerprintJS = !function (e, t) {
  typeof window !== "undefined" && typeof define === "function" && define.amd ? define(t) : typeof module !== "undefined" && module.exports ? module.exports = t() : e.exports ? e.exports = t() : e.Fingerprint2 = t();
}(undefined, function () {
  void 0 === Array.isArray && (Array.isArray = function (e) {
    return Object.prototype.toString.call(e) === "[object Array]";
  });function d(e, t) {
    e = [e[0] >>> 16, 65535 & e[0], e[1] >>> 16, 65535 & e[1]], t = [t[0] >>> 16, 65535 & t[0], t[1] >>> 16, 65535 & t[1]];var n = [0, 0, 0, 0];return n[3] += e[3] + t[3], n[2] += n[3] >>> 16, n[3] &= 65535, n[2] += e[2] + t[2], n[1] += n[2] >>> 16, n[2] &= 65535, n[1] += e[1] + t[1], n[0] += n[1] >>> 16, n[1] &= 65535, n[0] += e[0] + t[0], n[0] &= 65535, [n[0] << 16 | n[1], n[2] << 16 | n[3]];
  }function f(e, t) {
    e = [e[0] >>> 16, 65535 & e[0], e[1] >>> 16, 65535 & e[1]], t = [t[0] >>> 16, 65535 & t[0], t[1] >>> 16, 65535 & t[1]];var n = [0, 0, 0, 0];return n[3] += e[3] * t[3], n[2] += n[3] >>> 16, n[3] &= 65535, n[2] += e[2] * t[3], n[1] += n[2] >>> 16, n[2] &= 65535, n[2] += e[3] * t[2], n[1] += n[2] >>> 16, n[2] &= 65535, n[1] += e[1] * t[3], n[0] += n[1] >>> 16, n[1] &= 65535, n[1] += e[2] * t[2], n[0] += n[1] >>> 16, n[1] &= 65535, n[1] += e[3] * t[1], n[0] += n[1] >>> 16, n[1] &= 65535, n[0] += e[0] * t[3] + e[1] * t[2] + e[2] * t[1] + e[3] * t[0], n[0] &= 65535, [n[0] << 16 | n[1], n[2] << 16 | n[3]];
  }function g(e, t) {
    return (t %= 64) === 32 ? [e[1], e[0]] : t < 32 ? [e[0] << t | e[1] >>> 32 - t, e[1] << t | e[0] >>> 32 - t] : (t -= 32, [e[1] << t | e[0] >>> 32 - t, e[0] << t | e[1] >>> 32 - t]);
  }function h(e, t) {
    return (t %= 64) === 0 ? e : t < 32 ? [e[0] << t | e[1] >>> 32 - t, e[1] << t] : [e[1] << t - 32, 0];
  }function m(e, t) {
    return [e[0] ^ t[0], e[1] ^ t[1]];
  }function p(e) {
    return e = m(e, [0, e[0] >>> 1]), e = f(e, [4283543511, 3981806797]), e = m(e, [0, e[0] >>> 1]), e = f(e, [3301882366, 444984403]), e = m(e, [0, e[0] >>> 1]);
  }function l(e, t) {
    t = t || 0;for (var n = (e = e || "").length % 16, a = e.length - n, r = [0, t], i = [0, t], o = [0, 0], l = [0, 0], s = [2277735313, 289559509], c = [1291169091, 658871167], u = 0; u < a; u += 16) {
      o = [255 & e.charCodeAt(u + 4) | (255 & e.charCodeAt(u + 5)) << 8 | (255 & e.charCodeAt(u + 6)) << 16 | (255 & e.charCodeAt(u + 7)) << 24, 255 & e.charCodeAt(u) | (255 & e.charCodeAt(u + 1)) << 8 | (255 & e.charCodeAt(u + 2)) << 16 | (255 & e.charCodeAt(u + 3)) << 24], l = [255 & e.charCodeAt(u + 12) | (255 & e.charCodeAt(u + 13)) << 8 | (255 & e.charCodeAt(u + 14)) << 16 | (255 & e.charCodeAt(u + 15)) << 24, 255 & e.charCodeAt(u + 8) | (255 & e.charCodeAt(u + 9)) << 8 | (255 & e.charCodeAt(u + 10)) << 16 | (255 & e.charCodeAt(u + 11)) << 24], o = f(o, s), o = g(o, 31), o = f(o, c), r = m(r, o), r = g(r, 27), r = d(r, i), r = d(f(r, [0, 5]), [0, 1390208809]), l = f(l, c), l = g(l, 33), l = f(l, s), i = m(i, l), i = g(i, 31), i = d(i, r), i = d(f(i, [0, 5]), [0, 944331445]);
    }switch (o = [0, 0], l = [0, 0], n) {case 15:
        l = m(l, h([0, e.charCodeAt(u + 14)], 48));case 14:
        l = m(l, h([0, e.charCodeAt(u + 13)], 40));case 13:
        l = m(l, h([0, e.charCodeAt(u + 12)], 32));case 12:
        l = m(l, h([0, e.charCodeAt(u + 11)], 24));case 11:
        l = m(l, h([0, e.charCodeAt(u + 10)], 16));case 10:
        l = m(l, h([0, e.charCodeAt(u + 9)], 8));case 9:
        l = m(l, [0, e.charCodeAt(u + 8)]), l = f(l, c), l = g(l, 33), l = f(l, s), i = m(i, l);case 8:
        o = m(o, h([0, e.charCodeAt(u + 7)], 56));case 7:
        o = m(o, h([0, e.charCodeAt(u + 6)], 48));case 6:
        o = m(o, h([0, e.charCodeAt(u + 5)], 40));case 5:
        o = m(o, h([0, e.charCodeAt(u + 4)], 32));case 4:
        o = m(o, h([0, e.charCodeAt(u + 3)], 24));case 3:
        o = m(o, h([0, e.charCodeAt(u + 2)], 16));case 2:
        o = m(o, h([0, e.charCodeAt(u + 1)], 8));case 1:
        o = m(o, [0, e.charCodeAt(u)]), o = f(o, s), o = g(o, 31), o = f(o, c), r = m(r, o);}return r = m(r, [0, e.length]), i = m(i, [0, e.length]), r = d(r, i), i = d(i, r), r = p(r), i = p(i), r = d(r, i), i = d(i, r), ("00000000" + (r[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (r[1] >>> 0).toString(16)).slice(-8) + ("00000000" + (i[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (i[1] >>> 0).toString(16)).slice(-8);
  }function c(e, t) {
    if (Array.prototype.forEach && e.forEach === Array.prototype.forEach) e.forEach(t);else if (e.length === +e.length) for (var _n = 0, _a = e.length; _n < _a; _n++) {
      t(e[_n], _n, e);
    } else for (var _r in e) {
      e.hasOwnProperty(_r) && t(e[_r], _r, e);
    }
  }function s(e, a) {
    var r = [];return e == null ? r : Array.prototype.map && e.map === Array.prototype.map ? e.map(a) : (c(e, function (e, t, n) {
      r.push(a(e, t, n));
    }), r);
  }function a(e) {
    throw new Error("'new Fingerprint()' is deprecated, see https://github.com/fingerprintjs/fingerprintjs#upgrade-guide-from-182-to-200");
  }var e = {
    preprocessor: null,
    audio: { timeout: 1e3, excludeIOS11: !0 },
    fonts: {
      swfContainerId: "fingerprintjs2", swfPath: "flash/compiled/FontList.swf", userDefinedFonts: [], extendedJsFonts: !1
    },
    screen: { detectScreenOrientation: !0 },
    plugins: { sortPluginsFor: [/palemoon/i], excludeIE: !1 },
    extraComponents: [],
    excludes: {
      enumerateDevices: !0, pixelRatio: !0, doNotTrack: !0, fontsFlash: !0, adBlock: !0
    },
    NOT_AVAILABLE: "not available",
    ERROR: "error",
    EXCLUDED: "excluded"
  };var n = function n() {
    return navigator.mediaDevices && navigator.mediaDevices.enumerateDevices;
  };var r = function r(e) {
    var t = [window.screen.width, window.screen.height];return e.screen.detectScreenOrientation && t.sort().reverse(), t;
  };var i = function i(e) {
    if (window.screen.availWidth && window.screen.availHeight) {
      var _t = [window.screen.availHeight, window.screen.availWidth];return e.screen.detectScreenOrientation && _t.sort().reverse(), _t;
    }return e.NOT_AVAILABLE;
  };var o = function o(e) {
    if (navigator.plugins == null) return e.NOT_AVAILABLE;for (var t = [], n = 0, a = navigator.plugins.length; n < a; n++) {
      navigator.plugins[n] && t.push(navigator.plugins[n]);
    }return T(e) && (t = t.sort(function (e, t) {
      return e.name > t.name ? 1 : e.name < t.name ? -1 : 0;
    })), s(t, function (e) {
      var t = s(e, function (e) {
        return [e.type, e.suffixes];
      });return [e.name, e.description, t];
    });
  };var u = function u(t) {
    var e = [];if (Object.getOwnPropertyDescriptor && Object.getOwnPropertyDescriptor(window, "ActiveXObject") || "ActiveXObject" in window) {
      e = s(["AcroPDF.PDF", "Adodb.Stream", "AgControl.AgControl", "DevalVRXCtrl.DevalVRXCtrl.1", "MacromediaFlashPaper.MacromediaFlashPaper", "Msxml2.DOMDocument", "Msxml2.XMLHTTP", "PDF.PdfCtrl", "QuickTime.QuickTime", "QuickTimeCheckObject.QuickTimeCheck.1", "RealPlayer", "RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)", "RealVideo.RealVideo(tm) ActiveX Control (32-bit)", "Scripting.Dictionary", "SWCtl.SWCtl", "Shell.UIHelper", "ShockwaveFlash.ShockwaveFlash", "Skype.Detection", "TDCCtl.TDCCtl", "WMPlayer.OCX", "rmocx.RealPlayer G2 Control", "rmocx.RealPlayer G2 Control.1"], function (e) {
        try {
          return new window.ActiveXObject(e), e;
        } catch (e) {
          return t.ERROR;
        }
      });
    } else e.push(t.NOT_AVAILABLE);return navigator.plugins && (e = e.concat(o(t))), e;
  };var T = function T(e) {
    for (var t = !1, n = 0, a = e.plugins.sortPluginsFor.length; n < a; n++) {
      var _r2 = e.plugins.sortPluginsFor[n];if (navigator.userAgent.match(_r2)) {
        t = !0;break;
      }
    }return t;
  };var A = function A(t) {
    try {
      return !!window.sessionStorage;
    } catch (e) {
      return t.ERROR;
    }
  };var v = function v(t) {
    try {
      return !!window.localStorage;
    } catch (e) {
      return t.ERROR;
    }
  };var S = function S(t) {
    if (N()) return t.EXCLUDED;try {
      return !!window.indexedDB;
    } catch (e) {
      return t.ERROR;
    }
  };var C = function C(e) {
    return navigator.hardwareConcurrency ? navigator.hardwareConcurrency : e.NOT_AVAILABLE;
  };var w = function w(e) {
    return navigator.cpuClass || e.NOT_AVAILABLE;
  };var B = function B(e) {
    return navigator.platform ? navigator.platform : e.NOT_AVAILABLE;
  };var y = function y(e) {
    return navigator.doNotTrack ? navigator.doNotTrack : navigator.msDoNotTrack ? navigator.msDoNotTrack : window.doNotTrack ? window.doNotTrack : e.NOT_AVAILABLE;
  };var t = function t() {
    var t = void 0;var e = 0;void 0 !== navigator.maxTouchPoints ? e = navigator.maxTouchPoints : void 0 !== navigator.msMaxTouchPoints && (e = navigator.msMaxTouchPoints);try {
      document.createEvent("TouchEvent"), t = !0;
    } catch (e) {
      t = !1;
    }return [e, t, "ontouchstart" in window];
  };var E = function E(e) {
    var t = [];var n = document.createElement("canvas");n.width = 2e3, n.height = 200, n.style.display = "inline";var a = n.getContext("2d");return a.rect(0, 0, 10, 10), a.rect(2, 2, 6, 6), t.push("canvas winding:" + (!1 === a.isPointInPath(5, 5, "evenodd") ? "yes" : "no")), a.textBaseline = "alphabetic", a.fillStyle = "#f60", a.fillRect(125, 1, 62, 20), a.fillStyle = "#069", e.dontUseFakeFontInCanvas ? a.font = "11pt Arial" : a.font = "11pt no-real-font-123", a.fillText("Cwm fjordbank glyphs vext quiz, \uD83D\uDE03", 2, 15), a.fillStyle = "rgba(102, 204, 0, 0.2)", a.font = "18pt Arial", a.fillText("Cwm fjordbank glyphs vext quiz, \uD83D\uDE03", 4, 45), a.globalCompositeOperation = "multiply", a.fillStyle = "rgb(255,0,255)", a.beginPath(), a.arc(50, 50, 50, 0, 2 * Math.PI, !0), a.closePath(), a.fill(), a.fillStyle = "rgb(0,255,255)", a.beginPath(), a.arc(100, 50, 50, 0, 2 * Math.PI, !0), a.closePath(), a.fill(), a.fillStyle = "rgb(255,255,0)", a.beginPath(), a.arc(75, 100, 50, 0, 2 * Math.PI, !0), a.closePath(), a.fill(), a.fillStyle = "rgb(255,0,255)", a.arc(75, 75, 75, 0, 2 * Math.PI, !0), a.arc(75, 75, 25, 0, 2 * Math.PI, !0), a.fill("evenodd"), n.toDataURL && t.push("canvas fp:" + n.toDataURL()), t;
  };var x = function x() {
    function e(e) {
      return o.clearColor(0, 0, 0, 1), o.enable(o.DEPTH_TEST), o.depthFunc(o.LEQUAL), o.clear(o.COLOR_BUFFER_BIT | o.DEPTH_BUFFER_BIT), "[" + e[0] + ", " + e[1] + "]";
    }var o = void 0;if (!(o = U())) return null;var l = [];var t = o.createBuffer();o.bindBuffer(o.ARRAY_BUFFER, t);var n = new Float32Array([-0.2, -0.9, 0, 0.4, -0.26, 0, 0, 0.732134444, 0]);o.bufferData(o.ARRAY_BUFFER, n, o.STATIC_DRAW), t.itemSize = 3, t.numItems = 3;var a = o.createProgram();var r = o.createShader(o.VERTEX_SHADER);o.shaderSource(r, "attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}"), o.compileShader(r);var i = o.createShader(o.FRAGMENT_SHADER);o.shaderSource(i, "precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}"), o.compileShader(i), o.attachShader(a, r), o.attachShader(a, i), o.linkProgram(a), o.useProgram(a), a.vertexPosAttrib = o.getAttribLocation(a, "attrVertex"), a.offsetUniform = o.getUniformLocation(a, "uniformOffset"), o.enableVertexAttribArray(a.vertexPosArray), o.vertexAttribPointer(a.vertexPosAttrib, t.itemSize, o.FLOAT, !1, 0, 0), o.uniform2f(a.offsetUniform, 1, 1), o.drawArrays(o.TRIANGLE_STRIP, 0, t.numItems);try {
      l.push(o.canvas.toDataURL());
    } catch (e) {}l.push("extensions:" + (o.getSupportedExtensions() || []).join(";")), l.push("webgl aliased line width range:" + e(o.getParameter(o.ALIASED_LINE_WIDTH_RANGE))), l.push("webgl aliased point size range:" + e(o.getParameter(o.ALIASED_POINT_SIZE_RANGE))), l.push("webgl alpha bits:" + o.getParameter(o.ALPHA_BITS)), l.push("webgl antialiasing:" + (o.getContextAttributes().antialias ? "yes" : "no")), l.push("webgl blue bits:" + o.getParameter(o.BLUE_BITS)), l.push("webgl depth bits:" + o.getParameter(o.DEPTH_BITS)), l.push("webgl green bits:" + o.getParameter(o.GREEN_BITS)), l.push("webgl max anisotropy:" + function (e) {
      var t = e.getExtension("EXT_texture_filter_anisotropic") || e.getExtension("WEBKIT_EXT_texture_filter_anisotropic") || e.getExtension("MOZ_EXT_texture_filter_anisotropic");if (t) {
        var _n2 = e.getParameter(t.MAX_TEXTURE_MAX_ANISOTROPY_EXT);return _n2 === 0 && (_n2 = 2), _n2;
      }return null;
    }(o)), l.push("webgl max combined texture image units:" + o.getParameter(o.MAX_COMBINED_TEXTURE_IMAGE_UNITS)), l.push("webgl max cube map texture size:" + o.getParameter(o.MAX_CUBE_MAP_TEXTURE_SIZE)), l.push("webgl max fragment uniform vectors:" + o.getParameter(o.MAX_FRAGMENT_UNIFORM_VECTORS)), l.push("webgl max render buffer size:" + o.getParameter(o.MAX_RENDERBUFFER_SIZE)), l.push("webgl max texture image units:" + o.getParameter(o.MAX_TEXTURE_IMAGE_UNITS)), l.push("webgl max texture size:" + o.getParameter(o.MAX_TEXTURE_SIZE)), l.push("webgl max varying vectors:" + o.getParameter(o.MAX_VARYING_VECTORS)), l.push("webgl max vertex attribs:" + o.getParameter(o.MAX_VERTEX_ATTRIBS)), l.push("webgl max vertex texture image units:" + o.getParameter(o.MAX_VERTEX_TEXTURE_IMAGE_UNITS)), l.push("webgl max vertex uniform vectors:" + o.getParameter(o.MAX_VERTEX_UNIFORM_VECTORS)), l.push("webgl max viewport dims:" + e(o.getParameter(o.MAX_VIEWPORT_DIMS))), l.push("webgl red bits:" + o.getParameter(o.RED_BITS)), l.push("webgl renderer:" + o.getParameter(o.RENDERER)), l.push("webgl shading language version:" + o.getParameter(o.SHADING_LANGUAGE_VERSION)), l.push("webgl stencil bits:" + o.getParameter(o.STENCIL_BITS)), l.push("webgl vendor:" + o.getParameter(o.VENDOR)), l.push("webgl version:" + o.getParameter(o.VERSION));try {
      var _s = o.getExtension("WEBGL_debug_renderer_info");_s && (l.push("webgl unmasked vendor:" + o.getParameter(_s.UNMASKED_VENDOR_WEBGL)), l.push("webgl unmasked renderer:" + o.getParameter(_s.UNMASKED_RENDERER_WEBGL)));
    } catch (e) {}return o.getShaderPrecisionFormat && c(["FLOAT", "INT"], function (i) {
      c(["VERTEX", "FRAGMENT"], function (r) {
        c(["HIGH", "MEDIUM", "LOW"], function (a) {
          c(["precision", "rangeMin", "rangeMax"], function (e) {
            var t = o.getShaderPrecisionFormat(o[r + "_SHADER"], o[a + "_" + i])[e];e !== "precision" && (e = "precision " + e);var n = ["webgl ", r.toLowerCase(), " shader ", a.toLowerCase(), " ", i.toLowerCase(), " ", e, ":", t].join("");l.push(n);
          });
        });
      });
    }), V(o), l;
  };var O = function O() {
    try {
      var _e = U();var _t2 = _e.getExtension("WEBGL_debug_renderer_info");var _n3 = _e.getParameter(_t2.UNMASKED_VENDOR_WEBGL) + "~" + _e.getParameter(_t2.UNMASKED_RENDERER_WEBGL);return V(_e), _n3;
    } catch (e) {
      return null;
    }
  };var M = function M() {
    var e = document.createElement("div");e.innerHTML = "&nbsp;";var t = !(e.className = "adsbox");try {
      document.body.appendChild(e), t = document.getElementsByClassName("adsbox")[0].offsetHeight === 0, document.body.removeChild(e);
    } catch (e) {
      t = !1;
    }return t;
  };var P = function P() {
    if (void 0 !== navigator.languages) try {
      if (navigator.languages[0].substr(0, 2) !== navigator.language.substr(0, 2)) return !0;
    } catch (e) {
      return !0;
    }return !1;
  };var b = function b() {
    return window.screen.width < window.screen.availWidth || window.screen.height < window.screen.availHeight;
  };var L = function L() {
    var e = void 0;var t = navigator.userAgent.toLowerCase();var n = navigator.oscpu;var a = navigator.platform.toLowerCase();if (e = t.indexOf("windows phone") >= 0 ? "Windows Phone" : t.indexOf("windows") >= 0 || t.indexOf("win16") >= 0 || t.indexOf("win32") >= 0 || t.indexOf("win64") >= 0 || t.indexOf("win95") >= 0 || t.indexOf("win98") >= 0 || t.indexOf("winnt") >= 0 || t.indexOf("wow64") >= 0 ? "Windows" : t.indexOf("android") >= 0 ? "Android" : t.indexOf("linux") >= 0 || t.indexOf("cros") >= 0 || t.indexOf("x11") >= 0 ? "Linux" : t.indexOf("iphone") >= 0 || t.indexOf("ipad") >= 0 || t.indexOf("ipod") >= 0 || t.indexOf("crios") >= 0 || t.indexOf("fxios") >= 0 ? "iOS" : t.indexOf("macintosh") >= 0 || t.indexOf("mac_powerpc)") >= 0 ? "Mac" : "Other", ("ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) && e !== "Windows" && e !== "Windows Phone" && e !== "Android" && e !== "iOS" && e !== "Other" && t.indexOf("cros") === -1) return !0;if (void 0 !== n) {
      if ((n = n.toLowerCase()).indexOf("win") >= 0 && e !== "Windows" && e !== "Windows Phone") return !0;if (n.indexOf("linux") >= 0 && e !== "Linux" && e !== "Android") return !0;if (n.indexOf("mac") >= 0 && e !== "Mac" && e !== "iOS") return !0;if ((n.indexOf("win") === -1 && n.indexOf("linux") === -1 && n.indexOf("mac") === -1) != (e === "Other")) return !0;
    }return a.indexOf("win") >= 0 && e !== "Windows" && e !== "Windows Phone" || (a.indexOf("linux") >= 0 || a.indexOf("android") >= 0 || a.indexOf("pike") >= 0) && e !== "Linux" && e !== "Android" || (a.indexOf("mac") >= 0 || a.indexOf("ipad") >= 0 || a.indexOf("ipod") >= 0 || a.indexOf("iphone") >= 0) && e !== "Mac" && e !== "iOS" || !(a.indexOf("arm") >= 0 && e === "Windows Phone") && !(a.indexOf("pike") >= 0 && t.indexOf("opera mini") >= 0) && ((a.indexOf("win") < 0 && a.indexOf("linux") < 0 && a.indexOf("mac") < 0 && a.indexOf("iphone") < 0 && a.indexOf("ipad") < 0 && a.indexOf("ipod") < 0) != (e === "Other") || void 0 === navigator.plugins && e !== "Windows" && e !== "Windows Phone");
  };var I = function I() {
    var e = void 0;var t = navigator.userAgent.toLowerCase();var n = navigator.productSub;if (t.indexOf("edge/") >= 0 || t.indexOf("iemobile/") >= 0) return !1;if (t.indexOf("opera mini") >= 0) return !1;if (((e = t.indexOf("firefox/") >= 0 ? "Firefox" : t.indexOf("opera/") >= 0 || t.indexOf(" opr/") >= 0 ? "Opera" : t.indexOf("chrome/") >= 0 ? "Chrome" : t.indexOf("safari/") >= 0 ? t.indexOf("android 1.") >= 0 || t.indexOf("android 2.") >= 0 || t.indexOf("android 3.") >= 0 || t.indexOf("android 4.") >= 0 ? "AOSP" : "Safari" : t.indexOf("trident/") >= 0 ? "Internet Explorer" : "Other") === "Chrome" || e === "Safari" || e === "Opera") && n !== "20030107") return !0;var a = void 0;var r = eval.toString().length;if (r === 37 && e !== "Safari" && e !== "Firefox" && e !== "Other") return !0;if (r === 39 && e !== "Internet Explorer" && e !== "Other") return !0;if (r === 33 && e !== "Chrome" && e !== "AOSP" && e !== "Opera" && e !== "Other") return !0;try {
      throw "a";
    } catch (e) {
      try {
        e.toSource(), a = !0;
      } catch (e) {
        a = !1;
      }
    }return a && e !== "Firefox" && e !== "Other";
  };var k = function k() {
    var e = document.createElement("canvas");return !(!e.getContext || !e.getContext("2d"));
  };var D = function D() {
    if (!k()) return !1;var e = U();var t = !!window.WebGLRenderingContext && !!e;return V(e), t;
  };var R = function R() {
    return navigator.appName === "Microsoft Internet Explorer" || !(navigator.appName !== "Netscape" || !/Trident/.test(navigator.userAgent));
  };var N = function N() {
    return ("msWriteProfilerMark" in window) + ("msLaunchUri" in navigator) + ("msSaveBlob" in navigator) >= 2;
  };var _ = function _() {
    return void 0 !== window.swfobject;
  };var F = function F() {
    return window.swfobject.hasFlashPlayerVersion("9.0.0");
  };var G = function G(t, e) {
    var n = "___fp_swf_loaded";window[n] = function (e) {
      t(e);
    };var a = void 0;var r = void 0;var i = e.fonts.swfContainerId;(r = document.createElement("div")).setAttribute("id", a.fonts.swfContainerId), document.body.appendChild(r);var o = { onReady: n };window.swfobject.embedSWF(e.fonts.swfPath, i, "1", "1", "9.0.0", !1, o, { allowScriptAccess: "always", menu: "false" }, {});
  };var U = function U() {
    var e = document.createElement("canvas");var t = null;try {
      t = e.getContext("webgl") || e.getContext("experimental-webgl");
    } catch (e) {}return t = t || null;
  };var V = function V(e) {
    var t = e.getExtension("WEBGL_lose_context");t != null && t.loseContext();
  };var H = [{ key: "userAgent", getData: function getData(e) {
      e(navigator.userAgent);
    }
  }, { key: "webdriver", getData: function getData(e, t) {
      e(navigator.webdriver == null ? t.NOT_AVAILABLE : navigator.webdriver);
    }
  }, { key: "language", getData: function getData(e, t) {
      e(navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage || t.NOT_AVAILABLE);
    }
  }, { key: "colorDepth", getData: function getData(e, t) {
      e(window.screen.colorDepth || t.NOT_AVAILABLE);
    }
  }, { key: "deviceMemory", getData: function getData(e, t) {
      e(navigator.deviceMemory || t.NOT_AVAILABLE);
    }
  }, { key: "pixelRatio", getData: function getData(e, t) {
      e(window.devicePixelRatio || t.NOT_AVAILABLE);
    }
  }, { key: "hardwareConcurrency", getData: function getData(e, t) {
      e(C(t));
    }
  }, { key: "screenResolution", getData: function getData(e, t) {
      e(r(t));
    }
  }, { key: "availableScreenResolution", getData: function getData(e, t) {
      e(i(t));
    }
  }, { key: "timezoneOffset", getData: function getData(e) {
      e(new Date().getTimezoneOffset());
    }
  }, { key: "timezone", getData: function getData(e, t) {
      window.Intl && window.Intl.DateTimeFormat ? e(new window.Intl.DateTimeFormat().resolvedOptions().timeZone || t.NOT_AVAILABLE) : e(t.NOT_AVAILABLE);
    }
  }, { key: "sessionStorage", getData: function getData(e, t) {
      e(A(t));
    }
  }, { key: "localStorage", getData: function getData(e, t) {
      e(v(t));
    }
  }, { key: "indexedDb", getData: function getData(e, t) {
      e(S(t));
    }
  }, { key: "addBehavior", getData: function getData(e) {
      e(!!window.HTMLElement.prototype.addBehavior);
    }
  }, { key: "openDatabase", getData: function getData(e) {
      e(!!window.openDatabase);
    }
  }, { key: "cpuClass", getData: function getData(e, t) {
      e(w(t));
    }
  }, { key: "platform", getData: function getData(e, t) {
      e(B(t));
    }
  }, { key: "doNotTrack", getData: function getData(e, t) {
      e(y(t));
    }
  }, { key: "plugins", getData: function getData(e, t) {
      R() ? t.plugins.excludeIE ? e(t.EXCLUDED) : e(u(t)) : e(o(t));
    }
  }, { key: "canvas", getData: function getData(e, t) {
      k() ? e(E(t)) : e(t.NOT_AVAILABLE);
    }
  }, { key: "webgl", getData: function getData(e, t) {
      D() ? e(x()) : e(t.NOT_AVAILABLE);
    }
  }, { key: "webglVendorAndRenderer", getData: function getData(e) {
      D() ? e(O()) : e();
    }
  }, { key: "adBlock", getData: function getData(e) {
      e(M());
    }
  }, { key: "hasLiedLanguages", getData: function getData(e) {
      e(P());
    }
  }, { key: "hasLiedResolution", getData: function getData(e) {
      e(b());
    }
  }, { key: "hasLiedOs", getData: function getData(e) {
      e(L());
    }
  }, { key: "hasLiedBrowser", getData: function getData(e) {
      e(I());
    }
  }, { key: "touchSupport", getData: function getData(e) {
      e(t());
    }
  }, { key: "fonts", getData: function getData(e, t) {
      var u = ["monospace", "sans-serif", "serif"];var d = ["Andale Mono", "Arial", "Arial Black", "Arial Hebrew", "Arial MT", "Arial Narrow", "Arial Rounded MT Bold", "Arial Unicode MS", "Bitstream Vera Sans Mono", "Book Antiqua", "Bookman Old Style", "Calibri", "Cambria", "Cambria Math", "Century", "Century Gothic", "Century Schoolbook", "Comic Sans", "Comic Sans MS", "Consolas", "Courier", "Courier New", "Geneva", "Georgia", "Helvetica", "Helvetica Neue", "Impact", "Lucida Bright", "Lucida Calligraphy", "Lucida Console", "Lucida Fax", "LUCIDA GRANDE", "Lucida Handwriting", "Lucida Sans", "Lucida Sans Typewriter", "Lucida Sans Unicode", "Microsoft Sans Serif", "Monaco", "Monotype Corsiva", "MS Gothic", "MS Outlook", "MS PGothic", "MS Reference Sans Serif", "MS Sans Serif", "MS Serif", "MYRIAD", "MYRIAD PRO", "Palatino", "Palatino Linotype", "Segoe Print", "Segoe Script", "Segoe UI", "Segoe UI Light", "Segoe UI Semibold", "Segoe UI Symbol", "Tahoma", "Times", "Times New Roman", "Times New Roman PS", "Trebuchet MS", "Verdana", "Wingdings", "Wingdings 2", "Wingdings 3"];if (t.fonts.extendedJsFonts) {
        d = d.concat(["Abadi MT Condensed Light", "Academy Engraved LET", "ADOBE CASLON PRO", "Adobe Garamond", "ADOBE GARAMOND PRO", "Agency FB", "Aharoni", "Albertus Extra Bold", "Albertus Medium", "Algerian", "Amazone BT", "American Typewriter", "American Typewriter Condensed", "AmerType Md BT", "Andalus", "Angsana New", "AngsanaUPC", "Antique Olive", "Aparajita", "Apple Chancery", "Apple Color Emoji", "Apple SD Gothic Neo", "Arabic Typesetting", "ARCHER", "ARNO PRO", "Arrus BT", "Aurora Cn BT", "AvantGarde Bk BT", "AvantGarde Md BT", "AVENIR", "Ayuthaya", "Bandy", "Bangla Sangam MN", "Bank Gothic", "BankGothic Md BT", "Baskerville", "Baskerville Old Face", "Batang", "BatangChe", "Bauer Bodoni", "Bauhaus 93", "Bazooka", "Bell MT", "Bembo", "Benguiat Bk BT", "Berlin Sans FB", "Berlin Sans FB Demi", "Bernard MT Condensed", "BernhardFashion BT", "BernhardMod BT", "Big Caslon", "BinnerD", "Blackadder ITC", "BlairMdITC TT", "Bodoni 72", "Bodoni 72 Oldstyle", "Bodoni 72 Smallcaps", "Bodoni MT", "Bodoni MT Black", "Bodoni MT Condensed", "Bodoni MT Poster Compressed", "Bookshelf Symbol 7", "Boulder", "Bradley Hand", "Bradley Hand ITC", "Bremen Bd BT", "Britannic Bold", "Broadway", "Browallia New", "BrowalliaUPC", "Brush Script MT", "Californian FB", "Calisto MT", "Calligrapher", "Candara", "CaslonOpnface BT", "Castellar", "Centaur", "Cezanne", "CG Omega", "CG Times", "Chalkboard", "Chalkboard SE", "Chalkduster", "Charlesworth", "Charter Bd BT", "Charter BT", "Chaucer", "ChelthmITC Bk BT", "Chiller", "Clarendon", "Clarendon Condensed", "CloisterBlack BT", "Cochin", "Colonna MT", "Constantia", "Cooper Black", "Copperplate", "Copperplate Gothic", "Copperplate Gothic Bold", "Copperplate Gothic Light", "CopperplGoth Bd BT", "Corbel", "Cordia New", "CordiaUPC", "Cornerstone", "Coronet", "Cuckoo", "Curlz MT", "DaunPenh", "Dauphin", "David", "DB LCD Temp", "DELICIOUS", "Denmark", "DFKai-SB", "Didot", "DilleniaUPC", "DIN", "DokChampa", "Dotum", "DotumChe", "Ebrima", "Edwardian Script ITC", "Elephant", "English 111 Vivace BT", "Engravers MT", "EngraversGothic BT", "Eras Bold ITC", "Eras Demi ITC", "Eras Light ITC", "Eras Medium ITC", "EucrosiaUPC", "Euphemia", "Euphemia UCAS", "EUROSTILE", "Exotc350 Bd BT", "FangSong", "Felix Titling", "Fixedsys", "FONTIN", "Footlight MT Light", "Forte", "FrankRuehl", "Fransiscan", "Freefrm721 Blk BT", "FreesiaUPC", "Freestyle Script", "French Script MT", "FrnkGothITC Bk BT", "Fruitger", "FRUTIGER", "Futura", "Futura Bk BT", "Futura Lt BT", "Futura Md BT", "Futura ZBlk BT", "FuturaBlack BT", "Gabriola", "Galliard BT", "Gautami", "Geeza Pro", "Geometr231 BT", "Geometr231 Hv BT", "Geometr231 Lt BT", "GeoSlab 703 Lt BT", "GeoSlab 703 XBd BT", "Gigi", "Gill Sans", "Gill Sans MT", "Gill Sans MT Condensed", "Gill Sans MT Ext Condensed Bold", "Gill Sans Ultra Bold", "Gill Sans Ultra Bold Condensed", "Gisha", "Gloucester MT Extra Condensed", "GOTHAM", "GOTHAM BOLD", "Goudy Old Style", "Goudy Stout", "GoudyHandtooled BT", "GoudyOLSt BT", "Gujarati Sangam MN", "Gulim", "GulimChe", "Gungsuh", "GungsuhChe", "Gurmukhi MN", "Haettenschweiler", "Harlow Solid Italic", "Harrington", "Heather", "Heiti SC", "Heiti TC", "HELV", "Herald", "High Tower Text", "Hiragino Kaku Gothic ProN", "Hiragino Mincho ProN", "Hoefler Text", "Humanst 521 Cn BT", "Humanst521 BT", "Humanst521 Lt BT", "Imprint MT Shadow", "Incised901 Bd BT", "Incised901 BT", "Incised901 Lt BT", "INCONSOLATA", "Informal Roman", "Informal011 BT", "INTERSTATE", "IrisUPC", "Iskoola Pota", "JasmineUPC", "Jazz LET", "Jenson", "Jester", "Jokerman", "Juice ITC", "Kabel Bk BT", "Kabel Ult BT", "Kailasa", "KaiTi", "Kalinga", "Kannada Sangam MN", "Kartika", "Kaufmann Bd BT", "Kaufmann BT", "Khmer UI", "KodchiangUPC", "Kokila", "Korinna BT", "Kristen ITC", "Krungthep", "Kunstler Script", "Lao UI", "Latha", "Leelawadee", "Letter Gothic", "Levenim MT", "LilyUPC", "Lithograph", "Lithograph Light", "Long Island", "Lydian BT", "Magneto", "Maiandra GD", "Malayalam Sangam MN", "Malgun Gothic", "Mangal", "Marigold", "Marion", "Marker Felt", "Market", "Marlett", "Matisse ITC", "Matura MT Script Capitals", "Meiryo", "Meiryo UI", "Microsoft Himalaya", "Microsoft JhengHei", "Microsoft New Tai Lue", "Microsoft PhagsPa", "Microsoft Tai Le", "Microsoft Uighur", "Microsoft YaHei", "Microsoft Yi Baiti", "MingLiU", "MingLiU_HKSCS", "MingLiU_HKSCS-ExtB", "MingLiU-ExtB", "Minion", "Minion Pro", "Miriam", "Miriam Fixed", "Mistral", "Modern", "Modern No. 20", "Mona Lisa Solid ITC TT", "Mongolian Baiti", "MONO", "MoolBoran", "Mrs Eaves", "MS LineDraw", "MS Mincho", "MS PMincho", "MS Reference Specialty", "MS UI Gothic", "MT Extra", "MUSEO", "MV Boli", "Nadeem", "Narkisim", "NEVIS", "News Gothic", "News GothicMT", "NewsGoth BT", "Niagara Engraved", "Niagara Solid", "Noteworthy", "NSimSun", "Nyala", "OCR A Extended", "Old Century", "Old English Text MT", "Onyx", "Onyx BT", "OPTIMA", "Oriya Sangam MN", "OSAKA", "OzHandicraft BT", "Palace Script MT", "Papyrus", "Parchment", "Party LET", "Pegasus", "Perpetua", "Perpetua Titling MT", "PetitaBold", "Pickwick", "Plantagenet Cherokee", "Playbill", "PMingLiU", "PMingLiU-ExtB", "Poor Richard", "Poster", "PosterBodoni BT", "PRINCETOWN LET", "Pristina", "PTBarnum BT", "Pythagoras", "Raavi", "Rage Italic", "Ravie", "Ribbon131 Bd BT", "Rockwell", "Rockwell Condensed", "Rockwell Extra Bold", "Rod", "Roman", "Sakkal Majalla", "Santa Fe LET", "Savoye LET", "Sceptre", "Script", "Script MT Bold", "SCRIPTINA", "Serifa", "Serifa BT", "Serifa Th BT", "ShelleyVolante BT", "Sherwood", "Shonar Bangla", "Showcard Gothic", "Shruti", "Signboard", "SILKSCREEN", "SimHei", "Simplified Arabic", "Simplified Arabic Fixed", "SimSun", "SimSun-ExtB", "Sinhala Sangam MN", "Sketch Rockwell", "Skia", "Small Fonts", "Snap ITC", "Snell Roundhand", "Socket", "Souvenir Lt BT", "Staccato222 BT", "Steamer", "Stencil", "Storybook", "Styllo", "Subway", "Swis721 BlkEx BT", "Swiss911 XCm BT", "Sylfaen", "Synchro LET", "System", "Tamil Sangam MN", "Technical", "Teletype", "Telugu Sangam MN", "Tempus Sans ITC", "Terminal", "Thonburi", "Traditional Arabic", "Trajan", "TRAJAN PRO", "Tristan", "Tubular", "Tunga", "Tw Cen MT", "Tw Cen MT Condensed", "Tw Cen MT Condensed Extra Bold", "TypoUpright BT", "Unicorn", "Univers", "Univers CE 55 Medium", "Univers Condensed", "Utsaah", "Vagabond", "Vani", "Vijaya", "Viner Hand ITC", "VisualUI", "Vivaldi", "Vladimir Script", "Vrinda", "Westminster", "WHITNEY", "Wide Latin", "ZapfEllipt BT", "ZapfHumnst BT", "ZapfHumnst Dm BT", "Zapfino", "Zurich BlkEx BT", "Zurich Ex BT", "ZWAdobeF"]);
      }d = (d = d.concat(t.fonts.userDefinedFonts)).filter(function (e, t) {
        return d.indexOf(e) === t;
      });function f() {
        var e = document.createElement("span");return e.style.position = "absolute", e.style.left = "-9999px", e.style.fontSize = "72px", e.style.fontStyle = "normal", e.style.fontWeight = "normal", e.style.letterSpacing = "normal", e.style.lineBreak = "auto", e.style.lineHeight = "normal", e.style.textTransform = "none", e.style.textAlign = "left", e.style.textDecoration = "none", e.style.textShadow = "none", e.style.whiteSpace = "normal", e.style.wordBreak = "normal", e.style.wordSpacing = "normal", e.innerHTML = "mmmmmmmmmmlli", e;
      }function n(e) {
        for (var t = !1, n = 0; n < u.length; n++) {
          if (t = e[n].offsetWidth !== i[u[n]] || e[n].offsetHeight !== o[u[n]]) return t;
        }return t;
      }var a = document.getElementsByTagName("body")[0];var r = document.createElement("div");var g = document.createElement("div");var i = {};var o = {};var l = function () {
        for (var e = [], t = 0, n = u.length; t < n; t++) {
          var _a2 = f();_a2.style.fontFamily = u[t], r.appendChild(_a2), e.push(_a2);
        }return e;
      }();a.appendChild(r);for (var _s2 = 0, _c = u.length; _s2 < _c; _s2++) {
        i[u[_s2]] = l[_s2].offsetWidth, o[u[_s2]] = l[_s2].offsetHeight;
      }var h = function () {
        for (var e, t, n, a = {}, r = 0, i = d.length; r < i; r++) {
          for (var o = [], l = 0, s = u.length; l < s; l++) {
            var _c2 = (e = d[r], t = u[l], n = void 0, (n = f()).style.fontFamily = "'" + e + "'," + t, n);g.appendChild(_c2), o.push(_c2);
          }a[d[r]] = o;
        }return a;
      }();a.appendChild(g);for (var m = [], p = 0, T = d.length; p < T; p++) {
        n(h[d[p]]) && m.push(d[p]);
      }a.removeChild(g), a.removeChild(r), e(m);
    },
    pauseBefore: !0 }, { key: "fontsFlash", getData: function getData(t, e) {
      return _() ? F() ? e.fonts.swfPath ? void G(function (e) {
        t(e);
      }, e) : t("missing options.fonts.swfPath") : t("flash not installed") : t("swf object not loaded");
    },
    pauseBefore: !0 }, { key: "audio", getData: function getData(n, e) {
      var t = e.audio;if (t.excludeIOS11 && navigator.userAgent.match(/OS 11.+Version\/11.+Safari/)) return n(e.EXCLUDED);var a = window.OfflineAudioContext || window.webkitOfflineAudioContext;if (a == null) return n(e.NOT_AVAILABLE);var r = new a(1, 44100, 44100);var i = r.createOscillator();i.type = "triangle", i.frequency.setValueAtTime(1e4, r.currentTime);var o = r.createDynamicsCompressor();c([["threshold", -50], ["knee", 40], ["ratio", 12], ["reduction", -20], ["attack", 0], ["release", 0.25]], function (e) {
        void 0 !== o[e[0]] && typeof o[e[0]].setValueAtTime === "function" && o[e[0]].setValueAtTime(e[1], r.currentTime);
      }), i.connect(o), o.connect(r.destination), i.start(0), r.startRendering();var l = setTimeout(function () {
        return console.warn("Audio fingerprint timed out. Please report bug at https://github.com/fingerprintjs/fingerprintjs with your user agent: \"" + navigator.userAgent + "\"."), r.oncomplete = function () {}, r = null, n("audioTimeout");
      }, t.timeout);r.oncomplete = function (e) {
        var t = void 0;try {
          clearTimeout(l), t = e.renderedBuffer.getChannelData(0).slice(4500, 5e3).reduce(function (e, t) {
            return e + Math.abs(t);
          }, 0).toString(), i.disconnect(), o.disconnect();
        } catch (e) {
          return void n(e);
        }n(t);
      };
    }
  }, { key: "enumerateDevices", getData: function getData(t, e) {
      if (!n()) return t(e.NOT_AVAILABLE);navigator.mediaDevices.enumerateDevices().then(function (e) {
        t(e.map(function (e) {
          return "id=" + e.deviceId + ";gid=" + e.groupId + ";" + e.kind + ";" + e.label;
        }));
      }).catch(function (e) {
        t(e);
      });
    }
  }];return a.get = function (n, a) {
    (function (e, t) {
      if (t == null) return;var n = void 0;var a = void 0;for (a in t) {
        (n = t[a]) == null || Object.prototype.hasOwnProperty.call(e, a) || (e[a] = n);
      }
    })(n = a ? n || {} : (a = n, {}), e), n.components = n.extraComponents.concat(H);var r = { data: [], addPreprocessedComponent: function addPreprocessedComponent(e, t) {
        typeof n.preprocessor === "function" && (t = n.preprocessor(e, t)), r.data.push({ key: e, value: t });
      }
    };var i = -1;var o = function o(e) {
      if ((i += 1) >= n.components.length) a(r.data);else {
        var _t3 = n.components[i];if (n.excludes[_t3.key]) o(!1);else {
          if (!e && _t3.pauseBefore) return --i, void setTimeout(function () {
            o(!0);
          }, 1);try {
            _t3.getData(function (e) {
              r.addPreprocessedComponent(_t3.key, e), o(!1);
            }, n);
          } catch (e) {
            r.addPreprocessedComponent(_t3.key, String(e)), o(!1);
          }
        }
      }
    };o(!1);
  }, a.getPromise = function (n) {
    return new Promise(function (e, t) {
      a.get(n, e);
    });
  }, a.getV18 = function (i, o) {
    return o == null && (o = i, i = {}), a.get(i, function (e) {
      for (var t = [], n = 0; n < e.length; n++) {
        var _a3 = e[n];if (_a3.value === (i.NOT_AVAILABLE || "not available")) t.push({ key: _a3.key, value: "unknown" });else if (_a3.key === "plugins") t.push({ key: "plugins", value: s(_a3.value, function (e) {
            var t = s(e[2], function (e) {
              return e.join ? e.join("~") : e;
            }).join(",");return [e[0], e[1], t].join("::");
          }) });else if (["canvas", "webgl"].indexOf(_a3.key) !== -1 && Array.isArray(_a3.value)) t.push({ key: _a3.key, value: _a3.value.join("~") });else if (["sessionStorage", "localStorage", "indexedDb", "addBehavior", "openDatabase"].indexOf(_a3.key) !== -1) {
          if (!_a3.value) continue;t.push({ key: _a3.key, value: 1 });
        } else _a3.value ? t.push(_a3.value.join ? { key: _a3.key, value: _a3.value.join(";") } : _a3) : t.push({ key: _a3.key, value: _a3.value });
      }var r = l(s(t, function (e) {
        return e.value;
      }).join("~~~"), 31);o(r, t);
    });
  }, a.x64hash128 = l, a.VERSION = "2.1.4", a;
});

var isVisible = function isVisible(elem) {
  if (!(elem instanceof Element)) throw Error('DomUtil: elem is not an element.');
  var style = getComputedStyle(elem);
  if (style.display === 'none') return false;
  if (style.visibility !== 'visible') return false;
  if (style.opacity < 0.1) return false;
  if (elem.offsetWidth + elem.offsetHeight + elem.getBoundingClientRect().height + elem.getBoundingClientRect().width === 0) {
    return false;
  }
  var elemCenter = {
    x: elem.getBoundingClientRect().left + elem.offsetWidth / 2,
    y: elem.getBoundingClientRect().top + elem.offsetHeight / 2
  };
  if (elemCenter.x < 0) return false;
  if (elemCenter.x > (document.documentElement.clientWidth || window.innerWidth)) return false;
  if (elemCenter.y < 0) return false;
  if (elemCenter.y > (document.documentElement.clientHeight || window.innerHeight)) return false;
  var pointContainer = document.elementFromPoint(elemCenter.x, elemCenter.y);
  do {
    if (pointContainer === elem) return true;
  } while (pointContainer = pointContainer.parentNode);
  return false;
};

var getBanner = function getBanner(hostname, metaContent, adZoneId, murmur) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://www.runesx.com/api/soup/start", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
      hostname: hostname,
      metaContent: metaContent,
      adZoneId: adZoneId,
      murmur: murmur
    }));
    xhr.onload = function () {
      var status = xhr.status;

      var data = JSON.parse(this.responseText);
      if (status === 200) {
        resolve(data);
      } else {
        reject(data);
      }
    };
  });
};

var adSendComplete = function adSendComplete(hostname, metaContent, adZoneId, murmur, banner) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://www.runesx.com/api/soup/complete", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
      id: banner.ad.id,
      code: banner.ad.code,
      hostname: hostname,
      metaContent: metaContent,
      adZoneId: adZoneId,
      murmur: murmur
    }));
    xhr.onload = function () {
      var status = xhr.status;

      var data = JSON.parse(this.responseText);
      if (status === 200) {
        resolve(data);
      } else {
        reject(data);
      }
    };
  });
};

var mouseOver = function mouseOver(adZoneId) {
  var element = document.getElementById("runesx-unicorn-" + adZoneId);
  element.style.width = "auto";
};

var mouseOut = function mouseOut(adZoneId) {
  var element = document.getElementById("runesx-unicorn-" + adZoneId);
  element.style.width = "15px";
};

var publish = async function publish() {
  Fingerprint2.get(async function (components) {
    var values = components.map(function (component) {
      return component.value;
    });
    var murmur = Fingerprint2.x64hash128(values.join(''), 31);
    var hostname = void 0;
    hostname = window.location;
    if (hostname === '') {
      hostname = window.top.location || window.parent.location;
    }
    var metaContent = document.querySelector('meta[name="runesx"]').content || '';
    var adZonePattern = /^runesx/;
    var adZones = [];
    var els = document.getElementsByTagName('*');
    for (var i = els.length; i--;) {
      if (adZonePattern.test(els[i].id)) {
        adZones.push(els[i].id.replace('runesx-', ''));
      }
    }
    await Promise.all(adZones.map(async function (adZoneId) {
      var testAd = document.getElementById("runesx-" + adZoneId);
      if (testAd.innerHTML === "") {
        var banner = await getBanner(hostname, metaContent, adZoneId, murmur);

        if ("fonts" in document) {
          var font = new FontFace("TeXGyreHeros-Regular", "local('TeXGyreHeros-Regular'), url(https://www.runesx.com/uploads/fonts/texgyreheros-regular.woff) format('woff')", { weight: "normal", style: "normal" });

          Promise.all([font.load()]).then(function (loadedFonts) {
            loadedFonts.forEach(function (font) {
              document.fonts.add(font);
            });
          });
        }

        var runesDivWrapperElement = document.createElement("div");
        runesDivWrapperElement.setAttribute("id", "runesx-wrapper-" + adZoneId);
        runesDivWrapperElement.setAttribute("style", "position: relative; width: " + banner.ad.width + "px; height: " + banner.ad.height + "px;");
        document.getElementById("runesx-" + adZoneId).appendChild(runesDivWrapperElement);
        var linkElem = document.createElement("a");
        linkElem.setAttribute("href", banner.ad.url);
        linkElem.setAttribute("id", "runesx-link-" + adZoneId);

        document.getElementById("runesx-wrapper-" + adZoneId).appendChild(linkElem);
        var imgElem = document.createElement("img");
        imgElem.setAttribute("src", "https://www.runesx.com/uploads/banners/" + banner.ad.banner_path);
        imgElem.setAttribute("height", banner.ad.height);
        imgElem.setAttribute("width", banner.ad.width);
        imgElem.setAttribute("alt", "RunesX ad");
        document.getElementById("runesx-link-" + adZoneId).appendChild(imgElem);
        var runesDivElement = document.createElement("div");
        runesDivElement.setAttribute("style", "z-index: 5; background: rgb(41, 44, 58); position: absolute; right: 0; top: 0; height: 15px; width: 15px; cursor: pointer;");
        runesDivElement.setAttribute("id", "runesx-unicorn-" + adZoneId);
        document.getElementById("runesx-wrapper-" + adZoneId).appendChild(runesDivElement);
        document.getElementById("runesx-unicorn-" + adZoneId).addEventListener("mouseover", function () {
          return mouseOver(adZoneId);
        });
        document.getElementById("runesx-unicorn-" + adZoneId).addEventListener("mouseout", function () {
          return mouseOut(adZoneId);
        });
        var imgElemRunes = document.createElement("img");
        imgElemRunes.setAttribute("src", 'https://www.runesx.com/uploads/icon.png');
        imgElemRunes.setAttribute("id", "runesx-unicorn-icon-" + adZoneId);
        imgElemRunes.setAttribute("style", "position: relative; float:left;");
        document.getElementById("runesx-unicorn-" + adZoneId).appendChild(imgElemRunes);
        var linkElemRunes = document.createElement("a");
        linkElemRunes.setAttribute("href", 'https://www.runesx.com/');
        linkElemRunes.setAttribute("id", "runesx-unicorn-link-" + adZoneId);
        linkElemRunes.setAttribute("style", "font-family: 'TeXGyreHeros-Regular'; border-bottom: #DB626B 1px dotted; color: #DB626B; display: block; position: relative; font-size: 11px; overflow: hidden; line-height: 13px; z-index: 5;");
        linkElemRunes.innerText = 'Advertise here';
        document.getElementById("runesx-unicorn-" + adZoneId).appendChild(linkElemRunes);

        var checkElementOne = document.getElementById("runesx-" + adZoneId);
        var checkElementTwo = document.getElementById("runesx-" + adZoneId);
        var checkElementThree = document.getElementById("runesx-" + adZoneId);
        var earnedImpression = false;
        window.addEventListener('scroll', function (e) {
          if (!earnedImpression) {
            if (isVisible(checkElementOne) && isVisible(checkElementTwo) && isVisible(checkElementThree)) {
              earnedImpression = true;
              adSendComplete(hostname, metaContent, adZoneId, murmur, banner);
            }
          }
        });
        if (!earnedImpression) {
          if (isVisible(checkElementOne) && isVisible(checkElementTwo) && isVisible(checkElementThree)) {
            earnedImpression = true;
            adSendComplete(hostname, metaContent, adZoneId, murmur, banner);
          }
        }
      }
    }));
  });
};

var execute = function execute() {
  publish();
  // window.setInterval(() => {
  //  publish();
  // }, 2000);
};
docReady(execute);
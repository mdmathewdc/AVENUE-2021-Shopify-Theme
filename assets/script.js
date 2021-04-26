// Open Snippets > head.liquid and change 'script.min.js' to 'script.js'
// Edit script.js
// Minimize with: https://javascript-minifier.com/
// Copy and paste to script.min.js
// Revert head.liquid

window.theme = window.theme || {};
theme.Sections = function Sections() {
  this.constructors = {};
  this.instances = [];
  document.addEventListener('shopify:section:load',this._onSectionLoad.bind(this));
  document.addEventListener('shopify:section:unload',this._onSectionUnload.bind(this));
  document.addEventListener('shopify:section:select',this._onSelect.bind(this));
  document.addEventListener('shopify:section:deselect',this._onDeselect.bind(this));
  document.addEventListener('shopify:block:select',this._onBlockSelect.bind(this));
  document.addEventListener('shopify:block:deselect',this._onBlockDeselect.bind(this));
};
theme.Sections.prototype = Object.assign({}, theme.Sections.prototype, {
  _createInstance: function(container, constructor) {
    var id = container.getAttribute('data-section-id');
    var type = container.getAttribute('data-section-type');
    constructor = constructor || this.constructors[type];
    if (typeof constructor === 'undefined') {
      return;
    }
    var instance = Object.assign(new constructor(container), {
      id: id,
      type: type,
      container: container
    });
    this.instances.push(instance);
  },
  _onSectionLoad: function(evt) {
    var element = document.querySelectorAll('.animate-section');
    element.forEach(function(e) {
      e.classList.remove('animate-section');
    });
    var container = document.querySelector(
      '[data-section-id="' + evt.detail.sectionId + '"]'
    );
    if (container) {
      this._createInstance(container);
    }
  },
  _onSectionUnload: function(evt) {
    this.instances = this.instances.filter(function(instance) {
      var isEventInstance = instance.id === evt.detail.sectionId;
      if (isEventInstance) {
        if (typeof instance.onUnload === 'function') {
          instance.onUnload(evt);
        }
      }
      return !isEventInstance;
    });
  },
  _onSelect: function(evt) {
    var instance = this.instances.find(function(instance) {
      return instance.id === evt.detail.sectionId;
    });
    if (
      typeof instance !== 'undefined' &&
      typeof instance.onSelect === 'function'
    ) {
      instance.onSelect(evt);
    }
  },
  _onDeselect: function(evt) {
    var instance = this.instances.find(function(instance) {
      return instance.id === evt.detail.sectionId;
    });
    if (
      typeof instance !== 'undefined' &&
      typeof instance.onDeselect === 'function'
    ) {
      instance.onDeselect(evt);
    }
  },
  _onBlockSelect: function(evt) {
    var instance = this.instances.find(function(instance) {
      return instance.id === evt.detail.sectionId;
    });
    if (
      typeof instance !== 'undefined' &&
      typeof instance.onBlockSelect === 'function'
    ) {
      instance.onBlockSelect(evt);
    }
  },
  _onBlockDeselect: function(evt) {
    var instance = this.instances.find(function(instance) {
      return instance.id === evt.detail.sectionId;
    });
    if (
      typeof instance !== 'undefined' &&
      typeof instance.onBlockDeselect === 'function'
    ) {
      instance.onBlockDeselect(evt);
    }
  },
  register: function(type, constructor) {
    this.constructors[type] = constructor;
    document.querySelectorAll('[data-section-type="' + type + '"]').forEach(
      function(container) {
        this._createInstance(container, constructor);
      }.bind(this)
    );
  }
});
theme.Helpers = (function() {
  var touchDevice = false;
  function setTouch() {
    touchDevice = true;
  }
  function isTouch() {
    return touchDevice;
  }
  function debounce(func, wait, immediate) {
    var timeout;

    return function() {
      var context = this,
          args = arguments;

      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };

      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }
  function getScript(source, beforeEl) {
    return new Promise(function(resolve, reject) {
      var script = document.createElement('script');
      var prior = beforeEl || document.getElementsByTagName('script')[0];
      script.async = true;
      script.defer = true;
      function onloadHander(_, isAbort) {
        if (
          isAbort ||
          !script.readyState ||
          /loaded|complete/.test(script.readyState)
        ) {
          script.onload = null;
          script.onreadystatechange = null;
          script = undefined;

          if (isAbort) {
            reject();
          } else {
            resolve();
          }
        }
      }
      script.onload = onloadHander;
      script.onreadystatechange = onloadHander;
      script.src = source;
      prior.parentNode.insertBefore(script, prior);
    });
  }
  return {
    setTouch: setTouch,
    isTouch: isTouch,
    debounce: debounce,
    getScript: getScript
  };
})();
theme.menuHeight = function (container) {
  var hdr = document.getElementById('header-toolbar');
  var stky = hdr.getAttribute('data-sticky');  
    if (stky == 'true') {
      document.selectors = {
        sht: hdr.offsetHeight
      };
    } else {
      document.selectors = {
        sht: 0
      };
    };
    var sN = container.querySelector('.sticky-navigation-container').offsetHeight;
    var iH = window.innerHeight;
    var cD = document.getElementById('cart-dropdown');
    var rM = container.querySelector('.responsiveMenu');
    if (cD) {
      cD.style.maxHeight = iH - sN - 60 + 'px';
    }
    rM.style.maxHeight = iH - sN - 20 + 'px';
    if (rM.classList.contains('isDesktop')) {
      var pLu = rM.querySelectorAll('.parent-level-ul');
      pLu.forEach(function(p) {
        if (p) {
          p.style.maxHeight = iH - parseInt(document.selectors.sht) - 40 + 'px'; 
        }
      });
    }
};
theme.menuAdjust = function () {
  var iW = document.body.scrollWidth;
  var mMW = parseInt(document.querySelector('.responsiveMenu').getAttribute('data-maxmobilewidth'));
  var isInViewport = function (e) {
    var eT = e.getBoundingClientRect().top + window.pageYOffset;
    var eB = eT + e.offsetHeight;
    var vT = window.scrollY;
    var vB = vT + window.innerHeight;
    return eB > vT && eT < vB;
  };  
  var sP = 0;
  window.onscroll = function(){    
    var fUL = document.querySelectorAll('.filter ul.options');
    fUL.forEach(function(f) {
      f.style.display = 'none';
      f.classList.remove('active');
    });
    var fE = document.querySelectorAll('.filter .select .error');
    fE.forEach(function(f) {
      f.style.display = 'none';
    });
    var aSD = document.querySelectorAll('.animate-section-div');
    aSD.forEach(function(a) {
      var aaS = a.querySelector('.animate-section');
      if (aaS) {
        aaS.classList.remove('load','loaded');
        if (isInViewport(a)) {
          aaS.classList.add('go');
          aaS.classList.remove('stop');
        } else {
          aaS.classList.add('stop');
          aaS.classList.remove('go');
        }
        if ((document.body.getBoundingClientRect()).top > sP) {
          aaS.classList.add('up');
          aaS.classList.remove('down');
        } else {
          aaS.classList.add('down');
          aaS.classList.remove('up');
        }
      }         
    });
    sP = (document.body.getBoundingClientRect()).top;   
  };
  function updateNav() {
    var aS = document.querySelector('.header-navigation .relative').offsetWidth ;
    var lW = document.querySelector('.logo a').offsetWidth ;
    var tW = aS - lW;
    const pL = document.querySelectorAll('.parent-level');
    let nW = 20;	//	Adds 20 to total
    pL.forEach(n => {
      nW += n.offsetWidth;
    })
    if (nW > tW) {
      return true;
    } else {
      return false;
    }
  }  
  function detectmob() { 
    if(('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)){
      return true;
    } else {
      return false;
    }
  }
  var tM = document.querySelector('.toggleMenu');
  var rM = document.querySelector('.responsiveMenu');
  var cD = document.getElementById('cart-dropdown');
  var cCM = document.getElementById('cart-count-mobile');
  var cCD = document.getElementById('cart-count-desktop');
  var rMl = rM.querySelectorAll('li');
  if (iW <= mMW || updateNav() || detectmob()) { 
    document.body.classList.remove('desktop-only');
    document.body.classList.add('mobile-only');
    tM.classList.remove('isDesktop');
    tM.classList.add('isMobile');
    if (!tM.classList.contains('active')) {
      rM.style.display = 'none';
    } else {
      rM.style.display = 'block';
    }
    rM.classList.remove('isDesktop');
    rM.classList.add('isMobile');
    var pLu = rM.querySelectorAll('.parent-level-ul');
    pLu.forEach(function(p) {
      p.removeAttribute('style')
    });
    rMl.forEach(function(r) {
      r.onmouseenter = function(ev){
        return false;
      };      
      r.onmouseleave = function(ev){
        return false;
      };
      r.classList.remove('isDesktop');
      r.classList.add('isMobile');
    });
    var rMp = rM.querySelectorAll('li.has-dropdown a.parent');
    rMp.forEach(function(r) {
      r.onclick = function(ev){
        var pE = r.parentElement;
        if((r.getAttribute('href') != 'undefined') && r.getAttribute('href') != '#' && ev.target.matches('span')){          
        } else {
          ev.preventDefault();
          pE.classList.toggle('hover');
        }
      };
    });
    if (cD) {
      cCM.appendChild(cD);
    };
    theme.mobile = true;
  } else if (iW > mMW) {
    var hoverTimeout;    
    document.body.classList.remove('mobile-only');
    document.body.classList.add('desktop-only');
    tM.classList.remove('isMobile');
    tM.classList.add('isDesktop');
    rM.style.display = 'block';
    rM.classList.remove('isMobile');
    rM.classList.add('isDesktop');
    rMl.forEach(function(r) {
      r.classList.remove('hover','isMobile');
      r.classList.add('isDesktop');
    });
    var rMp = rM.querySelectorAll('li.parent');
    rMp.forEach(function(r) {
      r.onmouseenter = function(ev){
        var rMh = rM.querySelectorAll('li.hover');
        rMh.forEach(function(r) {
          r.classList.remove('hover');
        });
        clearTimeout(hoverTimeout);
        r.classList.add('hover');
      };      
      r.onmouseleave = function(ev){
        hoverTimeout = setTimeout(function() {
          r.classList.remove('hover');
        },250);
      };      
    });
    if (cD) {
      cCD.appendChild(cD);
    };
    theme.mobile = false;
  }
};
theme.Header = (function() {
  function Header(container) {
    var sectionId = container.getAttribute('data-section-id');
    var dD = container.getAttribute('data-dropdown');
    var sN = container.querySelector('.sticky-navigation');
    var t = container.querySelector('.toggleMenu');
    var r = container.querySelector('.responsiveMenu');
    var hS = container.querySelectorAll('.header-searchbar.open-slide');
    var cCM = document.getElementById('cart-count-mobile');
    var cCMa = cCM.querySelector('.cart-count-mobile');
    var cCMb = container.querySelector('#cart-dropdown .basicLightbox__close');
    var m = container.getAttribute('data-multi');
    theme.css = document.head.querySelector('link[href*="/styles.min.css"]');
    if(theme.css){
      theme.cssLoaded = Boolean(theme.css.sheet);
    }
    if(dD == 'true'){
      theme.dropdown = true;
    } else {
      theme.dropdown = false;
    }
    theme.cart = false;
    theme.menuAdjust();
    theme.menuHeight(container);
    if (location.pathname == '/challenge') {
      window.scrollTo({top:0, behavior: 'smooth'});
    } else if (window.location.hash) {
      setTimeout(function () {
        var hsh = location.hash;
        var hc = document.querySelector(hsh);
        if (!hc) {
          return;
        }
        var s = hc.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({top:s-document.selectors.sht, behavior: 'smooth'});
      }, 1);
    } else if (window.location.href.indexOf('customer_posted') > -1 || window.location.href.indexOf('contact?contact_posted') > -1) {
      var fb = document.querySelector('.feedback');
      if (!fb) {
        return;
      }
      var s = fb.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({top:s-document.selectors.sht, behavior: 'smooth'});
    }    
    t.onclick = function(ev){
      ev.preventDefault();
      t.classList.toggle('active');
      if (r.style.display === 'none') {
        r.style.display = 'block';
      } else {
        r.style.display = 'none';
      }
      document.body.classList.toggle('no-scroll');
      var y = document.documentElement.scrollTop;
      if(document.body.classList.contains('mobile-only') && document.body.classList.contains('no-scroll')){
        sN.setAttribute('data-y',y);
        y = y * -1;
        document.body.style.position = 'fixed';
        document.body.style.left = '0px';
        document.body.style.right = '0px';
        document.body.style.top = y + 'px';
      } else {
        document.body.style.position = '';
        document.body.style.left = 'auto';
        document.body.style.right = 'auto';
        document.body.style.top = 'auto';
        document.documentElement.scrollTop = sN.getAttribute('data-y')
      }
      hS.forEach(function(h) {
        h.style.height = '0px';
        h.classList.remove('active','visible');
      });
      cCM.classList.remove('hover');
      if (cCMb && document.getElementById('cart-dropdown')) {
        container.querySelector('#cart-dropdown .basicLightbox__close').classList.add('hidden');
      }
    }
    if(theme.dropdown == true){
      cCMa.onclick = function(ev){
        cCM.classList.toggle('hover');
        if (cCMb && document.getElementById('cart-dropdown')) {
          container.querySelector('#cart-dropdown .basicLightbox__close').classList.add('hidden');
        }
      }
    };    
    if(theme.css){
      theme.css.addEventListener('load', function () {
        theme.cssLoaded = true;
        theme.menuHeight(container);
      });
      if (theme.cssLoaded) {
        theme.menuHeight(container);
      };
    }
    window.onresize = function(){
      theme.menuHeight(container);
      theme.menuAdjust();
      if(document.body.classList.contains('desktop-only')){
        t.classList.remove('active');
        document.body.classList.remove('no-scroll');
        document.body.style.position = '';
        document.body.style.left = 'auto';
        document.body.style.right = 'auto';
        document.body.style.top = 'auto';
      };
    };    
    theme.multiHead = m;
    if (theme.multiHead == 'true') {
      theme.multi();
    }    
    theme.open_slide(container);
    theme.live_search(container);
  }
  return Header;
})();
theme.Footer = (function() {
  function Footer(container) {
    var sectionId = container.getAttribute('data-section-id');
    var m = container.getAttribute('data-multi');
    if (m) {  
      var nS = container.querySelectorAll('.new-select');    
      var uOa = container.querySelectorAll('ul.options');
      nS.forEach(function(n) {
        var asS = n.querySelector('a.styledSelect');
        asS.onclick = function(ev){
          theme.open_dropdown(asS,uOa);
        };
      });
    }
    theme.multiFoot = m;
    if ((theme.multiHead == 'false') && (theme.multiFoot == 'true')) {
      theme.multi();
    }
    theme.open_slide(container);
  }
  return Footer;
})();
theme.slider = function (container) {
  var type = container.getAttribute('data-carousel-type');
  if (type == 'section') {
    var sectionId = container.getAttribute('data-section-id');
  } else {
    var sectionId = container.querySelector('.product-loop[data-glider="loaded"]').getAttribute('data-block-id');
  }  
  var Carousel = document.getElementById('glider-carousel-' + sectionId);
  if (Carousel) {
    var dS = Carousel.getAttribute('data-slides');
    var dL = Carousel.getAttribute('data-limit');
    var next = document.getElementById('glider-button-next-' + sectionId);
    var prev = document.getElementById('glider-button-prev-' + sectionId);
    if (dS) {
      var S = dS;
    } else {
      var S = 1.5;
    }
    if (dL) {
      var L = dL;
    } else {
      var L = 4.5;
    }
    var glider = new Glider(Carousel, {
      arrows: {
        prev: prev,
        next: next
      },
      draggable: true,
      dragVelocity:1,
      rewind: true,
      resizeLock: false,
      skipTrack: true,
      slidesToShow: 1,
      slidesToScroll: 'auto',
      responsive: [
        {
          breakpoint: 321,
          settings: {
            slidesToShow: S
          }
        },
        {
          breakpoint: 769,
          settings: {
            slidesToShow: L
          }
        }
      ]
    });
    if (glider) {
      Carousel.classList.add('loaded');
      for (var i = 0; i <= 4; ++i){
        var p = Carousel.querySelector('.product:not(.ignore)[data-gslide="' + i + '"]')
        if (p) {
          p.classList.add('ignore');
        }
      }
    }
    Carousel.addEventListener('glider-slide-visible', function(ev) {        
      var n = ev.detail.slide + 1;
      var p = Carousel.querySelector('.product:not(.ignore)[data-gslide="' + n + '"]')
      if (p) {
        p.classList.add('ignore');
      }
    });
  }  
};
//	Glider.js 1.7.4 | https://nickpiscitelli.github.io/Glider.js/ | Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
//	gliderPrototype.bindDrag
!function(e){"function"==typeof define&&define.amd?define(e):"object"==typeof exports?module.exports=e():e()}(function(){var e="undefined"!=typeof window?window:this,t=e.Glider=function(t,o){var i=this;if(t._glider)return t._glider;if(i.ele=t,i.ele.classList.add("glider"),i.ele._glider=i,i.opt=Object.assign({},{slidesToScroll:1,slidesToShow:1,resizeLock:!0,duration:.5,easing:function(e,t,o,i,r){return i*(t/=r)*t+o}},o),i.animate_id=i.page=i.slide=0,i.arrows={},i._opt=i.opt,i.opt.skipTrack)i.track=i.ele.children[0];else for(i.track=document.createElement("div"),i.ele.appendChild(i.track);1!==i.ele.children.length;)i.track.appendChild(i.ele.children[0]);i.track.classList.add("glider-track"),i.init(),i.resize=i.init.bind(i,!0),i.event(i.ele,"add",{scroll:i.updateControls.bind(i)}),i.event(e,"add",{resize:i.resize})},o=t.prototype;return o.init=function(e,t){var o=this,i=0,r=0;o.slides=o.track.children,[].forEach.call(o.slides,function(e,t){e.classList.add("glider-slide"),e.setAttribute("data-gslide",t)}),o.containerWidth=o.ele.clientWidth;var s=o.settingsBreakpoint();if(t||(t=s),"auto"===o.opt.slidesToShow||void 0!==o.opt._autoSlide){var l=o.containerWidth/o.opt.itemWidth;o.opt._autoSlide=o.opt.slidesToShow=o.opt.exactWidth?l:Math.max(1,Math.floor(l))}"auto"===o.opt.slidesToScroll&&(o.opt.slidesToScroll=Math.floor(o.opt.slidesToShow)),o.itemWidth=o.opt.exactWidth?o.opt.itemWidth:o.containerWidth/o.opt.slidesToShow,[].forEach.call(o.slides,function(e){e.style.height="auto",e.style.width=o.itemWidth+"px",i+=o.itemWidth,r=Math.max(e.offsetHeight,r)}),o.track.style.width=i+"px",o.trackWidth=i,o.isDrag=!1,o.preventClick=!1,o.move=!1,o.opt.resizeLock&&o.scrollTo(o.slide*o.itemWidth,0),(s||t)&&(o.bindArrows(),o.buildDots(),o.bindDrag()),o.updateControls(),o.emit(e?"refresh":"loaded")},o.bindDrag=function(){var e=this;e.mouse=e.mouse||e.handleMouse.bind(e);var t=function(){e.mouseDown=void 0,e.ele.classList.remove("drag"),e.isDrag&&(e.preventClick=!0),e.isDrag=!1};const o=function(){e.move=!0};var i={mouseup:t,mouseleave:t,mousedown:function(t){t.preventDefault(),t.stopPropagation(),e.mouseDown=t.clientX,e.ele.classList.add("drag"),e.move=!1,setTimeout(o,300)},touchstart:function(t){e.ele.classList.add("drag"),e.move=!1,setTimeout(o,300)},mousemove:e.mouse,click:function(t){e.preventClick&&e.move&&(t.preventDefault(),t.stopPropagation()),e.preventClick=!1,e.move=!1}};e.ele.classList.toggle("draggable",!0===e.opt.draggable),e.event(e.ele,"remove",i),e.opt.draggable&&e.event(e.ele,"add",i)},o.buildDots=function(){var e=this;if(e.opt.dots){if("string"==typeof e.opt.dots?e.dots=document.querySelector(e.opt.dots):e.dots=e.opt.dots,e.dots){e.dots.innerHTML="",e.dots.classList.add("glider-dots");for(var t=0;t<Math.ceil(e.slides.length/e.opt.slidesToShow);++t){var o=document.createElement("button");o.dataset.index=t,o.setAttribute("aria-label","Page "+(t+1)),o.setAttribute("role","tab"),o.className="glider-dot "+(t?"":"active"),e.event(o,"add",{click:e.scrollItem.bind(e,t,!0)}),e.dots.appendChild(o)}}}else e.dots&&(e.dots.innerHTML="")},o.bindArrows=function(){var e=this;e.opt.arrows?["prev","next"].forEach(function(t){var o=e.opt.arrows[t];o&&("string"==typeof o&&(o=document.querySelector(o)),o&&(o._func=o._func||e.scrollItem.bind(e,t),e.event(o,"remove",{click:o._func}),e.event(o,"add",{click:o._func}),e.arrows[t]=o))}):Object.keys(e.arrows).forEach(function(t){var o=e.arrows[t];e.event(o,"remove",{click:o._func})})},o.updateControls=function(e){var t=this;e&&!t.opt.scrollPropagate&&e.stopPropagation();var o=t.containerWidth>=t.trackWidth;t.opt.rewind||(t.arrows.prev&&(t.arrows.prev.classList.toggle("disabled",t.ele.scrollLeft<=0||o),t.arrows.prev.classList.contains("disabled")?t.arrows.prev.setAttribute("aria-disabled",!0):t.arrows.prev.setAttribute("aria-disabled",!1)),t.arrows.next&&(t.arrows.next.classList.toggle("disabled",Math.ceil(t.ele.scrollLeft+t.containerWidth)>=Math.floor(t.trackWidth)||o),t.arrows.next.classList.contains("disabled")?t.arrows.next.setAttribute("aria-disabled",!0):t.arrows.next.setAttribute("aria-disabled",!1))),t.slide=Math.round(t.ele.scrollLeft/t.itemWidth),t.page=Math.round(t.ele.scrollLeft/t.containerWidth);var i=t.slide+Math.floor(Math.floor(t.opt.slidesToShow)/2),r=Math.floor(t.opt.slidesToShow)%2?0:i+1;1===Math.floor(t.opt.slidesToShow)&&(r=0),t.ele.scrollLeft+t.containerWidth>=Math.floor(t.trackWidth)&&(t.page=t.dots?t.dots.children.length-1:0),[].forEach.call(t.slides,function(e,o){var s=e.classList,l=s.contains("visible"),a=t.ele.scrollLeft,n=t.ele.scrollLeft+t.containerWidth,d=t.itemWidth*o,c=d+t.itemWidth;[].forEach.call(s,function(e){/^left|right/.test(e)&&s.remove(e)}),s.toggle("active",t.slide===o),i===o||r&&r===o?s.add("center"):(s.remove("center"),s.add([o<i?"left":"right",Math.abs(o-(o<i?i:r||i))].join("-")));var h=Math.ceil(d)>=Math.floor(a)&&Math.floor(c)<=Math.ceil(n);s.toggle("visible",h),h!==l&&t.emit("slide-"+(h?"visible":"hidden"),{slide:o})}),t.dots&&[].forEach.call(t.dots.children,function(e,o){e.classList.toggle("active",t.page===o)}),e&&t.opt.scrollLock&&(clearTimeout(t.scrollLock),t.scrollLock=setTimeout(function(){clearTimeout(t.scrollLock),Math.abs(t.ele.scrollLeft/t.itemWidth-t.slide)>.02&&(t.mouseDown||t.trackWidth>t.containerWidth+t.ele.scrollLeft&&t.scrollItem(t.getCurrentSlide()))},t.opt.scrollLockDelay||250))},o.getCurrentSlide=function(){var e=this;return e.round(e.ele.scrollLeft/e.itemWidth)},o.scrollItem=function(e,t,o){o&&o.preventDefault();var i=this,r=e;if(++i.animate_id,!0===t)e*=i.containerWidth,e=Math.round(e/i.itemWidth)*i.itemWidth;else{if("string"==typeof e){var s="prev"===e;if(e=i.opt.slidesToScroll%1||i.opt.slidesToShow%1?i.getCurrentSlide():i.slide,s?e-=i.opt.slidesToScroll:e+=i.opt.slidesToScroll,i.opt.rewind){var l=i.ele.scrollLeft;e=s&&!l?i.slides.length:!s&&l+i.containerWidth>=Math.floor(i.trackWidth)?0:e}}e=Math.max(Math.min(e,i.slides.length),0),i.slide=e,e=i.itemWidth*e}return i.scrollTo(e,i.opt.duration*Math.abs(i.ele.scrollLeft-e),function(){i.updateControls(),i.emit("animated",{value:r,type:"string"==typeof r?"arrow":t?"dot":"slide"})}),!1},o.settingsBreakpoint=function(){var t=this,o=t._opt.responsive;if(o){o.sort(function(e,t){return t.breakpoint-e.breakpoint});for(var i=0;i<o.length;++i){var r=o[i];if(e.innerWidth>=r.breakpoint)return t.breakpoint!==r.breakpoint&&(t.opt=Object.assign({},t._opt,r.settings),t.breakpoint=r.breakpoint,!0)}}var s=0!==t.breakpoint;return t.opt=Object.assign({},t._opt),t.breakpoint=0,s},o.scrollTo=function(t,o,i){var r=this,s=(new Date).getTime(),l=r.animate_id,a=function(){var n=(new Date).getTime()-s;r.ele.scrollLeft=r.ele.scrollLeft+(t-r.ele.scrollLeft)*r.opt.easing(0,n,0,1,o),n<o&&l===r.animate_id?e.requestAnimationFrame(a):(r.ele.scrollLeft=t,i&&i.call(r))};e.requestAnimationFrame(a)},o.removeItem=function(e){var t=this;t.slides.length&&(t.track.removeChild(t.slides[e]),t.refresh(!0),t.emit("remove"))},o.addItem=function(e){var t=this;t.track.appendChild(e),t.refresh(!0),t.emit("add")},o.handleMouse=function(e){var t=this;t.mouseDown&&(t.isDrag=!0,t.ele.scrollLeft+=(t.mouseDown-e.clientX)*(t.opt.dragVelocity||3.3),t.mouseDown=e.clientX)},o.round=function(e){var t=1/(this.opt.slidesToScroll%1||1);return Math.round(e*t)/t},o.refresh=function(e){this.init(!0,e)},o.setOption=function(e,t){var o=this;o.breakpoint&&!t?o._opt.responsive.forEach(function(t){t.breakpoint===o.breakpoint&&(t.settings=Object.assign({},t.settings,e))}):o._opt=Object.assign({},o._opt,e),o.breakpoint=0,o.settingsBreakpoint()},o.destroy=function(){var t=this,o=t.ele.cloneNode(!0),i=function(e){e.removeAttribute("style"),[].forEach.call(e.classList,function(t){/^glider/.test(t)&&e.classList.remove(t)})};o.children[0].outerHTML=o.children[0].innerHTML,i(o),[].forEach.call(o.getElementsByTagName("*"),i),t.ele.parentNode.replaceChild(o,t.ele),t.event(e,"remove",{resize:t.resize}),t.emit("destroy")},o.emit=function(t,o){var i=new e.CustomEvent("glider-"+t,{bubbles:!this.opt.eventPropagate,detail:o});this.ele.dispatchEvent(i)},o.event=function(e,t,o){var i=e[t+"EventListener"].bind(e);Object.keys(o).forEach(function(e){i(e,o[e])})},t});

theme.Filter = (function() {
  function Filter(container) {
    var sectionId = container.getAttribute('data-section-id');
    var fF = container.querySelector('.filter-form-' + sectionId);
    var s0 = document.getElementById('select_0_' + sectionId);
    var s1 = document.getElementById('select_1_' + sectionId);
    var s2 = document.getElementById('select_2_' + sectionId);
    var s3 = document.getElementById('select_3_' + sectionId);
    var nS = fF.querySelectorAll('.no-select');
    var uOa = container.querySelectorAll('ul.options');
    var ch = fF.querySelectorAll('.child li');
    var it = fF.querySelectorAll('.infant li');
    var asF = container.querySelector('.animate-section.filter');
    for (var i = 0; i < 4; i++) {
      var sL = fF.querySelectorAll('#select_' + i + '_' + sectionId);
      Array.prototype.forEach.call(sL, function(f){
        var s = f.querySelector('select');
        var sO = s.querySelectorAll('option');
        var asS = f.querySelector('a.styledSelect');
        var uO = f.querySelector('ul.options');
        var uOAa = uO.querySelectorAll('a');
        asS.onclick = function(ev){
          ev.stopPropagation();
          theme.open_dropdown(asS,uOa);
          if (asF) {
            asF.classList.add('loaded');
          }
        };
        uOAa.forEach(function(u) {
          u.onclick = function(ev){
            ev.stopPropagation();
            asS.textContent = u.textContent;
            sO.forEach(function(s) {
              if (s.value == u.getAttribute('rel') && s.dataset.id == u.getAttribute('data-id')) {
                s.selected = 'selected';
              }
            });
            uO.classList.remove('active');
            uO.style.height = ''
            uO.style.display = '';
            s.dispatchEvent(new Event('change'));
          };
        });

      }); 
    };
    document.onclick = function(ev){
      uOa.forEach(function(u) {
        u.classList.remove('active');
        u.style.height = '';
        u.style.display = '';
      });
    }
    if (fF.querySelector('#directory_label_0_' + sectionId)) {
      fF.querySelector('#directory_label_0_' + sectionId).onchange = function(){      
        var val = this.value;
        var col = this.getAttribute('data-columns');
        nS.forEach(function(n) {
          n.classList.remove('last');
        });
        this.classList.add('last');
        if (s0.querySelector('li.first')) {
          s0.querySelector('li.first').classList.remove('hidden');
        }
        s0.querySelector('.error').style.display = 'none';
        for (var i = 1; i < col; i++) {          
          var sL = document.querySelector('#select_' + i + '_' + sectionId);
          var tS = sL.querySelector('span.tag-select');
          var noS = sL.querySelector('.no-select');
          var noSo = sL.querySelector('.options');
          var noSoi = sL.querySelectorAll('.options .item');
          var noSof = sL.querySelectorAll('.options .first');
          var oF = sL.querySelector('option.first');
          var asS = sL.querySelector('a.styledSelect');
          var lF = sL.querySelector('li.first');
          var sI = this.options[this.selectedIndex].getAttribute('data-id');
          var dI = noSo.querySelector('li.item[data-collection="' + sI + '"]');
          tS.classList.remove('disabled');
          tS.classList.add('enabled');
          noS.value = '';
          noS.removeAttribute('disabled');
          if (dI) {
            oF.value = '';
            if (lF) {
              var g = dI.getAttribute('data-group');   
              lF.textContent = g + '...';
              asS.setAttribute('data-id', g + '...');
            } else {
              var g = oF.getAttribute('data-select');
            }
            oF.textContent = g + '...';
            asS.textContent = g + '...';
          } else {
            if (lF) {
              lF.textContent = theme.language.layout_general_unavailable;
              asS.setAttribute('data-id', theme.language.layout_general_unavailable);
            }
            tS.classList.add('disabled');
            noS.value = '';
            noS.setAttribute('disabled', true);
            oF.value = '';
            oF.textContent = theme.language.layout_general_unavailable;
            asS.textContent = theme.language.layout_general_unavailable;
          };
          noSoi.forEach(function(t) {
            if (sI == t.getAttribute('data-collection')) {
              t.classList.remove('hidden');
            } else {
              t.classList.add('hidden');
            }
          });
          noSof.forEach(function(t) {
            t.classList.add('hidden');
          });
        };
      };
    }
    if (fF.querySelector('#directory_label_1_' + sectionId)) {
      fF.querySelector('#directory_label_1_' + sectionId).onchange = function(){
        if (s2) {
          s2.querySelector('.no-select').value = '';
        }
        if (s3) {
          s3.querySelector('.no-select').value = '';
        }
        var of = s1.querySelector('.options .first');
        var dl = document.getElementById('directory_label_0_' + sectionId);
        var dlo = dl.options[dl.selectedIndex];
        var id = this.options[this.selectedIndex].getAttribute('data-id');
        var id2 = this.options[this.selectedIndex].getAttribute('data-id2');
        var filters = [];      
        nS.forEach(function(n) {
          filters.push(n.options[n.selectedIndex].value);
          n.classList.remove('last');
        });
        this.classList.add('last');
        if (of) {
          of.classList.remove('hidden');
        }
        if (this.classList.contains('advanced')) {
          var url = (filters.join('').slice(1,-1));
          fetch(url + '?view=do_not_use')
          .then(response => response.text())
          .then(data => {
            var cht = 0;
            var itt = 0;
            ch.forEach(function(c) {            
              if (c.getAttribute('data-id') == id) {
                var dh = c.getAttribute('data-handle');
                if (data.indexOf(dh) > -1) {
                  c.classList.remove('hidden');
                  if (c.classList.contains('child-li')) {
                    cht++;
                  }
                  if (c.classList.contains('infant-li')) {
                    itt++;
                  }
                } else {
                  c.classList.add('hidden');
                };
              }
            });
            function av(a) {
              var g = a.querySelector('.options .first').textContent;
              var tS = a.querySelector('span.tag-select');
              var noS = a.querySelector('.no-select');
              var asS = a.querySelector('a.styledSelect');
              var oF = a.querySelector('option.first');
              tS.classList.remove('disabled');
              tS.classList.add('enabled');
              noS.value = '';
              noS.removeAttribute('disabled')
              asS.textContent = g;
              asS.setAttribute('data-id', g);
              of.value = '';
              oF.textContent = g;
              oF.classList.add('hidden');
            }
            function un(u) {
              var g = u.querySelector('.options .first').textContent;
              var tS = u.querySelector('span.tag-select');
              var noS = u.querySelector('.no-select');
              var asS = u.querySelector('a.styledSelect');
              var oF = u.querySelector('option.first');
              tS.classList.remove('enabled');
              tS.classList.add('disabled');
              noS.value = '';
              noS.setAttribute('disabled', true)
              asS.textContent = theme.language.layout_general_unavailable;
              asS.setAttribute('data-id', theme.language.layout_general_unavailable);
              of.value = '';
              oF.textContent = theme.language.layout_general_unavailable;
            }
            if (s2) {
              if (cht > 0) {
                var a = s2
                av(a)
              } else {
                var u = s2
                un(u)
              }
            }
            if (s3) {
              if (itt > 0) {
                var a = s3
                av(a)
              } else {
                var u = s3
                un(u)
              }
            }
          }).catch(function (err) {
            console.log('!: ' + err);
          });
        } else {
          var itt = 0;
          ch.forEach(function(c) {
            if (c.getAttribute('data-id') == id) {
              if (c.getAttribute('data-id2') == id2) {
                c.classList.remove('hidden');    
                itt++;
              } else {
                c.classList.add('hidden');
              };
            }
          });
          function av(a) {          
            var oF = a.querySelector('option.first');
            var g = oF.getAttribute('data-select');
            var tS = a.querySelector('span.tag-select');
            var noS = a.querySelector('.no-select');
            var asS = a.querySelector('a.styledSelect');
            tS.classList.remove('disabled');
            tS.classList.add('enabled');
            noS.value = '';
            noS.removeAttribute('disabled');
            asS.textContent = g;
            oF.textContent = g;
            oF.classList.add('hidden');
          }
          function un(u) {
            var oF = u.querySelector('option.first');
            var g = oF.getAttribute('data-select');
            var tS = u.querySelector('span.tag-select');
            var noS = u.querySelector('.no-select');
            var asS = u.querySelector('a.styledSelect');
            tS.classList.remove('enabled');
            tS.classList.add('disabled');
            noS.value = '';
            noS.setAttribute('disabled', true);
            asS.textContent = theme.language.layout_general_unavailable;
            oF.textContent = theme.language.layout_general_unavailable;
          }
          if (s2) {
            if (itt > 0) {
              var a = s2
              av(a)
            } else {
              var u = s2
              un(u)
            }
          }
        }
      };
    }
    if (fF.querySelector('#directory_label_2_' + sectionId)) {
      fF.querySelector('#directory_label_2_' + sectionId).onchange = function(){
        if (s3) {
          s3.querySelector('.no-select').value = '';
        }
        var of = s2.querySelector('.options .first');
        var id = this.options[this.selectedIndex].getAttribute('data-id');
        var id2 = this.options[this.selectedIndex].getAttribute('data-id2');
        var filters = [];
        nS.forEach(function(n) {
          filters.push(n.options[n.selectedIndex].value);
          n.classList.remove('last');
        });
        this.classList.add('last');
        if (of) {
          of.classList.remove('hidden');
        }
        if (this.classList.contains('advanced')) {
          var url = (filters.join('').slice(1,-1));
          fetch(url + '?view=do_not_use')
          .then(response => response.text())
          .then(data => {
            var itt = 0;
            it.forEach(function(c) {
              if (c.getAttribute('data-id') == id) {
                var dh = c.getAttribute('data-handle');
                if (data.indexOf(dh) > -1) {
                  c.classList.remove('hidden');
                  itt++;
                } else {
                  c.classList.add('hidden');
                };
              }
            });
            function av(a) {
              var g = a.querySelector('.options .first').textContent;
              var tS = a.querySelector('span.tag-select');
              var noS = a.querySelector('.no-select');
              var asS = a.querySelector('a.styledSelect');
              var oF = a.querySelector('option.first');
              tS.classList.remove('disabled');
              tS.classList.add('enabled');
              noS.value = '';
              noS.removeAttribute('disabled');
              asS.textContent = g;
              asS.setAttribute('data-id', g);
              of.value = '';
              oF.textContent = g;
              oF.classList.add('hidden');
            }
            function un(u) {
              var g = u.querySelector('.options .first').textContent;
              var tS = u.querySelector('span.tag-select');
              var noS = u.querySelector('.no-select');
              var asS = u.querySelector('a.styledSelect');
              var oF = u.querySelector('option.first');
              tS.classList.remove('enabled');
              tS.classList.add('disabled');
              noS.value = '';
              noS.setAttribute('disabled', true);
              asS.textContent = theme.language.layout_general_unavailable;
              asS.setAttribute('data-id', theme.language.layout_general_unavailable);
              of.value = '';
              oF.textContent = theme.language.layout_general_unavailable;
            }
            if (s3) {
              if (itt > 0) {
                var a = s3
                av(a)
              } else {
                var u = s3
                un(u)
              }
            }
          }).catch(function (err) {
            console.log('!: ' + err);
          });
        }
      };
    }
    if (fF.querySelector('#directory_label_3_' + sectionId)) {
      fF.querySelector('#directory_label_3_' + sectionId).onchange = function(){
        s3.querySelector('.options .first').classList.remove('hidden');
      };
    };
    fF.querySelector('.btn').onclick = function(ev){
      if(fF.querySelector('#directory_label_0_' + sectionId).selectedIndex == 0) {
        var asF = fF.querySelector('.animate-section.filter');
        fF.querySelector('.select .error').style.display = 'block';
        if(asF) {
          asF.classList.add('loaded');
        }
      } else {
        if (this.classList.contains('advanced')) {
          var filters = [];      
          nS.forEach(function(n) {
            filters.push(n.options[n.selectedIndex].value);
          });
          window.location = (filters.join('').slice(1,-1) + '#collection');
        } else {
          var url = fF.querySelector('.no-select.last');
          window.location = (url.options[url.selectedIndex].value + '#collection');
        }        
        fF.querySelector('.select .error').style.display = 'none';
      }
    }
  }
  return Filter;
})();
theme.HomeSlideshow = (function() {
  function HomeSlideshow(container) {
    var sectionId = container.getAttribute('data-section-id');
    var type = container.getAttribute('data-slideshow-type');
    var Carousel = document.getElementById('glider-carousel-' + sectionId);
    this.Carousel = Carousel;
    if (Carousel) {
      var next = document.getElementById('glider-button-next-' + sectionId);
      var prev = document.getElementById('glider-button-prev-' + sectionId);
      var glider = new Glider(Carousel, {
        arrows: {
          prev: prev,
          next: next
        },
        draggable: true,
        rewind: true,
        scrollLock: true,
        scrollLockDelay:0,
        skipTrack: true,
        slidesToShow: 1,
        slidesToScroll: 1
      });
      var image = {
        dimensions:function (e) {
          var CarouselSlide = Carousel.querySelector('.glider-slide.visible img');
          if ((type == 'image') && (CarouselSlide)) {
            var CarouselWidth = CarouselSlide.offsetWidth;
            var newHeight = CarouselSlide.getAttribute('data-aspectratio');
            Carousel.querySelector('.glider-track').style.height = CarouselWidth/newHeight + 'px';
          } else {
            var CarouselSlide = Carousel.querySelector('.glider-slide.visible .content-height-' + sectionId);
            if (CarouselSlide) {
              var newHeight = CarouselSlide.offsetHeight;
              Carousel.querySelector('.glider-track').style.height = newHeight + 'px';
            }
          }
        }
      };
      var lazy = {
        load:function (e) {
          var l = Carousel.querySelector('.glider-slide.active .lazyloading');
          if (l) {
            l.classList.add('lazyload');
          }
          var sS = Carousel.querySelectorAll('.glider-slide');
          sS.forEach(function(s) {
            s.setAttribute('data-glider', 'ignore');
          });
        }
      };
      if (glider) {
        Carousel.querySelector('.glider-track.slideshow').classList.add('loaded');
        var CarouselSlide = Carousel.querySelector('.glider-slide.visible img');
        if ((type == 'image') && (CarouselSlide)) {
          image.dimensions();
        } else {
          if(theme.css){
            if (theme.cssLoaded) {
              image.dimensions();
            } else {
              theme.css.addEventListener('load', function () {
                image.dimensions();
              });
            }
          }
        }
      }
      Carousel.addEventListener('glider-slide-visible', function(ev){
        image.dimensions();
        if (Shopify.designMode) {
          lazy.load();
        }
        if((document.readyState == 'complete') && (Carousel.getAttribute('data-glider-autorotate') == 'false')) {
          var s = Carousel.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({top:s-document.selectors.sht, behavior: 'smooth'});
        }
      });
      next.onclick = function(ev){
        lazy.load();
      };
      prev.onclick = function(ev){
        lazy.load();
      };
      Carousel.onmousedown = function(ev){
        lazy.load();
      };
      Carousel.onmouseup = function(ev){
        var gS = Carousel.querySelector('.glider-slide.active').getAttribute('data-gslide');
        glider.scrollItem(parseInt(gS));
      };
      Carousel.ontouchmove = function(ev){
        lazy.load();
      };
      if (Carousel.getAttribute('data-glider-autorotate') == 'true') {
        let a = Carousel.getAttribute('data-glider-autoplay');
        function n() {
          glider.scrollItem('next');
          lazy.load();
        }
        var sI = setInterval(n, a);
        this.sI = sI;
        function clear() {
          clearInterval(sI);
        }
        next.onclick = clear;
        prev.onclick = clear;
        next.ontouchstart = clear;
        prev.ontouchstart = clear;
        Carousel.onclick = clear;
        Carousel.ontouchstart = clear;
      }
      var resizeTimer;
      window.addEventListener('resize', function(e) {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
          image.dimensions();
        }, 250);
      });
    }
  }
  return HomeSlideshow;
})();
theme.HomeSlideshow.prototype = Object.assign({}, theme.HomeSlideshow.prototype, {
  onBlockSelect: function(ev) {
    if (this.Carousel) {
      var mSI = ev.target.getAttribute('data-gslide');
      Glider(this.Carousel).scrollItem(parseInt(mSI));
      if (this.Carousel.getAttribute('data-glider-autorotate') == 'true') {
        clearInterval(this.sI);
      };
    }
  }
});
theme.HomeCollectionsTabbed = (function() {
  function HomeCollectionsTabbed(container) {
    var sectionId = container.getAttribute('data-section-id');
    var loop = container.querySelector('.product-loop[data-glider="loaded"]');
    if (loop) {
      var blockId = loop.getAttribute('data-block-id');
      var Carousel = document.getElementById('glider-carousel-' + blockId);
      this.container = container;
      this.sectionId = sectionId;
      this.Carousel = Carousel;
      if (Carousel) {
        theme.slider(container);
      }
      theme.tabs(container);
      if (theme.settings.cart) {
        theme.ajax_cart(container);
      }
      theme.swatches(container);
    }
  }
  return HomeCollectionsTabbed;
})();
theme.HomeCollectionsTabbed.prototype = Object.assign({}, theme.HomeCollectionsTabbed.prototype, {
  onBlockSelect: function(ev) {    
    var container = this.container;    
    var tI = this.container.querySelectorAll('.tabs-id-' + this.sectionId + ' a');      
    var tB = this.container.querySelectorAll('.tab-body-id-' + this.sectionId);      
    var tBL = this.container.querySelector('.product-loop[data-glider="loaded"]');      
    var tT = ev.target;
    var tH = this.container.querySelector(ev.target.getAttribute('href'));
    if (tI) {
      tI.forEach(function(t) {
        t.classList.remove('first');
        t.setAttribute('tabindex','-1');
        t.setAttribute('aria-selected','false');
      });
      tB.forEach(function(t) {
        t.classList.add('hide');
        t.setAttribute('aria-hidden','true');
        var ti = t.querySelector('.tabindex');
        if (ti) {
          ti.setAttribute('tabindex','-1');
        };
      });
    }
    if (tBL) {
      tBL.setAttribute('data-glider', 'ignore');
    }
    tT.classList.add('first');
    tT.setAttribute('tabindex','0');
    tT.setAttribute('aria-selected','true');
    tH.classList.remove('hide');
    tH.setAttribute('aria-hidden','false');
    var tHi = tH.querySelector('.tabindex');
    if (tHi) {
      tHi.setAttribute('tabindex','0');
    }
    var loop = tH.querySelector('.product-loop[data-glider="unloaded"]');
    if (loop) {
      loop.setAttribute('data-glider', 'loaded');
      setTimeout(function () {
        if (loop.getAttribute('data-glider') === 'loaded') {
          theme.slider(container);   
        }
      }, 1);
    }      
    var tC = document.getElementById('tabs-carousel-' + this.sectionId);
    if (tC) {        
      var mSI = ev.target.getAttribute('data-gslide');
      Glider(tC).scrollItem(parseInt(mSI));
    }      
  }
});
theme.HomeCollection = (function() { 
  function HomeCollection(container) {
    var sectionId = container.getAttribute('data-section-id');
    var Carousel = document.getElementById('glider-carousel-' + sectionId);
    if (Carousel) {
      theme.slider(container);
    }
    if (theme.settings.cart) {
      theme.ajax_cart(container);
    }
    theme.swatches(container);
  }
  return HomeCollection;
})();
theme.HomeCollectionsList = (function() {
  function HomeCollectionsList(container) {
    var sectionId = container.getAttribute('data-section-id');    
    var Carousel = document.getElementById('glider-carousel-' + sectionId);
    this.Carousel = Carousel;
    if (Carousel) {
      theme.slider(container);
    }
  }
  return HomeCollectionsList;
})();
theme.HomeCollectionsList.prototype = Object.assign({}, theme.HomeCollectionsList.prototype, {
  onBlockSelect: function(ev) {
    if (this.Carousel) {
      var mSI = ev.target.getAttribute('data-gslide');
      Glider(this.Carousel).scrollItem(parseInt(mSI));
    }
  }
});
theme.HomeCollectionsGrid = (function() {
  function HomeCollectionsGrid(container) {
    var sectionId = container.getAttribute('data-section-id');
    var Carousel = document.getElementById('glider-carousel-' + sectionId);
    this.Carousel = Carousel;
    if (Carousel) {
      theme.slider(container);
    }
  }
  return HomeCollectionsGrid;
})();
theme.HomeCollectionsGrid.prototype = Object.assign({}, theme.HomeCollectionsGrid.prototype, {
  onBlockSelect: function(ev) {
    if (this.Carousel) {
      var mSI = ev.target.getAttribute('data-gslide');
      Glider(this.Carousel).scrollItem(parseInt(mSI));
    }
  }
});
theme.HomeMap = (function() {
  var apiStatus = null;
  var mapsToLoad = [];
  function HomeMap(container) {
    var sectionId = container.getAttribute('data-section-id');
    var k = container.getAttribute('data-key');
    var mc = document.getElementById('map-container-' + sectionId);
    var m = document.getElementById('map-' + sectionId);
    var l = mc.querySelector('.loader');    
    this.selectors = {
      mc: mc,
      m: m,
      l: l,
      z: m.getAttribute('data-zoom'),      
      a: m.getAttribute('data-address'),
      i: m.getAttribute('data-icons'),
      altf: m.getAttribute('data-altf'),
      alts: m.getAttribute('data-alts'),
      lmgf: m.getAttribute('data-lmgf'),
      lngf: m.getAttribute('data-lngf'),
      lltf: m.getAttribute('data-lltf'),
      llts: m.getAttribute('data-llts'),
      pgf: m.getAttribute('data-pgf'),
      pltf: m.getAttribute('data-pltf'),
      plts: m.getAttribute('data-plts'),
      ragf: m.getAttribute('data-ragf'),
      raltf: m.getAttribute('data-raltf'),
      ralts: m.getAttribute('data-ralts'),
      rhgf: m.getAttribute('data-rhgf'),
      rhltf: m.getAttribute('data-rhltf'),
      rhlts: m.getAttribute('data-rhlts'),
      rlgf: m.getAttribute('data-rlgf'),
      rlltf: m.getAttribute('data-rlltf'),
      rllts: m.getAttribute('data-rllts'),
      tlgf: m.getAttribute('data-tlgf'),
      tlltf: m.getAttribute('data-tlltf'),
      tllts: m.getAttribute('data-tllts'),
      tsgf: m.getAttribute('data-tsgf'),
      tsltf: m.getAttribute('data-tsltf'),
      tslts: m.getAttribute('data-tslts'),
      wgf: m.getAttribute('data-wgf'),
      wlt: m.getAttribute('data-wlt')      
    }
    window.gm_authFailure = function() {
      mc.classList.remove('no-background');
      l.remove();
    };
    if (!m) return;
    if (typeof k === 'undefined') {
      return;
    }
    if (apiStatus === 'loaded') {
      this.createMap();
    } else {
      mapsToLoad.push(this);
      if (apiStatus !== 'loading') {
        apiStatus = 'loading';
        if (typeof window.google === 'undefined') {
          theme.Helpers.getScript(
            'https://maps.googleapis.com/maps/api/js?key=' + k
          ).then(function() {
            apiStatus = 'loaded';
            initAllMaps();
          });
        }
      }
    }
  }
  function initAllMaps() {
    mapsToLoad.forEach(function(map) {
      map.createMap();
    });
  }
  function geolocate(map) {
    return new Promise(function(resolve, reject) {
      var geocoder = new google.maps.Geocoder();
      var address = map.dataset.address;
      geocoder.geocode({ address: address }, function(results, status) {
        if (status !== google.maps.GeocoderStatus.OK) {
          reject(status);
        }
        resolve(results);
      });
    });
  }
  HomeMap.prototype = Object.assign({}, HomeMap.prototype, {
      createMap: function() {
      return geolocate(this.selectors.m)
      .then(
        function(results) {
          var mapOptions = {
            zoom: parseInt(this.selectors.z),
            center: results[0].geometry.location,
            draggable: true,
            clickableIcons: true,
            scrollwheel: false,
            disableDoubleClickZoom: true,
            disableDefaultUI: true,
            styles: [
              {
                "elementType": "labels.icon",
                "stylers": [{"visibility": this.selectors.i}]
              },
              {
                "featureType": "administrative",
                "elementType": "labels.text.fill",
                "stylers": [
                  {
                    "color": this.selectors.altf
                  }
                ]
              },
              {
                "featureType": "administrative",
                "elementType": "labels.text.stroke",
                "stylers": [
                  {
                    "color": this.selectors.alts
                  }
                ]
              },
              {
                "featureType": "landscape.man_made",
                "elementType": "geometry.fill",
                "stylers": [
                  {
                    "color": this.selectors.lmgf
                  }
                ]
              },
              {
                "featureType": "landscape.natural",
                "elementType": "geometry.fill",
                "stylers": [
                  {
                    "color": this.selectors.lngf
                  }
                ]
              },
              {
                "featureType": "landscape",
                "elementType": "labels.text.fill",
                "stylers": [
                  {
                    "color": this.selectors.lltf
                  }
                ]
              },
              {
                "featureType": "landscape",
                "elementType": "labels.text.stroke",
                "stylers": [
                  {
                    "color": this.selectors.llts
                  }
                ]
              },
              {
                "featureType": "poi",
                "elementType": "geometry.fill",
                "stylers": [
                  {
                    "color": this.selectors.pgf
                  }
                ]
              },
              {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [
                  {
                    "color": this.selectors.pltf
                  }
                ]
              },
              {
                "featureType": "poi",
                "elementType": "labels.text.stroke",
                "stylers": [
                  {
                    "color": this.selectors.plts
                  }
                ]
              },
              {
                "featureType": "road.arterial",
                "elementType": "geometry.fill",
                "stylers": [
                  {
                    "color": this.selectors.ragf
                  }
                ]
              },
              {
                "featureType": "road.arterial",
                "elementType": "labels.text.fill",
                "stylers": [
                  {
                    "color": this.selectors.raltf
                  }
                ]
              },
              {
                "featureType": "road.arterial",
                "elementType": "labels.text.stroke",
                "stylers": [
                  {
                    "color": this.selectors.ralts
                  }
                ]
              },
              {
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [
                  {
                    "color": this.selectors.rhgf
                  }
                ]
              },
              {
                "featureType": "road.highway",
                "elementType": "labels.text.fill",
                "stylers": [
                  {
                    "color": this.selectors.rhltf
                  }
                ]
              },
              {
                "featureType": "road.highway",
                "elementType": "labels.text.stroke",
                "stylers": [
                  {
                    "color": this.selectors.rhlts
                  }
                ]
              },
              {
                "featureType": "road.local",
                "elementType": "geometry.fill",
                "stylers": [
                  {
                    "color": this.selectors.rlgf
                  }
                ]
              },
              {
                "featureType": "road.local",
                "elementType": "labels.text.fill",
                "stylers": [
                  {
                    "color": this.selectors.rlltf
                  }
                ]
              },
              {
                "featureType": "road.local",
                "elementType": "labels.text.stroke",
                "stylers": [
                  {
                    "color": this.selectors.rllts
                  }
                ]
              },
              {
                "featureType": "transit.line",
                "elementType": "geometry.fill",
                "stylers": [
                  {
                    "color": this.selectors.tlgf
                  }
                ]
              },
              {
                "featureType": "transit.line",
                "elementType": "labels.text.fill",
                "stylers": [
                  {
                    "color": this.selectors.tlltf
                  }
                ]
              },
              {
                "featureType": "transit.line",
                "elementType": "labels.text.stroke",
                "stylers": [
                  {
                    "color": this.selectors.tllts
                  }
                ]
              },
              {
                "featureType": "transit.station",
                "elementType": "geometry.fill",
                "stylers": [
                  {
                    "color": this.selectors.tsgf
                  }
                ]
              },
              {
                "featureType": "transit.station",
                "elementType": "labels.text.fill",
                "stylers": [
                  {
                    "color": this.selectors.tsltf
                  }
                ]
              },
              {
                "featureType": "transit.station",
                "elementType": "labels.text.stroke",
                "stylers": [
                  {
                    "color": this.selectors.tslts
                  }
                ]
              },
              {
                "featureType": "water",
                "elementType": "geometry.fill",
                "stylers": [
                  {
                    "color": this.selectors.wgf
                  }
                ]
              },
              {
                "featureType": "water",
                "elementType": "labels.text",
                "stylers": [
                  {
                    "color": this.selectors.wlt
                  }
                ]
              }
            ]
          };
          var map = (this.selectors.m = new google.maps.Map(this.selectors.m, mapOptions));
          var center = (this.center = map.getCenter());
          var marker = new google.maps.Marker({
            map: map,
            position: map.getCenter()
          });
          var a = this.selectors.a;
          marker.addListener('click', function() {
            window.open('https://www.google.com/maps/search/?api=1&query=' + a, '_blank')
          });
          google.maps.event.addDomListener(
            window,
            'resize',
            theme.Helpers.debounce(
              function() {
                google.maps.event.trigger(map, 'resize');
                map.setCenter(center);
              }.bind(this),
              250
            )
          );
        }.bind(this)
      );
      this.selectors.l.remove();
    },
    onUnload: function() {
      if (this.map) {
        google.maps.event.clearListeners(this.map, 'resize');
      }
    }
  });
  return HomeMap;
})();
theme.HomeFAQ = (function() {
  function HomeFAQ(container) {
    var sectionId = container.getAttribute('data-section-id');
    theme.open_slide(container);
  }
  return HomeFAQ;
})();
theme.HomeBlog = (function() {
  function HomeBlog(container) {
    var sectionId = container.getAttribute('data-section-id');
    var Carousel = document.getElementById('glider-carousel-' + sectionId);
    if (Carousel) {
      theme.slider(container);
    };
  }
  return HomeBlog;
})();
theme.HomeSearch = (function() {
  function HomeSearch(container) {
    var sectionId = container.getAttribute('data-section-id');
    theme.live_search(container);
  }
  return HomeSearch;
})();
theme.HomeVideo = (function() {
  function HomeVideo(container) {
    var sectionId = container.getAttribute('data-section-id');
    var typ = container.getAttribute('data-type');
    var vid = container.getAttribute('data-video');
    var vP = document.getElementById('vid-' + sectionId);
    var vB = document.getElementById('video-' + sectionId);
    if(vB) {
      var vBv = vB.querySelector('video');
      let lastKnownScrollPosition = 0;
      let ticking = false;
      var isInViewport = function (e) {
        var eT = e.getBoundingClientRect().top + window.pageYOffset;
        var eB = eT + e.offsetHeight;
        var vT = window.scrollY;
        var vB = vT + window.innerHeight;
        return eB > vT && eT < vB;
      };  
      function vidPlay() {
        if (isInViewport(vB)) {
          vBv.play();
        } else { 
          vBv.pause();
        }
      }
      window.onscroll = function(){
        lastKnownScrollPosition = window.scrollY;
        if (!ticking) {
          window.requestAnimationFrame(function() {
            vidPlay();
            ticking = false;
          }.bind(this));
          ticking = true;
        }
      }
    }
    if(vP) {
      if (!typ == 'youtube' || !typ == 'vimeo') return;
      if(typ == 'youtube'){
        var video = 'https://www.youtube.com/embed/' + vid + '?autoplay=1&amp;rel=0&amp;controls=0&amp;showinfo=0';
      } else if(typ == 'vimeo') {
        var video = 'https://player.vimeo.com/video/' + vid + '?autoplay=1&amp;title=0&amp;byline=0&amp;portrait=0';
      };
      const body = document.body;
      vP.onclick = (e) => {
        const html = '<div class="basicLightbox__div nopad"><div class="youtube-container no-container"><iframe id="video" width="560" height="315" src="' + video + '" frameborder="0" allowfullscreen allow="autoplay"></iframe><div class="loader"></div></div></div><button class="basicLightbox__close"></button>'
        const newInstance = basicLightbox.create(html, {
          onShow: (instance) => {
            body.classList.add('basicLightbox__active');          
            instance.element().querySelector('button').onclick = () => instance.close()
          },
          onClose: (instance) => {
            body.classList.remove('basicLightbox__active');
          }
        })
        newInstance.show()
      }
    }
  }
  return HomeVideo;
})();

theme.swatches = function (container) {
  var se = container.querySelectorAll('.swatch-element');
  if(('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)){
    var tl = container.querySelectorAll('.product-thumb');
    tl.forEach(function(t) {
      t.classList.remove('enable-thumb-hover');
    });
    se.forEach(function(s) {
      var i = s.querySelector('input');
      var id = i.getAttribute('data-id');
      var group = i.getAttribute('data-group');
      i.addEventListener('click', function() {
        var sev = container.querySelectorAll('.swatch-element.var_hover[data-group="' + group + '"]');
        var ptv = container.querySelectorAll('.product-thumb-var[data-id="swatch-' + id + '"]');
        var ptvv = container.querySelectorAll('.product-thumb-var.var_hover[data-group="' + group + '"]');
        var ptm = container.querySelector('.product-thumb-main[data-group="' + group + '"]');
        s.classList.toggle('var_hover');
        if (sev) {
          sev.forEach(function(s) {
            s.classList.remove('var_hover','var_ignore');
          });
        }
        if (ptvv) {
          ptvv.forEach(function(p) {
            p.classList.remove('var_hover','var_ignore');
          });
        }
        if (ptv) {
          ptv.forEach(function(p) {
            p.classList.toggle('var_hover');            
          });
        }
        if (ptm) {
          ptm.style.display = 'none';          
        }
      }, false);
    });
  } else {
    se.forEach(function(s) {
      var i = s.querySelector('input');
      var id = i.getAttribute('data-id');
      var group = i.getAttribute('data-group');
      s.onmouseenter = function(){
        var sev = container.querySelectorAll('.swatch-element.var_hover[data-group="' + group + '"]');
        var ptv = container.querySelectorAll('.product-thumb-var[data-id="swatch-' + id + '"]');
        var ptvv = container.querySelectorAll('.product-thumb-var.var_hover[data-group="' + group + '"]');
        var ptm = container.querySelector('.product-thumb-main[data-group="' + group + '"]');
        if(!s.classList.contains('var_ignore')) {
          s.classList.add('var_hover');
          if (sev) {
            sev.forEach(function(s) {
              s.classList.remove('var_hover','var_ignore');
            });
          }
          if (ptvv) {
            ptvv.forEach(function(p) {
              p.classList.remove('var_hover','var_ignore');
            });
          }
          if (ptv) {
            ptv.forEach(function(p) {
              p.classList.add('var_hover');              
            });
          }
          if (ptm) {
            ptm.style.display = 'none';          
          }
        }
      };
      s.onmouseleave = function(){
        var sev = container.querySelectorAll('.swatch-element.var_hover[data-group="' + group + '"]');
        var ptv = container.querySelectorAll('.product-thumb-var[data-id="swatch-' + id + '"]');
        var ptvv = container.querySelectorAll('.product-thumb-var.var_hover[data-group="' + group + '"]');
        var ptm = container.querySelector('.product-thumb-main[data-group="' + group + '"]');
        if(!s.classList.contains('var_ignore')) {
          s.classList.remove('var_hover');
          if (ptvv) {
            ptvv.forEach(function(p) {
              p.classList.remove('var_hover');
            });
          }
          if (ptm) {
            ptm.style.display = 'block';          
          }
        }
      };
      i.onclick = function(ev){
        var sev = container.querySelectorAll('.swatch-element.var_hover[data-group="' + group + '"]');
        var ptv = container.querySelectorAll('.product-thumb-var[data-id="swatch-' + id + '"]');
        var ptvv = container.querySelectorAll('.product-thumb-var.var_hover[data-group="' + group + '"]');
        var ptm = container.querySelector('.product-thumb-main[data-group="' + group + '"]');
        s.classList.add('var_hover','var_ignore');
        if (ptv) {
          ptv.forEach(function(p) {
            p.classList.add('var_hover','var_ignore');            
          });
        }
        if (ptm) {
          ptm.style.display = 'none';          
        }
      };
    });
  }
};
theme.wrap_options = function () {
  var el = document.querySelectorAll('.content iframe[src*="youtube.com"]:not(.no-container),.content iframe[src*="vimeo.com"]:not(.no-container)');
  el.forEach(function(e) {
    var wrapper = document.createElement('div');
    wrapper.className = 'youtube-container';
    e.classList.add('no-container');
    e.parentNode.insertBefore(wrapper, e);
    wrapper.appendChild(e);
  });
  var el = document.querySelectorAll('.youtube-container:not(.no-container)');
  el.forEach(function(e) {
    var wrapper = document.createElement('div');
    wrapper.className = 'loader';
    e.classList.add('no-container');
    e.appendChild(wrapper);
  });  
  var el = document.querySelectorAll('select:not(.no-select)');
  el.forEach(function(e) {
    var wrapper = document.createElement('span');
    wrapper.className = 'select';
    e.classList.add('no-select', 'selector');
    e.parentNode.insertBefore(wrapper, e);
    wrapper.appendChild(e);
  });  
};
theme.Cart = (function() {
  function Cart(container) {
    var sectionId = container.getAttribute('data-section-id');
    var chk = container.getAttribute('data-check');
    var rct = container.getAttribute('data-recent');
    var aB = document.getElementById('ajaxBusy');
    var cTa = document.getElementById('cart-table');
    var cC = document.querySelectorAll('.cartCountSelector');
    var cT = document.querySelector('.cartTotalSelector');
    var tT = document.getElementById('total-cart-top');
    var c = document.querySelector('.cart-table');
    var tC = document.getElementById('cart-total');
    var tB = document.getElementById('total-cart-bottom');
    var dC = document.querySelector('.discount-cart');
    var rV = document.getElementById('recently-viewed');
    var aS = document.querySelector('.animate-section');    
    theme.cart = true;
    theme.qtyinput_quantity(container);
    if(chk == 'true'){
      var nC = container.querySelector('[name="checkout"]');
      document.getElementById('cart-terms').onclick = function(ev){
        if (this.checked == true) {
          nC.classList.remove('outline');
          nC.removeAttribute('disabled');
          nC.value = theme.language.cart_general_checkout;
        } else {
          nC.classList.add('outline');
          nC.setAttribute('disabled', true);
          nC.value = theme.language.cart_general_agree;
        }
      };
    };
    function cart_change() {
      var it = this.closest('.item');
      var id = it.getAttribute('data-product-id');
      var q =  it.querySelector('.item-qty').value;
      var iQ = it.querySelector('.item-qty');
      var s = it.querySelector('.error');
      if (q != '') {
        aB.style.display = 'block';
      }
      fetch(theme.routes_cart_change_url + '.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({'quantity': q,'id':id})
      }).then(function(r) {
        return r.json();
      }).then(function(j) {
        if (q != '') {
          cC.forEach(function(c) {
            c.textContent = j.item_count;
          });
          cT.innerHTML = Shopify.formatMoney(j.total_price, theme.moneyFormat).replace(/((\,00)|(\.00))$/g, '');
          tT.innerHTML = Shopify.formatMoney(j.total_price, theme.moneyFormat).replace(/((\,00)|(\.00))$/g, '');
          if(j.cart_level_discount_applications.length > 0) {
            tC.innerHTML = Shopify.formatMoney(j.items_subtotal_price, theme.moneyFormat).replace(/((\,00)|(\.00))$/g, '');
            dC.innerHTML = Shopify.formatMoney('-' + j.total_discount, theme.moneyFormat).replace(/((\,00)|(\.00))$/g, '');
          }
          tB.innerHTML = Shopify.formatMoney(j.total_price, theme.moneyFormat).replace(/((\,00)|(\.00))$/g, '');
        }
        if (j.item_count == 0) {
          cTa.querySelector('.full-form').remove();
          cTa.querySelector('.empty-form').classList.remove('hidden');
          aB.style.display = 'none';
          document.querySelector('.cart-count-mobile').setAttribute('href', theme.routes_cart_url);
          document.getElementById('cart-dropdown').remove();
          if(rct == 'true' && aS){
            document.querySelector('.animate-section').classList.add('go','up');
          };
        } else {
          fetch(theme.routes_cart_url)
          .then(response => response.text())
          .then(data => {
            if (q != '') {
              theme.ajax_cart_dropdown();
              if (q == 0) {
                it.remove();
              }
              var tT = document.getElementById('total-top');
              var c = document.querySelector('.cart-table');
              var tB = document.getElementById('total-bottom');
              const parser = new DOMParser();
              const htmlDocument = parser.parseFromString(data, 'text/html');
              var nTT = htmlDocument.documentElement.querySelector('#total-top');
              var nC = htmlDocument.documentElement.querySelector('.cart-table');
              var nTB = htmlDocument.documentElement.querySelector('#total-bottom');
              tT.replaceWith(nTT);
              c.replaceWith(nC);
              tB.replaceWith(nTB);
              aB.style.display = 'none';
              theme.qtyinput_quantity(container);
              cart.buttons();
            }
          }).catch(function(err) {
            console.error('!: ' + err)
          });
        };
      }).catch(function(err) {
        console.error('!: ' + err)
      });
    }
    var cart = {
      buttons:function (e) {
        var qB = container.querySelectorAll('.qtybtn');
        qB.forEach(function(q) {
          setTimeout(function () {
            q.onclick = cart_change;
          }, 1);
        })
        var qI = container.querySelectorAll('.item-qty');
        qI.forEach(function(q) {
          setTimeout(function () {
            q.addEventListener('input',cart_change);
          }, 1);
        })
      }
    };
    cart.buttons();
    // Based on https://community.shopify.com/c/Shopify-Discussion/How-to-get-recent-viewed-products-in-Shopify-Store-in-any-theme/td-p/887103
    if(rct == 'true'){
      function gPD (){
        const pD = JSON.parse(localStorage.getItem('rVP'));
        const rVH = []
        if (pD) {
          rV.classList.remove('hidden');
          if (theme.settings.borders) {var b = 'borders '} else {var b = '';}
          if (theme.settings.title_align) {var t = ' title-align'} else {var t = '';}
          pD.forEach(function(item,i){
            if (item.pFI) {var h = ''} else {var h = ' hidden';}
            if (item.pPMn > 0) {
              if (item.pPV) {
                var p = 'From ' + '<h6>' + Shopify.formatMoney(item.pP,theme.moneyFormat) + '</h6>';
              } else {
                if (item.pPC > item.pP) {
                  var p = '<h6>' + Shopify.formatMoney(item.pP,theme.moneyFormat) + ' | <del>' + Shopify.formatMoney(item.pPC,theme.moneyFormat) + '</del></h6>';
                } else {                  
                  var p = '<h6>' + Shopify.formatMoney(item.pP,theme.moneyFormat) + '</h6>';
                }
              }
            } else {
              if (item.pPV) {                
                var p = '<h6>' + theme.language.products_product_free + ' - ' + Shopify.formatMoney(item.pPMx,theme.moneyFormat) + '</h6>';
              } else {
                var p = '<h6>' + theme.language.products_product_free + '</h6>';
              }
            }
            if (theme.settings.vendor) {
              var v = '<p class="product-logistics"><span class="vendors"><a href="' + item.pVU + '" title="' + item.pV + '">' + item.pV + '</a></span></p>';
            } else {
              var v = '';
            }
            rVH.push('<div class="product ' + b + ' two-half animate animate-loop-' + i + '"><div class="product-border"><div class="product-thumb cart' + t + h +'"><div class="relative"><a href="' + item.pU + '" title="' + item.pT + '" class="img-align"><img src="' + item.pI + '" alt="' + item.pT + '"/></a></div></div><div class="product-details ' + theme.settings.align + '"><div class="product-title"><h5><a href="' + item.pU + '" title="' + item.pT + '">' + item.pT + '</a></h5></div><div class="product-price">' + p + '</div>' + v + '<div><a href="' + item.pU + '" title="' + item.pT + '" class="btn auto-width">' + theme.language.products_general_details + '</a></div></div></div></div></div>')
          })
          const rB = rVH.join('');
          const cB = document.getElementsByClassName('recently-viewed');
          for (let i = 0; i < cB.length; i++) {
            cB[i].innerHTML = rB; 
          }
        }
      }    
      gPD();
    };
  }
  return Cart;
})();
theme.Search = (function() {
  function Search(container) {
    var sectionId = container.getAttribute('data-section-id');
    theme.live_search(container);
    if (theme.settings.cart) {
      theme.ajax_cart(container);
    }
    theme.swatches(container);
  }
  return Search;
})(); 
theme.Contact = (function() {
  function Contact(container) {     
    var sectionId = container.getAttribute('data-section-id');
    var hdr = document.getElementById('header-toolbar');
    var hny = document.getElementById('honeypot');
    hny.innerHTML = '<input class="btn standard-width bottompad" type="submit" value="' + theme.language.contact_form_send + '" id="contactFormSubmit" />';
    function sbmt(e) {
      if (container.querySelector('input[type="text"]#contactFormNumber').value.length > 0) {
        e.preventDefault();
      }
    }
    container.querySelector('form').addEventListener('submit', sbmt);
  }
  return Contact;
})();    
theme.Password = (function() {
  function Password(container) {
    let vh = window.innerHeight;
    var p = document.querySelector('.password');
    var pp = document.querySelector('.password-page');
    p.style.height = vh + 'px';
    pp.style.height = vh + 'px';
    window.onresize = function(){
      let vh = window.innerHeight;
      p.style.height = vh + 'px';
      pp.style.height = vh + 'px';
    };
    var el = document.querySelectorAll('.password-links a');
    el.forEach(function(e) {
      e.onclick = function(ev){
        let id = e.getAttribute('data-id');
        const body = document.body;
        const content = document.getElementById(id);
        const newInstance = basicLightbox.create(content, {
          onShow: (instance) => {            
            body.classList.add('basicLightbox__active');
            instance.element().querySelector('button').onclick = () => instance.close();
          },
          onClose: (instance) => {
            body.classList.remove('basicLightbox__active');
            content.innerHTML = instance.element().querySelector('.basicLightbox__placeholder').innerHTML;
          }
        })
        newInstance.show();
        var input = newInstance.element().querySelector('input[type="password"]');
        if (input) {
          input.focus();
        }
        ev.preventDefault();
      }
    });
  }
  return Password;
})();
theme.NotFound = (function() {
  function NotFound(container) {
    var sectionId = container.getAttribute('data-section-id');
    var Carousel = document.getElementById('glider-carousel-' + sectionId);
    theme.live_search(container);
    if (Carousel) {
      theme.slider(container);
    }
    theme.swatches(container);
    if (theme.settings.cart) {
      theme.ajax_cart(container);
    }
    NotFound.prototype.onSelect = function(ev) {
      if (theme.settings.quickView) {
        theme.quick();
      }
      if (theme.settings.cart) {
        theme.ajax_cart(container);
      }
    }
  }
  return NotFound;
})();
theme.quick = function () {
  var el = document.querySelectorAll('.quick');
  el.forEach(function(e) {
    e.onclick = function(ev){
      var url = this.getAttribute('data-src');
      const body = document.body;
      const content = document.createElement('div');
      const div = document.createElement('div');
      const ldr = document.createElement('div');
      const btn = document.createElement('button');
      ldr.classList.add('loader');
      btn.classList.add('basicLightbox__close','hidden');
      content.appendChild(div)
      div.appendChild(ldr)
      content.appendChild(btn)
      const newInstance = basicLightbox.create(content, {
        onShow: (instance) => {
          body.classList.add('basicLightbox__active');
          fetch(url)
          .then(response => response.text())
          .then(text => {
            const parser = new DOMParser();
            const htmlDocument = parser.parseFromString(text, 'text/html');
            const section = htmlDocument.documentElement.querySelector('.product-id');            
            div.appendChild(section);            
            div.classList.add('basicLightbox__div');
            btn.classList.remove('hidden');
            ldr.classList.add('hidden');                        
            var container = document.getElementById('product-id-product-template-quick');
            var c = container.getAttribute('data-cart');
            theme.product_options_js(container);
            theme.product_selectCallback(container);
            theme.swatches(container);
            theme.product_media(container);
            theme.qtyinput_quantity(container);
            if(c == 'true'){
              theme.ajax_cart(container);
            }
            if (window.SPR) {
              SPR.initDomEls();
              SPR.loadBadges();
            }
            if (Shopify.PaymentButton) {
              Shopify.PaymentButton.init();
            }
          })
          instance.element().querySelector('button').onclick = () => newInstance.close()
        },
        onClose: (instance) => {
          setTimeout(function() {
            body.classList.remove('basicLightbox__active');
          }, 1);
        }
      })
      newInstance.show()
      ev.preventDefault();
    };
  });
};
theme.qtyinput_quantity = function (container) {
  var sectionId = container.getAttribute('data-section-id');
  var productId = container.getAttribute('data-product-id');
  var qp = container.querySelectorAll('.qtyplus_' + sectionId + ',.qtyplus_multi');
  qp.forEach(function(q) {
    q.addEventListener('click', function(ev) {
      var fieldName = q.getAttribute('field');
      var pricefieldName = q.getAttribute('price-field');
      var input = container.querySelector('input[id=' + pricefieldName + ']');
      if (input) {
        var priceid = input.getAttribute('price');
      }
      var key = document.getElementById(fieldName);
      var error = document.getElementById(key.getAttribute('field'));
      var max = key.getAttribute('max');
      var currentVal = key.value;
      if (isNaN(currentVal)) {
        var currentVal = 0; 
      };
      key.value = ++currentVal;
      if (!max) {
        if (!fieldName.includes('product') && !q.classList.contains('index-template')) {
          error.style.display = 'block';
          error.textContent = theme.language.products_product_ajax_added;
        };
      } else if (max != 0) {
        if (++currentVal > max) { 
          error.style.display = 'block';
          error.innerHTML = theme.language.products_general_inv_msg_1 + '&nbsp;' + max + '&nbsp;' + theme.language.products_general_inv_msg_2;
          key.value = max;
        } else {
          if (!fieldName.includes('product') && !q.classList.contains('index-template')) {
            error.style.display = 'block';
            error.textContent = theme.language.products_product_ajax_added;
          }
        }
      } else if (max < 0) {
        error.style.display = 'block';
        error.textContent = theme.language.products_product_disabled_add_to_cart;
        key.value = 0;
      } else {
        error.style.display = 'block';
        error.textContent = theme.language.products_product_sold_out;
        key.value = 0;
      }
      var newVal = key.value;
      if (input) {
        input.value = newVal * priceid;
      }
      ev.preventDefault();
    }, false);
  });
  var qm = container.querySelectorAll('.qtyminus_' + sectionId + ',.qtyminus_multi');
  qm.forEach(function(q) {
    q.addEventListener('click', function(ev) {
      var fieldName = q.getAttribute('field');
      var pricefieldName = q.getAttribute('price-field');
      var input = container.querySelector('input[id=' + pricefieldName + ']');
      if (input) {
        var priceid = input.getAttribute('price');
      }
      var key = document.getElementById(fieldName);
      var error = document.getElementById(key.getAttribute('field'));
      var min = key.getAttribute('min');
      var currentVal = key.value;
      if (isNaN(currentVal)) {
        var currentVal = 2; 
      };
      if (key.value > 0 && !fieldName.includes('product') && !q.classList.contains('index-template')) {
        error.style.display = 'block';
        error.textContent = theme.language.products_product_ajax_updated;
      }
      if (!isNaN(currentVal) && currentVal > min) {
        key.value = --currentVal;  
      } else {
        key.value = min;  
      }
      var newVal = key.value;
      if (input) {
        input.value = newVal * priceid;
      }
      ev.preventDefault();
    }, false);
  });  
  var qu = container.querySelectorAll('input.quantity');
  qu.forEach(function(q) {
    q.addEventListener('input', function(ev) {
      var error = document.getElementById(q.getAttribute('field'));
      var max = parseInt(q.getAttribute('max'), 10);
      var min = parseInt(q.getAttribute('min'), 10);
      var value = parseInt((q.value), 10) || 0;
      error.style.display = 'none';
      if (!max) {
        error.style.display = 'block';
        error.textContent = theme.language.products_product_ajax_updated;
      } else if (max != 0) {
        error.style.display = 'block';
        if (value > max) {
          error.innerHTML = theme.language.products_general_inv_msg_1 + '&nbsp;' + max + '&nbsp;' + theme.language.products_general_inv_msg_2;
          q.value = max;
        } else {
          error.textContent = theme.language.products_product_ajax_updated;
        }
      } else if (max < 0) {
        error.style.display = 'block';
        error.textContent = theme.language.products_product_disabled_add_to_cart;
        key.value = 0;
      } else {
        error.style.display = 'block';
        error.textContent = theme.language.products_product_sold_out;
        q.value = 0;
      }
    });
  });
  var rim = container.querySelectorAll('.remove_item_multi');
  rim.forEach(function(r) {
    r.addEventListener('click', function(ev) {
      var fieldName = r.getAttribute('field');
      var key = document.getElementById(fieldName);
      key.value = 0;
      ev.preventDefault();
    }, false);
  });
};
theme.ajax_cart_dropdown = function () {
  if(theme.mobile == true){
    var dd = document.getElementById('cart-count-mobile');
  } else {
    var dd = document.getElementById('cart-count-desktop');
  }
  var ddC = dd.querySelector('.basicLightbox__close');
  fetch(theme.routes_cart_url + '.js')
  .then(function(r) {
    return r.json();
  }).then(function(j) {
    var cC = document.querySelectorAll('.cartCountSelector');
    var cT = document.querySelector('.cartTotalSelector');
    cC.forEach(function(c) {
      c.textContent = j.item_count;
    });
    cT.innerHTML = Shopify.formatMoney(j.total_price, theme.moneyFormat).replace(/((\,00)|(\.00))$/g, '');
    if (j.items.length > 0) {
      var ul = document.getElementById('cart-dropdown');
      var lis = ul.querySelectorAll('li.cart-product');
      ul.classList.remove('hidden');
      lis.forEach(function(l) {
        l.remove();
      });
      if (j.items.length > 1) {
        var q = 2;
      } else {
        var q = 1;
        document.querySelector('.cart-count-mobile').setAttribute('href', 'javascript:;');
      };
      if (j.items.length > 2) {
        ul.querySelector('li.count').classList.remove('hidden');
        ul.querySelector('span.count').textContent = (j.items.length - 2)
      }
      let f = document.createDocumentFragment();
      for (var i = 0;  i < q; i++) {
        let m = j.items[i].image;
        let t = j.items[i].product_title;
        let v = j.items[i].variant_title;
        let u = j.items[i].url;
        let p = j.items[i].final_price;
        let dl = j.items[i].line_level_discount_allocations.length;
        let op = j.items[i].original_line_price;
        let fp = j.items[i].final_line_price;
        const li = document.createElement('li');
        const tc = document.createElement('div');
        const d = document.createElement('div');
        const it = document.createElement('div');
        const h5 = document.createElement('h5');
        const at = document.createElement('a');
        const sp = document.createElement('p');
        const sps = document.createElement('small');
        const pp = document.createElement('div');
        const h6 = document.createElement('h6');
        const to = document.createElement('p');
        const tos = document.createElement('span');
        li.classList.add('cart-product','clearfix');
        if (j.items.length == 1 || i > 0) {
          li.classList.add('last');
        } else {
          li.classList.add('first','relative');
        }
        if (i == 0) {
          const btn = document.createElement('a')
          btn.classList.add('basicLightbox__close')
          btn.setAttribute('href', 'javascript:;')
          li.appendChild(btn)
          if (theme.cart || theme.dropdown == false) {
            btn.classList.add('hidden');
          }
          btn.addEventListener('click', function(ev) {
            dd.classList.remove('hover');
            dd.classList.add('avoid');
            btn.classList.add('hidden');
            setTimeout(function() {
              dd.classList.remove('avoid');
            }, 1);
            ev.preventDefault();
          }, false);
        }
        tc.classList.add('table-center','item','item-row','clearfix');
        if (m) {
          let im = m.replace('.jpg','_180x.jpg');
          const iv = document.createElement('div');
          const r = document.createElement('div');
          const rr = document.createElement('div');
          const ai = document.createElement('a');
          const img = document.createElement('img');
          iv.classList.add('five','brands','negative-left','item-thumb','title-align','title-align-left');
          r.classList.add('relative');
          rr.classList.add('relative');
          ai.classList.add('img-align');
          ai.setAttribute('title',t);
          ai.setAttribute('href',u);
          img.classList.add('img-align','dropdown', 'lazywidth');
          img.setAttribute('alt',t);
          img.setAttribute('src',im);
          rr.appendChild(img);
          ai.appendChild(rr);
          r.appendChild(ai);
          iv.appendChild(r);
          tc.appendChild(iv);
          d.classList.add('seven','brands','negative-right');
        } else {
          d.classList.add('twelve','negative-left','negative-right');
        }
        it.classList.add('item-title');
        at.setAttribute('title',t);
        at.setAttribute('href',u);
        if (v) {
          var nt = t + '<br/><small>' + v + '</small>';
        } else {                  
          var nt = t;
        }
        at.innerHTML = nt;
        h5.appendChild(at);
        it.appendChild(h5);
        d.appendChild(it);
        tc.appendChild(d);
        if (j.items[i].selling_plan_allocation) {
          sp.classList.add('bottompad-quarter');
          sps.textContent = j.items[i].selling_plan_allocation.selling_plan.name;
          sp.appendChild(sps);
          it.appendChild(sp);
          d.appendChild(it);
          tc.appendChild(d);
        }
        pp.classList.add('product-price');
        if (p > 0) {
          var np = Shopify.formatMoney(p, theme.moneyFormat) + ' ' + theme.language.cart_general_each;
        } else {
          var np = theme.language.products_product_free;
        }
        h6.innerHTML = np;
        if (j.items[i].unit_price) {
          var np = h6.innerHTML;
          var up = j.items[i].unit_price
          if (j.items[i].unit_price_measurement.reference_value > 1) {
            var rf = j.items[i].unit_price_measurement.reference_value + j.items[i].unit_price_measurement.reference_unit;
          } else {
            var rf = j.items[i].unit_price_measurement.reference_unit;
          }
          var upf = np + '<br/><small>' + Shopify.formatMoney(up, theme.moneyFormat) + theme.language.products_general_per + rf + '</small>';
          h6.innerHTML = upf;
        }
        if (dl > 0) {
          var np = h6.innerHTML;
          var da = j.items[i].line_level_discount_allocations[0].amount
          var daf = np + '<br/><small>' + j.items[i].line_level_discount_allocations[0].discount_application.title + ': -' + Shopify.formatMoney(da, theme.moneyFormat) + '</small>';
          h6.innerHTML = daf;
        }
        pp.appendChild(h6);
        d.appendChild(pp);
        tc.appendChild(d);
        tos.classList.add('vendors');
        if (dl > 0) {
          tos.innerHTML = theme.language.cart_general_carttotal + ' ' + Shopify.formatMoney(fp, theme.moneyFormat) + ' | <s>' + Shopify.formatMoney(op, theme.moneyFormat) + '</s>';
        } else {
          tos.innerHTML = theme.language.cart_general_carttotal + ' ' + Shopify.formatMoney(fp, theme.moneyFormat);
        }
        to.appendChild(tos);
        d.appendChild(to);
        tc.appendChild(d);
        li.appendChild(tc);
        f.appendChild(li);
      }
      ul.insertBefore(f, ul.childNodes[0]);
      if (!theme.cart && theme.dropdown == true) {
        dd.classList.add('hover');
      };
    } else {
      document.querySelector('.cart-count-mobile').setAttribute('href', theme.routes_cart_url);
      document.getElementById('cart-dropdown').classList.add('hidden');
    }   
  }).catch(function(err) {
    console.error('!: ' + err)
  });
};
theme.ajax_cart = function (container) {
  var sectionId = container.getAttribute('data-section-id');
  var productId = container.getAttribute('data-product-id');  
  var sU = container.querySelectorAll('[type="submit"]');
  sU.forEach(function(s) {
    s.onclick = function(ev){      
      var p = s.closest('.go-to-cart-' + sectionId)
      var FB = p.querySelector('.feedback');
      var aFB = container.querySelector('.feedback.loaded');
      var t = p.querySelector('.icon-times');
      var c = p.querySelector('.icon-check');
      function fb(success, html) {
        FB.classList.add(success);
        FB.querySelector('.html').innerHTML = html;
        if (!FB.classList.contains('loaded')) {
          FB.classList.add('open');
          FB.style.height = 'auto';
          var FBht = FB.clientHeight;
          var FBhtpx = FBht + 'px';
          FB.style.height = '0px';
          setTimeout(function () {
            FB.style.height = FBhtpx;
          }, 0);
          setTimeout(function () {
            FB.classList.add('visible','loaded');
          }, 1);
        } else {
          FB.style.height = 'auto';
        }
      }
      var id = p.elements['id'].value;
      if (p.elements['quantity']) {
        var q = p.elements['quantity'].value
        } else {
          var q = 1
          }
      let formData = {
        'items': [{
          'id': id,
          'quantity': q
        }]
      };      
      fetch(theme.routes_cart_add_url + '.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      }).then(function(r) {        
        return r.json();        
      }).then(function(j) { 
        if (aFB && !FB.classList.contains('loaded')) {
          if (!FB.classList.contains('loaded')) {
            aFB.style.height = '0px';
            aFB.classList.remove('visible','loaded')
            aFB.addEventListener('transitionend', function () {
              aFB.classList.remove('open')
            }, {once: true})
          }
        }
        s.value = theme.language.products_product_ajax_adding;
        s.classList.add('outline');
        s.setAttribute('disabled', true);
        if (j.status == 422) {          
          console.log('Request returned an error', j)
          r = j.description;
          t.classList.remove('hidden');
          c.classList.add('hidden');
          fb('error', r.replace('All 1 ', 'All ').replace(' are', 's are').replace('ss are', 's are'));
          s.value = theme.language.products_product_sold_out;
        } else {
          window.setTimeout(function(){ 
            s.value = theme.language.products_product_ajax_thanks;
          }, 1000);
          c.classList.remove('hidden');
          t.classList.add('hidden');
          FB.classList.remove('error');
          fb('cart-success',theme.language.products_product_ajax_added + '&nbsp;<a href="' + theme.routes_cart_url + '">' + theme.language.products_product_ajax_view + '</a>');
          window.setTimeout(function(){
            s.classList.remove('outline');
            s.removeAttribute('disabled');
            s.value = theme.language.products_product_add_to_cart
          }, 2000);
          theme.ajax_cart_dropdown();
        };
      }).catch(function(err) {
        console.error('!: ' + err)
      });
      ev.preventDefault();
    };
  });  
};
theme.multi = function () {
  var aB = document.getElementById('ajaxBusy');
  var el = document.querySelectorAll('.currency');
  el.forEach(function(e) {
    var cs = document.querySelectorAll('.currency-selector select');
    var ul = e.querySelector('ul');
    if (ul) {
      var aa = ul.querySelectorAll('a');
    }
    if (aa) {
      aa.forEach(function(a) {
        a.onclick = function(ev){
          var dm = a.getAttribute('data-multi');
          var hs = a.getAttribute('data-header_symbol');
          var fs = a.getAttribute('data-footer_symbol');
          var dc = a.getAttribute('data-code');
          var hl = document.querySelector('header li.account.currency a[data-multi="' + dm + '"]');
          var fl = document.querySelector('footer .currency a[data-multi="' + dm + '"]');
          if (hl) {
            hl.innerHTML = hs;
            hl.classList.remove('active');
          }
          if (fl) {
            fl.innerHTML = '<small>' + fs + '</small>';
            fl.classList.remove('active');
          }
          ul.style.display = 'none';
          aB.style.display = 'block';
          if (hl) {            
            document.querySelector('header option[value="' + dc + '"]').selected = 'selected';
            document.getElementById('localization_form-header').submit();            
          } else {
            document.querySelector('footer option[value="' + dc + '"]').selected = 'selected';
            document.getElementById('localization_form-footer').submit();
          }
          ev.preventDefault();
        };
      });
    };    
    cs.forEach(function(c) {
      c.onchange = function(){
        aB.style.display = 'block';
        c.closest('form').submit();
      };
    });
  });
};
theme.tabs = function (container) {
  var sectionId = container.getAttribute('data-section-id');
  var type = container.getAttribute('data-carousel-type');
  var Carousel = document.getElementById('tabs-carousel-' + sectionId);
  if (Carousel) {
    var next = document.getElementById('tabs-button-next-' + sectionId);
    var prev = document.getElementById('tabs-button-prev-' + sectionId);  
    var glider = new Glider(Carousel, {
      arrows: {
        prev: prev,
        next: next
      },
      draggable: true,
      dragVelocity:1,
      exactWidth: true,
      itemWidth: 200,
      resizeLock: false,
      skipTrack: true,
      slidesToShow: 'auto',
      slidesToScroll: 1
    });  
    if (glider) {
      Carousel.classList.add('loaded');      
      setTimeout(function () {
        Carousel.classList.remove('load');
      }, 100);
    };
    var tl = container.querySelectorAll('.tabs-id-' + sectionId + ' a');
    var tc = container.querySelectorAll('.tab-body-id-' + sectionId);
    if (type == 'section') {
      var sectionId = container.getAttribute('data-section-id');
    } else {
      var sectionId = container.querySelector('.product-loop[data-glider="loaded"]').getAttribute('data-block-id');
    }
    function ot(e) {
      e.preventDefault();
      var a = e.currentTarget;
      var id = a.getAttribute('title');
      var b = document.getElementById(id);
      tl.forEach(function(e) {
        e.classList.remove('first');
        e.setAttribute('tabindex','-1');
        e.setAttribute('aria-selected','false');
      });
      a.classList.add('first');
      a.setAttribute('tabindex','0');
      a.setAttribute('aria-selected','true');
      tc.forEach(function(e) {
        e.classList.add('hide');
        e.setAttribute('aria-hidden','true');
        var s = e.querySelector('.product-loop[data-glider="loaded"]');
        if (s) {
          s.setAttribute('data-glider', 'ignore');
        }
        var a = e.querySelectorAll('a,.tabindex');
        a.forEach(function(e) {
          e.setAttribute('tabindex','-1');
        });
      });
      b.classList.remove('hide');
      b.setAttribute('aria-hidden','false');    
      var loop = b.querySelector('.product-loop[data-glider="unloaded"]');
      if (loop) {
        loop.setAttribute('data-glider', 'loaded');
        setTimeout(function () {
          if (loop.getAttribute('data-glider') === 'loaded') {
            theme.slider(container);
          }
        }, 1);
        return false;
      }
      var a = b.querySelectorAll('a,.tabindex');
      a.forEach(function(e) {
        e.setAttribute('tabindex','0');
      });
    }
    tl.forEach(function(e) {
      e.addEventListener('click', ot);
    });
  };
};
theme.open_dropdown = function (asS,uOa) {
  var o = asS.nextElementSibling;
  if(!o.classList.contains('active')) {
    uOa.forEach(function(u) {
      u.classList.remove('active');
      u.style.height = '';
      u.style.display = '';
    });
    o.classList.add('active');                
    o.style.height = 'auto';
    var oht = o.clientHeight;
    var ohtpx = oht + 'px';
    o.style.height = '0px';
    setTimeout(function () {
      o.style.height = ohtpx;
    }, 0);
  } else {
    o.style.height = '0px';
    o.addEventListener('transitionend', function () {
      o.classList.remove('active')
    }, {once: true})
  }
};
theme.open_slide = function (container) {
  var sectionId = container.getAttribute('data-section-id');  
  var w = document.getElementById('content').offsetWidth;
  var hs = document.querySelectorAll('.header-searchbar.open-slide');  
  window.addEventListener('resize', function(e) {
    var os = document.querySelectorAll('.open-slide:not(.faq),.open-slide-bullets:not(.faq)');
    var op = document.querySelectorAll('.open:not(.faq)');    
    if (window.innerWidth==w) return; 
    w = window.innerWidth;
    if(w > 600) {
      os.forEach(function(o) {
        o.classList.remove('active');
        o.style.display = '';
        o.style.height = '';
      });
    } else {
      os.forEach(function(o) {
        o.classList.remove('active');
        o.style.height = '0px';
      });
    }    
    op.forEach(function(o) {
      o.classList.remove('active');
    });
    hs.forEach(function(h) {
      h.classList.remove('active');
      h.classList.remove('visible');
      if (!h.querySelector('input[type="text"]').value.length == 0) {
        h.querySelector('input[type="text"]').value = '';
        h.querySelector('.basicLightbox__close').classList.add('hidden');
        h.querySelector('.search-results').style.display = 'none';
        h.querySelector('.search-results').classList.remove('active');
      }
    });
  });
  var el = document.querySelectorAll('.open-' + sectionId);
  el.forEach(function(e) {
    e.onclick = function(ev){
      var oc = this.closest('.open-container');
      var os = oc.querySelector('.open-slide');
      var id = document.getElementById('collection-collection-template-filters');
      var t = document.querySelector('.toggleMenu');
      var moR = document.querySelector('.mobile-only .responsiveMenu');
      var sN = container.querySelector('.sticky-navigation');
      var cCM = document.getElementById('cart-count-mobile');
      var cCMa = cCM.querySelector('.cart-count-mobile');
      var cCMb = cCM.querySelector('.basicLightbox__close');
      if(!os.classList.contains('active')) {        
        if(t.classList.contains('active')) {
          t.classList.remove('active');
          moR.style.display = 'none';
          moR.classList.remove('active');
          document.body.classList.remove('no-scroll');
          document.body.style.position = '';
          document.body.style.left = 'auto';
          document.body.style.right = 'auto';
          document.body.style.top = 'auto';
          document.documentElement.scrollTop = sN.getAttribute('data-y')
        }
        cCM.classList.remove('hover');
        if (cCMb && document.getElementById('cart-dropdown')) {
          cCMb.classList.add('hidden');
        }
        os.classList.add('active');
        os.style.height = 'auto';
        var osht = os.clientHeight;
        if(id) {
          var idht = id.clientHeight;
        }
        var oshtpx = osht + 'px';
        os.style.height = '0px';
        setTimeout(function () {
          os.style.height = oshtpx;
        }, 0);
        hs.forEach(function(h) {
          h.addEventListener('transitionend', function () {
            h.classList.add('visible')
          }, {once: true})
        });
        if(e.classList.contains('open-filter') || e.classList.contains('open-more')) {
          if(id && id.clientHeight > 1) {
            var idhtpx = idht + osht + 'px';
            id.style.height = idhtpx;
          }
        }        
        var s = document.querySelector('.search.open-slide.active');
        if (s) {
          s.querySelector('.search-field').focus();
        }
        e.classList.add('active');
      } else {
        os.style.height = '0px';
        os.addEventListener('transitionend', function () {
          os.classList.remove('active')
        }, {once: true})
        var osht = os.clientHeight;
        if(id) {
          var idht = id.clientHeight;
        }
        hs.forEach(function(h) {
          h.classList.remove('visible');
          if (!h.querySelector('input[type="text"]').value.length == 0) {
            h.querySelector('input[type="text"]').value = '';
            h.querySelector('.basicLightbox__close').classList.add('hidden');
            h.querySelector('.search-results').style.display = 'none';
            h.querySelector('.search-results').classList.remove('active');
          }
        });
        if(e.classList.contains('open-filter')) {
          if(id && id.clientHeight > 1) {
            var idhtpx = idht - osht + 'px';
            id.style.height = idhtpx;
          }
        }
        var s = document.querySelector('.search.open-slide.active');
        if (s) {
          s.querySelector('.search-field').blur();
        }
        e.classList.remove('active');
      }
      ev.preventDefault();
    };
  });
};
theme.live_search = function (container) {
  var sectionId = container.getAttribute('data-section-id');
  var el = document.querySelectorAll('form.search-form-' + sectionId);
  var currentAjaxRequest=null;
  var searchForms=el.forEach(function(e) {
    const id = e.getAttribute('id');
    var i = e.querySelector('.search-field');
    const ul = document.createElement('ul')
    ul.classList.add('search-results','inline','text-left','unformatted');
    ul.style.display = 'none';
    document.getElementById(id).appendChild(ul);
    const btn = document.createElement('a');
    btn.classList.add('basicLightbox__close','hidden');
    btn.setAttribute('href', 'javascript:;')
    document.getElementById(id).appendChild(btn);
    i.addEventListener('input', function (e) {
      var t = this.value;
      var e = theme.routes_search_url + '?q=' + t;
      var f = this.closest('form').getAttribute('id');
      var a = document.querySelector('#' + f + ' .search-results');
      var url = e + '&view=json';
      var gJ = function(url) {
        return new Promise(function(resolve, reject) {
          var r = new XMLHttpRequest();
          r.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
              var a = JSON.parse(r.response.replace(/(<([^>]+)>)/gi, ''));
              f(a);
            }
          };
          r.open('get', url, true);
          r.send('');
          function f(t) {
            if (t) {
              a.innerHTML = '';
              a.style.display = 'none';
              a.classList.remove('active');
              t.results.forEach(function(t,e){
                const s = document.createElement('a')
                s.setAttribute('href',t.url)
                s.setAttribute('title',t.title)
                var col = 'six';
                var p = '';
                var v = '';
                if (t.category != 'product'){
                  col =  'twelve'
                }
                if (t.price != undefined){
                  const spn = document.createElement('span')
                  const h6 = document.createElement('h6')
                  spn.classList.add('product-price')
                  spn.appendChild(h6)
                  if (t.price > 0){
                    h6.innerHTML = Shopify.formatMoney(t.price,theme.moneyFormat)
                  } else {
                    h6.innerText = theme.language.products_product_free
                  }
                  p = spn
                }
                if (t.vendor != undefined){
                  const spn = document.createElement('span')
                  const sml = document.createElement('small')
                  spn.classList.add('vendor')
                  spn.appendChild(sml)
                  sml.innerText = t.vendor
                  v = spn
                }
                if (t.thumbnail.indexOf('no-image')<=0 ){
                  const spn = document.createElement('span')
                  const img = document.createElement('img')
                  spn.classList.add('thumbnail')
                  img.setAttribute('src',t.thumbnail)
                  spn.appendChild(img);
                  s.appendChild(spn);
                  s.classList.add('with-image');
                }
                const li = document.createElement('li')  
                const spn1 = document.createElement('span')              
                const spn2 = document.createElement('span')
                li.classList.add(col,'relative',t.category)
                spn2.classList.add('h5')
                spn2.innerText = t.title
                spn1.appendChild(spn2);
                if (p){
                  spn1.appendChild(p);
                }
                if (v){
                  spn1.appendChild(v);
                }
                s.appendChild(spn1);
                li.appendChild(s);
                a.append(li)
              })
              if (a.innerHTML) {
                a.style.display = '';
                a.classList.add('active');
                btn.classList.remove('hidden');
              }
              var cls = a.closest('.animate-section');
              if (cls) {
                cls.classList.add('loaded');
              }
              if (t.results_count > 10) {
                const li = document.createElement('li') 
                const lnk = document.createElement('a')
                li.classList.add('see-all','twelve','text-center') 
                lnk.setAttribute('href',e)
                lnk.innerText = theme.language.general_search_see_results+' (' + t.results_count + ')'
                li.appendChild(lnk);
                a.appendChild(li);
              }
            }    

          };
        });
      };
      if (t.length > 3) {
        gJ(url);
        btn.addEventListener('click', function(ev) {
          i.value = '';
          i.focus();
          a.style.display = 'none';
          a.classList.remove('active');
          btn.classList.add('hidden');
          ev.preventDefault();
        }, false);
      };
    });
  });
};
theme.customerTemplates = (function() {
  var cl = document.getElementById('customer_login');
  var rp = document.getElementById('recover_password');
  var re = document.getElementById('recover-email');
  var rs = document.getElementById('resetSuccess');
  var aa = document.getElementById('add_address');
  var aB = document.getElementById('ajaxBusy');
  function toggleRecoverPasswordForm() {
    rp.classList.toggle('hidden');
    cl.classList.toggle('hidden');
  }
  function initEventListeners() {
    var el = document.querySelectorAll('#recover_password_btn,#customer_login_btn');
    el.forEach(function(e) {
      e.onclick = function(ev) {
        toggleRecoverPasswordForm();
        ev.preventDefault();
      };
    });
  }
  function resetPasswordSuccess() {
    var formState = document.querySelector('.reset-success');
    if (!formState) {
      return;
    }
    if (re.classList.contains('reset-success')) {
      rs.classList.remove('hidden');
    }
    if (re.classList.contains('reset-error')) {
      rp.classList.remove('hidden');
      cl.classList.add('hidden');
    };
  }
  function customerAddressForm() {
    if (!aa) {
      return;
    }
    if (Shopify) {
      new Shopify.CountryProvinceSelector(
        'address_country_new',
        'address_province_new',
        {
          hideElement: 'address_province_container_new'
        }
      );
    }
    var el = document.querySelectorAll('.address_country_option');
    el.forEach(function(e) {
      var formId = e.dataset.formId;
      var countrySelector = 'address_country_' + formId;
      var provinceSelector = 'address_province_' + formId;
      var containerSelector = 'address_province_container_' + formId;
      new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
        hideElement: containerSelector
      });
    });
    document.getElementById('add_address_btn').onclick = function(ev) {
      var a = document.getElementById('add_address');
      a.classList.toggle('hidden');
      document.getElementById('address_first_name_new').focus();      
      var s = a.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({top:s-document.selectors.sht, behavior: 'smooth'});
      ev.preventDefault();
    };
    document.getElementById('add_address_cancel').onclick = function(ev) {
      window.scrollTo({top:0, behavior: 'smooth'}); 
      setTimeout(function () {
        document.getElementById('add_address').classList.add('hidden');
      }, 1000);
      ev.preventDefault();
    };
    document.querySelectorAll('.edit_address').forEach(function(b) {
      b.onclick = function(ev) {
        var iD = b.getAttribute('data-form-id');
        var vA = document.getElementById('view_address_' + iD);
        var eA = document.getElementById('edit_address_' + iD);
        if (b.classList.contains('account-secondary')) {
          var s = eA.getBoundingClientRect().top + window.pageYOffset;
        } else {
          var s = vA.getBoundingClientRect().top + window.pageYOffset;
        }
        window.scrollTo({top:s-document.selectors.sht, behavior: 'smooth'});
        vA.classList.toggle('hidden');
        eA.classList.toggle('hidden');
      };
    });    
    document.querySelectorAll('.edit_address_delete').forEach(function(b) {
      b.onclick = function(ev) {
        var t = b.getAttribute('data-target');
        var m = b.getAttribute('data-confirm');
        if (b.classList.contains('edit_address_confirm')) {
          Shopify.postLink(t, {
            parameters: { _method: 'delete' }
          });
          aB.style.display = 'block';
        } else {
          b.textContent = m;
          b.classList.add('edit_address_confirm','error-text');
        }
      };
    });
    document.querySelectorAll('.address_btn').forEach(function(b) {
      b.onclick = function(ev) {
        aB.style.display = 'block';
      };
    });
  }  
  return {
    init: function() {
      initEventListeners();
      resetPasswordSuccess();
      customerAddressForm();
    }
  };
})();
document.addEventListener('DOMContentLoaded', function() {
  var sections = new theme.Sections();
  sections.register('header_section', theme.Header);
  sections.register('filter_section', theme.Filter);
  sections.register('home_slideshow', theme.HomeSlideshow);
  sections.register('home_collections_tabbed', theme.HomeCollectionsTabbed);
  sections.register('home_collection', theme.HomeCollection);
  sections.register('home_collections_list', theme.HomeCollectionsList);
  sections.register('home_collections_grid', theme.HomeCollectionsGrid);
  sections.register('home_map', theme.HomeMap);
  sections.register('home_faq', theme.HomeFAQ)
  sections.register('home_blog_list', theme.HomeBlog);
  sections.register('home_search', theme.HomeSearch);
  sections.register('home_video', theme.HomeVideo);
  sections.register('footer_section', theme.Footer);
  sections.register('collection_page', theme.Collection);
  sections.register('product_page', theme.Product);
  sections.register('product_recommendations', theme.ProductRecommendations);
  sections.register('product_related', theme.ProductRelated);
  sections.register('store_availability', theme.StoreAvailability);
  sections.register('cart_page', theme.Cart);
  sections.register('search_page', theme.Search);
  sections.register('page_contact', theme.Contact);
  sections.register('password_page', theme.Password);
  sections.register('error_page', theme.NotFound);
  theme.customerTemplates.init();
  var el = document.querySelectorAll('a[href*="#"]:not(.glider-slide):not(.parent)');
  el.forEach(function(e) {
    e.onclick = function(ev) {
      if (this.pathname == location.pathname && this.hash !== '') {
        ev.preventDefault();
        var hsh = this.hash;
        var hc = document.querySelector(hsh);
        if (!hc) {
          return;
        }
        var s = hc.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({top:s-document.selectors.sht, behavior: 'smooth'}); 
      }
    };
  });
  if (theme.settings.quickView) {
    theme.quick();
  }
  theme.wrap_options();
  document.querySelectorAll('.form-validation').forEach(formElement => {
    ValidForm(formElement, {
      invalidClass: 'invalid',
      validationErrorClass: 'error',
      validationErrorParentClass: 'has-error',
      errorPlacement: 'after',
      customMessages: {
        badInput: theme.language.general_validation_match,
        patternMismatch: theme.language.general_validation_match,
        rangeOverflow: theme.language.general_validation_value_less,
        rangeUnderflow: theme.language.general_validation_value_greater,
        stepMismatch: theme.language.general_validation_error,
        tooLong: theme.language.general_validation_characters_exceed,
        tooShort: theme.language.general_validation_characters_min,
        typeMismatch: theme.language.general_validation_match,
        valueMissing: theme.language.general_validation_required,
        emailMismatch: theme.language.general_validation_valid_email,
        urlMismatch: theme.language.general_validation_valid_url,
        numberMismatch: theme.language.general_validation_valid_number
      }
    })
  });
  if (theme.settings.addThis) {
    if (typeof(window.addthis) === 'object' && typeof(window.addthis.layers) === 'function' && typeof(window.addthis.layers.refresh) === 'function') {
      window.addthis.layers.refresh();
    }  
  };
  document.addEventListener('touchstart', function() {theme.Helpers.setTouch();},{once:true});
  if (window.SPR) {
    SPR.initDomEls();
    SPR.loadBadges();
  }
});
//	basicLightbox - 5.0.3 | https://basiclightbox.electerious.com/ | Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).basicLightbox=e()}}((function(){return function e(n,t,o){function r(c,u){if(!t[c]){if(!n[c]){var s="function"==typeof require&&require;if(!u&&s)return s(c,!0);if(i)return i(c,!0);var a=new Error("Cannot find module '"+c+"'");throw a.code="MODULE_NOT_FOUND",a}var l=t[c]={exports:{}};n[c][0].call(l.exports,(function(e){return r(n[c][1][e]||e)}),l,l.exports,e,n,t,o)}return t[c].exports}for(var i="function"==typeof require&&require,c=0;c<o.length;c++)r(o[c]);return r}({1:[function(e,n,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.create=t.visible=void 0;var o=function(e){var n=arguments.length>1&&void 0!==arguments[1]&&arguments[1],t=document.createElement("div");return t.innerHTML=e.trim(),!0===n?t.children:t.firstChild},r=function(e,n){var t=e.children;return 1===t.length&&t[0].tagName===n},i=function(e){return null!=(e=e||document.querySelector(".basicLightbox"))&&!0===e.ownerDocument.body.contains(e)};t.visible=i;t.create=function(e,n){var t=function(e,n){var t=o('\n\t\t<div class="basicLightbox '.concat(n.className,'">\n\t\t\t<div class="basicLightbox__placeholder" role="dialog"></div>\n\t\t</div>\n\t')),i=t.querySelector(".basicLightbox__placeholder");e.forEach((function(e){return i.appendChild(e)}));var c=r(i,"IMG"),u=r(i,"VIDEO"),s=r(i,"IFRAME");return!0===c&&t.classList.add("basicLightbox--img"),!0===u&&t.classList.add("basicLightbox--video"),!0===s&&t.classList.add("basicLightbox--iframe"),t}(e=function(e){var n="string"==typeof e,t=e instanceof HTMLElement==!0;if(!1===n&&!1===t)throw new Error("Content must be a DOM element/node or string");return!0===n?Array.from(o(e,!0)):"TEMPLATE"===e.tagName?[e.content.cloneNode(!0)]:Array.from(e.children)}(e),n=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};if(null==(e=Object.assign({},e)).closable&&(e.closable=!0),null==e.className&&(e.className=""),null==e.onShow&&(e.onShow=function(){}),null==e.onClose&&(e.onClose=function(){}),"boolean"!=typeof e.closable)throw new Error("Property `closable` must be a boolean");if("string"!=typeof e.className)throw new Error("Property `className` must be a string");if("function"!=typeof e.onShow)throw new Error("Property `onShow` must be a function");if("function"!=typeof e.onClose)throw new Error("Property `onClose` must be a function");return e}(n)),c=function(e){return!1!==n.onClose(u)&&function(e,n){return e.classList.remove("basicLightbox--visible"),setTimeout((function(){return!1===i(e)||e.parentElement.removeChild(e),n()}),410),!0}(t,(function(){if("function"==typeof e)return e(u)}))};!0===n.closable&&t.addEventListener("click",(function(e){e.target===t&&c()}));var u={element:function(){return t},visible:function(){return i(t)},show:function(e){return!1!==n.onShow(u)&&function(e,n){return document.body.appendChild(e),setTimeout((function(){requestAnimationFrame((function(){return e.classList.add("basicLightbox--visible"),n()}))}),10),!0}(t,(function(){if("function"==typeof e)return e(u)}))},close:c};return u}},{}]},{},[1])(1)}));			
//	ValidForm - 1.1.1 | https://github.com/Pageclip/valid-form | Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){"use strict";var _validForm=require("./src/valid-form");var _validForm2=_interopRequireDefault(_validForm);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}window.ValidForm=_validForm2.default;window.ValidForm.toggleInvalidClass=_validForm.toggleInvalidClass;window.ValidForm.handleCustomMessages=_validForm.handleCustomMessages;window.ValidForm.handleCustomMessageDisplay=_validForm.handleCustomMessageDisplay},{"./src/valid-form":3}],2:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.clone=clone;exports.defaults=defaults;exports.insertAfter=insertAfter;exports.insertBefore=insertBefore;exports.forEach=forEach;exports.debounce=debounce;function clone(obj){var copy={};for(var attr in obj){if(obj.hasOwnProperty(attr))copy[attr]=obj[attr]}return copy}function defaults(obj,defaultObject){obj=clone(obj||{});for(var k in defaultObject){if(obj[k]===undefined)obj[k]=defaultObject[k]}return obj}function insertAfter(refNode,nodeToInsert){var sibling=refNode.nextSibling;if(sibling){var _parent=refNode.parentNode;_parent.insertBefore(nodeToInsert,sibling)}else{parent.appendChild(nodeToInsert)}}function insertBefore(refNode,nodeToInsert){var parent=refNode.parentNode;parent.insertBefore(nodeToInsert,refNode)}function forEach(items,fn){if(!items)return;if(items.forEach){items.forEach(fn)}else{for(var i=0;i<items.length;i++){fn(items[i],i,items)}}}function debounce(ms,fn){var timeout=void 0;var debouncedFn=function debouncedFn(){clearTimeout(timeout);timeout=setTimeout(fn,ms)};return debouncedFn}},{}],3:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.toggleInvalidClass=toggleInvalidClass;exports.handleCustomMessages=handleCustomMessages;exports.handleCustomMessageDisplay=handleCustomMessageDisplay;exports.default=validForm;var _util=require("./util");function toggleInvalidClass(input,invalidClass){input.addEventListener("invalid",function(){input.classList.add(invalidClass)});input.addEventListener("input",function(){if(input.validity.valid){input.classList.remove(invalidClass)}})}var errorProps=["badInput","patternMismatch","rangeOverflow","rangeUnderflow","stepMismatch","tooLong","tooShort","typeMismatch","valueMissing","customError"];function getCustomMessage(input,customMessages){customMessages=customMessages||{};var localErrorProps=[input.type+"Mismatch"].concat(errorProps);var validity=input.validity;for(var i=0;i<localErrorProps.length;i++){var prop=localErrorProps[i];if(validity[prop]){return input.getAttribute("data-"+prop)||customMessages[prop]}}}function handleCustomMessages(input,customMessages){function checkValidity(){var message=input.validity.valid?null:getCustomMessage(input,customMessages);input.setCustomValidity(message||"")}input.addEventListener("input",checkValidity);input.addEventListener("invalid",checkValidity)}function handleCustomMessageDisplay(input,options){var validationErrorClass=options.validationErrorClass,validationErrorParentClass=options.validationErrorParentClass,errorPlacement=options.errorPlacement;function checkValidity(options){var insertError=options.insertError;var parentNode=input.parentNode;var errorNode=parentNode.querySelector("."+validationErrorClass)||document.createElement("label");if(!input.validity.valid&&input.validationMessage){errorNode.className=validationErrorClass;errorNode.textContent=input.validationMessage;if(insertError){errorPlacement==="before"?(0,_util.insertBefore)(input,errorNode):(0,_util.insertAfter)(input,errorNode);parentNode.classList.add(validationErrorParentClass)}}else{parentNode.classList.remove(validationErrorParentClass);errorNode.remove()}}input.addEventListener("input",function(){checkValidity({insertError:false})});input.addEventListener("invalid",function(e){e.preventDefault();checkValidity({insertError:true})})}var defaultOptions={invalidClass:"invalid",validationErrorClass:"validation-error",validationErrorParentClass:"has-validation-error",customMessages:{},errorPlacement:"before"};function validForm(element,options){if(!element||!element.nodeName){throw new Error("First arg to validForm must be a form, input, select, or textarea")}var inputs=void 0;var type=element.nodeName.toLowerCase();options=(0,_util.defaults)(options,defaultOptions);if(type==="form"){inputs=element.querySelectorAll("input, select, textarea");focusInvalidInput(element,inputs)}else if(type==="input"||type==="select"||type==="textarea"){inputs=[element]}else{throw new Error("Only form, input, select, or textarea elements are supported")}validFormInputs(inputs,options)}function focusInvalidInput(form,inputs){var focusFirst=(0,_util.debounce)(100,function(){var invalidNode=form.querySelector(":invalid");if(invalidNode)invalidNode.focus()});(0,_util.forEach)(inputs,function(input){return input.addEventListener("invalid",focusFirst)})}function validFormInputs(inputs,options){var invalidClass=options.invalidClass,customMessages=options.customMessages;(0,_util.forEach)(inputs,function(input){toggleInvalidClass(input,invalidClass);handleCustomMessages(input,customMessages);handleCustomMessageDisplay(input,options)})}},{"./util":2}]},{},[1]);

theme.Collection = (function() {
  function Collection(container) {
    var sectionId = container.getAttribute('data-section-id');
    var Carousel = document.getElementById('glider-carousel-' + sectionId);
    var l = container.getAttribute('data-layout');
    var aB = document.getElementById('ajaxBusy');
    var ajaxLoadPage = function (url) {
      aB.style.display = 'block';
      fetch(url)
      .then(response => response.text())
      .then(data => {        
        var c = document.getElementById('collection');
        var p = document.getElementById('paginateBy');
        var bD = document.querySelector('.desktop-breadcrumbs');
        var bM = document.querySelector('.mobile-breadcrumbs');
        var f = document.getElementById('filters');
        var o = document.getElementById('collection-' + sectionId + '-filters');
        o.style.height = '';
        const parser = new DOMParser();
        const htmlDocument = parser.parseFromString(data, 'text/html');
        var nC = htmlDocument.documentElement.querySelector('#collection');
        var nP = htmlDocument.documentElement.querySelector('#paginateBy');
        var nBD = htmlDocument.documentElement.querySelector('.desktop-breadcrumbs');
        var nBM = htmlDocument.documentElement.querySelector('.mobile-breadcrumbs');
        var nF = htmlDocument.documentElement.querySelector('#filters');
        if (c) {
          c.replaceWith(nC);
        }
        if (p) {
          p.replaceWith(nP);
        }
        if (bD) {
          bD.replaceWith(nBD);
        }
        if (bM) {
          bM.replaceWith(nBM);
        }
        if (f) {
          f.replaceWith(nF);
        }
        var s = nC.getBoundingClientRect().top + window.pageYOffset;
        if (theme.settings.quickView) {
          theme.quick();
        }
        theme.wrap_options();
        filter.length();
        filters.action();
        if (l == 'form') {
          check.cart();
          theme.qtyinput_quantity(container);
          cart.buttons();
        }
        theme.swatches(container);
        theme.open_slide(container);
        if (theme.settings.cart) {
          theme.ajax_cart(container);
        }
        history.replaceState({
          page: url
        }, url, url);
        var rA = document.querySelectorAll('#responsiveMenu a');        
        rA.forEach(function(r) {
          if (window.location.href.indexOf(r.href) > -1) {
            r.classList.add('active');
            r.setAttribute('aria-current','page');
          } else {
            r.classList.remove('active');
            r.removeAttribute('aria-current');
          }
        });
        o.style.height = o.clientHeight + 'px';
        window.scrollTo({top:s-document.selectors.sht, behavior: 'smooth'});
        aB.style.display = 'none';
      }).catch(function (err) {
        console.log('!: ' + err);
      });      
    };
    var filters = {
      action:function (e) {
        var pA = container.querySelectorAll('.paginateBy');
        pA.forEach(function(p) {
          p.onclick = function(){
            this.queryParams = {};
            this.queryParams.view = p.text;
            const searchParams = new URLSearchParams();
            const params = this.queryParams;
            Object.keys(params).forEach(key => searchParams.append(key, params[key]));
            var url = '?' + searchParams.toString();
            ajaxLoadPage(url);
          }
        });        
        var fA = container.querySelectorAll('li.advanced-filter a');
        fA.forEach(function(f) {
          f.onclick = function(ev){                        
            ev.preventDefault();
            var url = f.getAttribute('href');
            ajaxLoadPage(url);
          }
          f.onmouseenter = function(){
            f.classList.add('hover');
          };
          f.onmouseleave = function(){
            f.classList.remove('hover');
          };
        });
        var fS = container.querySelectorAll('.tag-filters select');
        fS.forEach(function(f) {
          f.onchange = function(ev){
            ev.preventDefault();
            var url = f.value;
            ajaxLoadPage(url);
          };
        });
        var dS = container.querySelectorAll('.dropdown select');
        dS.forEach(function(d) {
          d.onchange = function(){
            if (d.value) {
              location.href = d.value;
            }
            else {
              location.href = theme.routes_all_products_collection_url;
            }
          };
        });
        var sS = container.querySelectorAll('select.sortBy');
        sS.forEach(function(s) {
          s.onchange = function(){
            this.queryParams = {};
            this.queryParams.sort_by = s.value;
            const searchParams = new URLSearchParams();
            const params = this.queryParams;
            Object.keys(params).forEach(key => searchParams.append(key, params[key]));
            var url = '?' + searchParams.toString();
            ajaxLoadPage(url);
          }
        });
      }
    };
    var filter = {
      length:function (e) {
        var el = document.querySelectorAll('.filter ul .open-more');
        el.forEach(function(e) {
          e.onclick = function(ev){
            var oc = this.closest('ul');
            var os = oc.querySelectorAll('li.toggleable'); 
            var ocf = this.closest('.open-container-filter');
            var osf = ocf.querySelector('.open-slide-filter');
            var id = document.getElementById('collection-collection-template-filters');
            if(!e.classList.contains('less')) {
              e.textContent=theme.language.collections_sidebar_less
              e.classList.add('less');
              os.forEach(function(o) {
                o.classList.add('open');
                o.style.height = 'auto';
                var oht = o.clientHeight;
                var ohtpx = oht + 'px';
                o.style.height = '0px';
                setTimeout(function () {
                  o.style.height = ohtpx;
                }, 0);
              })
              if(id && id.clientHeight > 1) {
                osf.addEventListener('transitionend', function () {
                  var idht = id.clientHeight;
                  var osfht = osf.clientHeight;
                  var height = Array.from(os).map(x => x.clientHeight).reduce((a, b) => a + b, 0);
                  var idhtpx = idht + height + 'px';
                  var osfhtpx = osfht + height + 'px';
                  id.style.height = idhtpx;
                  osf.style.height = osfhtpx;
                }, {
                  once: true
                });
              }
            } else {
              e.textContent = theme.language.collections_sidebar_more
              e.classList.remove('less');
              os.forEach(function(o) {
                o.style.height = '0px';
                o.addEventListener('transitionend', function () {
                  o.classList.remove('open');
                }, {once: true})
                if(id && id.clientHeight > 1) {
                  var idht = id.clientHeight;
                  var osfht = osf.clientHeight;
                  var height = Array.from(os).map(x => x.clientHeight).reduce((a, b) => a + b, 0);
                  var idhtpx = idht - height + 'px';
                  var osfhtpx = osfht - height + 'px';
                  id.style.height = idhtpx;
                  osf.style.height = osfhtpx;
                }
              });
            }
            ev.preventDefault();
          };
        });
      }
    };
    if (l == 'form') {
      var check = {
        cart:function (e) {
          fetch(theme.routes_cart_url + '.js')
          .then(function(r) {
            return r.json();
          }).then(function(j) {
            var its = j.items;
            for (i = 0, len = its.length; i < len; i++) {
              let it = its[i],
                  iq = it.quantity,
                  id = it.id,
                  ti = document.getElementById('updates_' + id) || null;
              var er = document.getElementById('error_' + id);
              if (ti) {
                ti.value = iq;
                er.style.display = 'block';
                er.textContent = theme.language.collections_general_update_cart_label_message;
                document.getElementById('variant_' + id).classList.add('item-in-cart');
              }
            }
          });
        }
      }; 
      function cart_change() {
        var it = this.closest('.item');
        var id = it.getAttribute('data-product-id');
        var q =  it.querySelector('.item-qty').value;
        var iQ = it.querySelector('.item-qty');
        var iB = it.querySelectorAll('.qtybtn');
        var s = it.querySelector('.error');
        if (it.classList.contains('item-in-cart')) {
          var u = theme.routes_cart_change_url;
        } else {
          var u = theme.routes_cart_add_url;
        }
        fetch(u + '.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({'quantity': q,'id':id})
        }).then(function(r) {
          return r.json();
        }).then(function(j) {
          iB.forEach(function(i) {
            i.setAttribute('disabled', true)
          });
          if (j.status == 'bad_request') {
            console.log('Request returned an error', j) 
          } else {            
            theme.ajax_cart_dropdown();
            var v = iQ.value;
            var x = iQ.getAttribute('max');
            if (v < x && v > 0 ) {
            } else if (v == 0) {
              s.style.display = 'none';
              s.html = '';
            }
            if (q > 0) {
              it.classList.add('item-in-cart');
            } else {
              it.classList.remove('item-in-cart');
            }
            iB.forEach(function(i) {
              i.removeAttribute('disabled');
            });
          }
        }).catch(function(err) {
          console.error('!: ' + err)
        });
      }
      var cart = {
        buttons:function (e) {
          var qB = container.querySelectorAll('.qtybtn');
          qB.forEach(function(q) {
            setTimeout(function () {
              q.onclick = cart_change;
            }, 1);
          })
          var qI = container.querySelectorAll('.item-qty');
          qI.forEach(function(q) {
            setTimeout(function () {
              q.addEventListener('input',cart_change);
            }, 1);
          })
        }
      };
      cart.buttons();
    }
    filter.length();
    filters.action();
    if (l == 'form') {
      check.cart();
      theme.qtyinput_quantity(container);
    }
    if (Carousel) {
      theme.slider(container);
    }
    theme.swatches(container);
    theme.open_slide(container);
    if (theme.settings.cart) {
      theme.ajax_cart(container);
    }
    var popped = ('state' in window.history && window.history.state !== null);
    var initialURL = location.href;
    window.onpopstate = function (e) {
      var initialPop = !popped && location.href == initialURL;
      popped = true;
      if (initialPop) {
        return;
      }
    };
    Shopify.queryParams = {};
    if (location.search.length) {
      for (var aKeyValue, i = 0, aCouples = location.search.substr(1).split('&'); i < aCouples.length; i++) {
        aKeyValue = aCouples[i].split('=');
        if (aKeyValue.length > 1) {
          Shopify.queryParams[decodeURIComponent(aKeyValue[0])] = decodeURIComponent(aKeyValue[1]);
        }
      }
    }
    Collection.prototype.onSelect = function(ev) {
      if (theme.settings.quickView) {
        theme.quick();
      }
      theme.wrap_options();
    }
  }
  return Collection;
})();
theme.product_options_js = function (container) {
  var sectionId = container.getAttribute('data-section-id');
  var sectionType = container.getAttribute('data-section-type');
  var selectors = document.querySelectorAll('form.product-form-' + sectionId + ' .selector');
  var pJ = JSON.parse(document.getElementById('ProductJson-' + sectionId).innerHTML);
  var pS = 'product-select-' + sectionId;  
  var srfc = container.getAttribute('data-surface');
  var zm = container.getAttribute('data-zoom');  
  var mzm = container.getAttribute('data-mobile-zoom');  
  if(sectionType != 'quick-view' && srfc == 'true'){
    theme.StoreAvailabilityLoad(container);
  };
  var Shopify = Shopify || {};
  Shopify.arrayIncludes = function(e, t) {
    for (var n = 0; n < e.length; n++)
      if (e[n] == t) return !0;
    return !1
  }, Shopify.uniq = function(e) {
    for (var t = [], n = 0; n < e.length; n++) Shopify.arrayIncludes(t, e[n]) || t.push(e[n]);
    return t
  }
  Shopify.optionsMap = {};
  var selectors = {
    sos0: '#product-select-' + sectionId + '-option-0',
    sos1: '#product-select-' + sectionId + '-option-1',
    sos2: '#product-select-' + sectionId + '-option-2'
  };
  Shopify.updateOptionsInSelector = function(selectorIndex) {
    switch (selectorIndex) {
      case 0:
        var key = 'root';
        var selector = document.querySelector(selectors.sos0);
        break;
      case 1:
        var key = document.querySelector(selectors.sos0).value;
        var selector = document.querySelector(selectors.sos1);
        break;
      case 2:
        var key = document.querySelector(selectors.sos0).value;  
        key += ' / ' + document.querySelector(selectors.sos1).value;
        var selector = document.querySelector(selectors.sos2);
    }
    var initialValue = selector.value;
    selector.innerHTML = '';
    var availableOptions = Shopify.optionsMap[key];      
    for (var i=0; i<availableOptions.length; i++) {
      var option = availableOptions[i];
      var newOption = document.createElement('option');
      newOption.value = option;
      newOption.text  = option;
      selector.appendChild(newOption);
    }
    var swatchElements = document.querySelectorAll('#product-id-' + sectionId + ' form[action="/cart/add"] .swatch[data-option-index="' + selectorIndex + '"] .swatch-element');
    swatchElements.forEach(function(swatchElement) {        
      var itemradio = swatchElement.querySelector('input');
      itemradio.checked = false;
      if (availableOptions.indexOf(swatchElement.getAttribute('data-value'), availableOptions) !== -1) {
        swatchElement.style.display = '';
        itemradio.disabled = false;
      } else {
        swatchElement.style.display = 'none';
        itemradio.disabled = true;
      }
    }); 
    if (availableOptions.indexOf(initialValue, availableOptions) !== -1) {
      selector.value = initialValue;
    }
    selector.dispatchEvent(new Event('change')); 
  };
  Shopify.linkOptionSelectors = function(product) {
    for (var i=0; i<product.variants.length; i++) {
      var variant = product.variants[i];
      if (variant) {
        Shopify.optionsMap['root'] = Shopify.optionsMap['root'] || [];
        Shopify.optionsMap['root'].push(variant.option1);
        Shopify.optionsMap['root'] = Shopify.uniq(Shopify.optionsMap['root']);
        if (product.options.length > 1) {
          var key = variant.option1;
          Shopify.optionsMap[key] = Shopify.optionsMap[key] || [];
          Shopify.optionsMap[key].push(variant.option2);
          Shopify.optionsMap[key] = Shopify.uniq(Shopify.optionsMap[key]);
        }
        if (product.options.length === 3) {
          var key = variant.option1 + ' / ' + variant.option2;
          Shopify.optionsMap[key] = Shopify.optionsMap[key] || [];
          Shopify.optionsMap[key].push(variant.option3);
          Shopify.optionsMap[key] = Shopify.uniq(Shopify.optionsMap[key]);
        }
      }
    }
    Shopify.updateOptionsInSelector(0);
    if (product.options.length > 1) Shopify.updateOptionsInSelector(1);
    if (product.options.length === 3) Shopify.updateOptionsInSelector(2);
    document.querySelector(selectors.sos0).addEventListener('change', function(){
      Shopify.updateOptionsInSelector(1);
      if (product.options.length === 3) Shopify.updateOptionsInSelector(2);
      return true;
    });
    document.querySelector(selectors.sos1).addEventListener('change', function(){
      if (product.options.length === 3) Shopify.updateOptionsInSelector(2);
      return true;
    });
  };
  if (pJ.available && pJ.options.length > 1) {
    var addToCartForm = document.querySelector('#product-id-' + sectionId + ' form[data-product-form]');
    if (window.MutationObserver && addToCartForm.length) {
      if (typeof observer === 'object' && typeof observer.disconnect === 'function') {
        observer.disconnect();
      }
      var config = {childList: true, subtree: true};
      var observer = new MutationObserver(function() {
        Shopify.linkOptionSelectors(JSON.parse(document.getElementById('ProductJson-' + sectionId).innerHTML));
        observer.disconnect();
      });  
      observer.observe(addToCartForm, config);
    }
  }    
  if (pJ.variants.length > 1) {
    var variantImages = {};
    var thumbnails;
    var variant;
    var variantImage;
    var opt_key;
    var opt_val;
    var loop_index;      
    var vars = pJ.variants;
    var opts = pJ.options;
    vars.forEach(function(v) {
      variant = v;
      if ( typeof variant.featured_image !== 'undefined' && variant.featured_image !== null ) {
        variantImage =  variant.featured_image.src.split('?')[0].replace(/http(s)?:/,'');
        variantImages[variantImage] = variantImages[variantImage] || {};
        var opts = v.options
        opts.forEach(function(o,i) {
          opt_key = 'option-'+i;
          opt_val = o;
          if (typeof variantImages[variantImage][opt_key] === 'undefined') {
            variantImages[variantImage][opt_key] = opt_val;
          }
          else {
            var oldValue = variantImages[variantImage][opt_key];
            if ( oldValue !== null && oldValue !== opt_val )  {
              variantImages[variantImage][opt_key] = null;
            }
          }
        });
      }
    });
    var thumbnails = document.querySelectorAll('#product-id-' + sectionId + ' .thumbs a');
    if (!thumbnails) return false;
    thumbnails.forEach(function(thumbnail) {
      thumbnail.addEventListener('click', function(ev){
        var thumb = this.querySelector('img[data-source].list');
        var image = thumb.getAttribute('data-source').split('?')[0].replace(/(_1x)/,'');
        if (typeof variantImages[image] !== 'undefined') {
          opts.forEach(function(o,i) {
            var swatches = document.querySelectorAll('#product-id-' + sectionId + ' .swatch-element');
            swatches.forEach(function(swatch) {
              swatch.classList.remove('var_hover');
            });
            loop_index = 'option-' + i;
            if (variantImages[image][loop_index] !== null) {
              var index = i
              var sos = document.querySelector('#product-select-' + sectionId + '-option-' + index);
              sos.value = variantImages[image][loop_index];
              sos.dispatchEvent(new Event('change'));
            }
          });
        }
        ev.preventDefault();
      }, false);
    });
  };
  setTimeout(function () {
    var pid = document.getElementById('product-id-' + sectionId);
    var sw = pid.querySelectorAll('.selector-wrapper');
    sw.forEach(function(s, i) {
      var c = document.getElementById(pS).getAttribute('data-cols');
      var vs = s.querySelector('select');
      var os = document.getElementById(pS).getAttribute('data-size');
      var oc = document.getElementById(pS).getAttribute('data-color');
      var ot = s.querySelector('label').textContent;
      var ol = vs.options.length;
      var oo = document.getElementById('product-select-' + sectionId).getAttribute('data-length');
      if (ol > oo) {
        if (os.length && ot.indexOf(os) > -1 || oc.length && ot.indexOf(oc) > -1) {
          s.classList.add('selectors');
          s.setAttribute('data-option-index', i);
          var wrapper = document.createElement('div');
          wrapper.className = 'hidden';
          s.parentNode.insertBefore(wrapper, s);
          wrapper.appendChild(s);
        } else {
          s.classList.add('selectors');
          s.style.display = 'block'; 
          s.setAttribute('data-option-index', i);
          var wrapper = document.createElement('div');
          wrapper.className = c;
          s.parentNode.insertBefore(wrapper, s);
          wrapper.appendChild(s);
        }
      }
    });
  }, 1);  
  container.addEventListener('input', function (e) {    
    if (!e.target.classList.contains('selector')) return;
    var optionIndex = e.target.closest('.selectors');
    if (optionIndex) {
      var optionIndexAttr = optionIndex.getAttribute('data-option-index');
      var optionValue = e.target.value;    
      var formSOS = document.getElementById('product-select-' + sectionId + '-option-' + optionIndexAttr);
      formSOS.value = optionValue;
      formSOS.dispatchEvent(new Event('change')); 
    }
    if(sectionType != 'quick-view' && srfc == 'true'){
      theme.StoreAvailabilityLoad(container);
    };    
  }, false);  
  var ti = container.querySelectorAll('.thumb-image-' + sectionId);
  ti.forEach(function(t) {
    t.addEventListener('click', function(ev) {
      var img = t.querySelector('img');
      var id = img.getAttribute('data-id');
      var a = t.querySelector('a.img-align');
      var vi = '.variant-image-' + sectionId;      
      var ot = container.querySelectorAll(vi);
      var nt = document.getElementById('variant-image-' + id);
      var pi = document.getElementById('product-id-' + sectionId);
      Array.prototype.filter.call(t.parentNode.children, function(c){
        c.querySelector('a').setAttribute('aria-current', false);
      });
      a.setAttribute('aria-current', true);
      var cm = document.querySelector(vi + '.visible');
      cm.dispatchEvent(new CustomEvent('mediaHidden'));
      nt.dispatchEvent(new CustomEvent('mediaVisible'));
      ot.forEach(function(o) {
        o.classList.add('hidden')
        o.classList.remove('visible')
        o.blur()
      });
      nt.classList.add('visible')
      nt.classList.remove('hidden')
      nt.focus();
      var el = pi.querySelectorAll('.selector-wrapper');
      el.forEach(function(e) {
        e.classList.add('active');
      });
      ev.preventDefault();
    }, false);
  });  
  var Carousel = document.getElementById('thumbnails-'+ sectionId);  
  if (Carousel) {
    var next = document.getElementById('glider-button-next-thumbs-' + sectionId);
    var prev = document.getElementById('glider-button-prev-thumbs-' + sectionId);
    var glider = new Glider(Carousel, {
      arrows: {
        prev: prev,
        next: next
      },
      draggable: true,
      dragVelocity:2.5,
      resizeLock: false,
      skipTrack: true, 
      slidesToShow: 4,
      slidesToScroll: 4
    });
    if (glider) {
      Carousel.classList.add('loaded');
    }
  };  
  if((mzm == 'false') && (theme.mobile == true)){
    theme.mobilezoom = false;
  } else {
    theme.mobilezoom = true;
  }  
  if((zm == 'true') && (theme.mobilezoom == true)){
    const el = document.querySelectorAll('#main-product-image-' + sectionId + ' .drift img');
    el.forEach(function(e) {
      new Drift(e, {
        paneContainer: e.closest('.drift'),
        inlinePane: 1
      });
    });
  }  
};
theme.product_selectCallback = function (container) {
  var sectionId = container.getAttribute('data-section-id');
  var fI = container.getAttribute('data-image');
  var pJ = JSON.parse(document.getElementById('ProductJson-' + sectionId).innerHTML);  
  var pS = 'product-select-' + sectionId;
  var pP = document.getElementById('price-' + sectionId);
  var pSs = document.getElementById('savings-' + sectionId);
  var pC = document.getElementById('compare-' + sectionId);
  var pA = document.getElementById('add-to-cart-' + sectionId);
  var pSk = document.getElementById('error_' + sectionId);
  var pQ = document.getElementById('updates_' + sectionId);
  var pI = document.getElementById('inventory-' + sectionId);
  if (pI) {
    var pIC = parseInt(document.getElementById('inventory-' + sectionId).getAttribute('data-inv'));
  }
  var pSKU = document.getElementById('sku-' + sectionId);
  var pO = document.getElementById('offer-' + sectionId);
  var pL = document.getElementById('product-logistics-' + sectionId);  
  if (pL) {
    var pSr = pL.querySelector('.separator');
    var pV = pL.querySelector('.vendor');
  }  
  var selectCallback = function(variant, selector) {    
    var pID = document.getElementById('product-select-' + sectionId);  
    var pIA = parseInt(pID.options[pID.selectedIndex].getAttribute('data-inv'));  
    var pII = pID.options[pID.selectedIndex].getAttribute('data-inc');  
    var pIID = pID.options[pID.selectedIndex].getAttribute('data-inc_date');    
    var free = theme.language.products_product_free;
    if(variant){
      var cap = Shopify.formatMoney(variant.compare_at_price,theme.moneyFormat);
      var dif = Shopify.formatMoney(variant.compare_at_price - variant.price,theme.moneyFormat).replace(/((\,00)|(\.00))$/g, '');
      var price = Shopify.formatMoney(variant.price,theme.moneyFormat);
    }
    if (variant && variant.available == true) {
      if(variant.compare_at_price > variant.price){
        if(variant.price == '0') {
          pP.innerHTML = free + ' <del>' + cap + '</del>';
          pC.innerHTML = dif;
          pSs.classList.remove('hidden');
        } else {
          pP.innerHTML = price + ' <del>' + cap + '</del>';
          pC.innerHTML = dif;
          pSs.classList.remove('hidden');
        }                                          
      } else if(variant.price == '0') {
        pP.innerHTML = free;
        pSs.classList.add('hidden');
      } else {
        pP.innerHTML = price;
        pSs.classList.add('hidden');
      }
      pA.value = theme.language.products_product_add_to_cart;
      pA.classList.remove('disabled','outline');
      pA.removeAttribute('disabled')
      if (pSk) {
        pSk.style.display = 'none';
      }
      if (pQ) {
        pQ.value = 1;
      }
    } else if (variant && variant.available == false) {
      if(variant.compare_at_price > variant.price){
        if(variant.price == '0') {
          pP.innerHTML = free + ' <del>' + cap + '</del>';
          pC.innerHTML = dif;
          pSs.classList.remove('hidden');
        } else {
          pP.innerHTML = price + ' <del>' + cap + '</del>';
          pC.innerHTML = dif;
          pSs.classList.remove('hidden');
        }                                          
      } else if(variant.price == '0') {
        pP.innerHTML = free;
        pC.innerHTML = dif;
        pSs.classList.add('hidden');
      } else {
        pP.innerHTML = price;
        pSs.classList.add('hidden');
      }      
      pA.value = theme.language.products_product_sold_out;
      pA.classList.add('disabled','outline');
      pA.setAttribute('disabled', true)
      if (pSk) {
        pSk.style.display = 'none';
      }
      if (pQ) {
        pQ.value = 0;
      }
    }  else {
      pA.value = theme.language.products_product_disabled_add_to_cart;
      pA.classList.add('disabled','outline');
      pA.setAttribute('disabled', true)
      if (pI) {
        pI.textContent = '';
      }
      pP.textContent = '';
      if (pSKU) {
        pSKU.textContent = '';
      }
      if (pSr) {
        pSr.classList.add('hidden');
      }
      if (pSs) {
        pSs.classList.add('hidden');
      }
      if (pSk) {
        pSk.style.display = 'none';
      }
      if (pQ) {
        pQ.value = 1;
      }
    }
    if (variant) {
      var form = document.getElementById('add-item-form-' + sectionId);
      var lP = form.querySelectorAll('.swatch-element');
      form.classList.remove('var_load');
      lP.forEach(function(l) {
        l.classList.remove('active','soldout');
      });
      for (var i=0,length=variant.options.length; i<length; i++) {
        var swatch = form.querySelector('.swatch[data-option-index="' + i + '"]');
        if (swatch) {
          var opt = variant.options[i].replace(/["\\]/g, '\\$&');
          var labelButton = swatch.querySelector('.swatch-element[data-value="' + opt +'"]');
          var radioButton = swatch.querySelector('input[value="' + opt +'"]');
          if (radioButton) {
            swatch.parentElement.classList.remove('hidden');
            labelButton.classList.add('active');
          }
          if (variant.available == true) {
            labelButton.classList.remove('soldout');
          } else {
            labelButton.classList.add('soldout');
          }
        }
      }      
      if (variant.sku) {
        if (pSKU) {
          pSKU.textContent = theme.language.products_product_sku + variant.sku;
          if (pSr) {
            pSr.classList.remove('hidden');
          }
        }
      } else {
        if (pSKU) {
          pSKU.textContent = '';
          if (pSr) {
            pSr.classList.add('hidden');
          }
        }
      }
      if (variant.inventory_management) {
        if (pIA > 0 && pIA < pIC) {
          if (pI) {
            if(pII == 'true') {
              pI.innerHTML = '<h4>' + theme.language.products_general_inv_msg_1 + '&nbsp;' + pIA + '&nbsp;' + theme.language.products_general_inv_msg_2 + '<br/><span class="error-text"><small><span class="icon icon-bell"></span> ' + pIID + '</small</span></h4>';
            } else {
              pI.innerHTML = '<h4>' + theme.language.products_general_inv_msg_1 + '&nbsp;' + pIA + '&nbsp;' + theme.language.products_general_inv_msg_2 + '</h4>';
            }
          }
          if (pQ) {
            pQ.setAttribute('min', 1);
          }
        } else if (pIA > pIC) {
          if (pI) {
            pI.innerHTML = '<h4>' + theme.language.products_product_available + '</h4>';
          }
          if (pQ) {
            pQ.setAttribute('min', 1);
          }
        } else if (pIA < 1) {
          if (variant.available) {
            if (pI) {
              pI.innerHTML = '<h4>' + theme.language.products_product_available + '</h4>';
            }
            if (pQ) {
              pQ.setAttribute('min', 1);
            }
          } else {
            if (pI) {
              if(pII == 'true') {
                pI.innerHTML = '<h4>' + theme.language.products_product_sold_out + '<br/><span class="error-text"><small><span class="icon icon-bell"></span> ' + pIID + '</small></span></h4>';
              } else {
                pI.innerHTML = '<h4>' + theme.language.products_product_sold_out + '</h4>'
              }
            }
            if (pQ) {
              pQ.setAttribute('min', 0);
            }
          }
        } else {
          if (pI) {
            pI.innerHTML = '<h4>' + theme.language.products_product_available + '</h4>';
          }
          if (pQ) {
            pQ.setAttribute('min', 1);
          }
        }
        if (pIA != null) {
          if (pQ) {
            pQ.setAttribute('max', pIA);
          }
        } else {
          if (pQ) {
            pQ.removeAttribute('max')
          }
        };
      } else {
        if (pI) {
          pI.innerHTML = '<h4>' + theme.language.products_product_available + '</h4>';
        }
        if (pQ) {
          pQ.removeAttribute('max')
          pQ.setAttribute('min', 1);
        }
      }
      if (variant.unit_price_measurement) {
        if (variant.unit_price_measurement.reference_value != 1) {
          pO.innerHTML = '<h4>' + Shopify.formatMoney(variant.unit_price,theme.moneyFormat) + theme.language.products_general_per + variant.unit_price_measurement.reference_value + variant.unit_price_measurement.reference_unit + '</h4>';
          pO.classList.remove('hidden');
        } else {
          pO.innerHTML = '<h4>' + Shopify.formatMoney(variant.unit_price,theme.moneyFormat) + theme.language.products_general_per + variant.unit_price_measurement.reference_unit + '</h4>';
          pO.classList.remove('hidden');
        }
      } else {
        if (pO) {
          pO.textContent = '';
          pO.classList.add('hidden');
        }
      }
      if (variant && variant.featured_media) {
        var nI = variant.featured_media;
        var vi = '.variant-image-' + sectionId;
        var oIe = container.querySelectorAll(vi);
        var nIe = container.querySelector('.variant-image-' + sectionId + '[data-image-id="' + nI.id + '"]');
        var cm = document.querySelector(vi + '.visible');
        cm.dispatchEvent(new CustomEvent('mediaHidden'));
        nIe.dispatchEvent(new CustomEvent('mediaVisible'));
        oIe.forEach(function(o) {
          o.classList.add('hidden'); 
          o.classList.remove('visible')
          o.blur()
        });
        nIe.classList.add('visible')
        nIe.classList.remove('hidden')
      }
    } else {
      if (pSKU) {
        pSKU.textContent = '';
      }
      if (pI) {
        pI.textContent = '';
      }
      if (pO) {
        pO.textContent = '';
      }
    }
  };
  new Shopify.OptionSelectors(pS, {
    product: pJ, 
    onVariantSelected: selectCallback, 
    enableHistoryState: true
  });
  // Based on https://community.shopify.com/c/Shopify-Discussion/How-to-get-recent-viewed-products-in-Shopify-Store-in-any-theme/td-p/887103
  function RecV() {
    const pA = [];
    let jR,
        jRA,
        jRAS;
    const nP = 5;
    if (pV) {
      var v = pV.querySelector('a').getAttribute('href');
    } else {
      var v = window.location.pathname;
    }
    const pD = {
      pFI: pJ.featured_image,
      pT: pJ.title,
      pI: fI,
      pP: pJ.price,
      pPC: pJ.compare_at_price,
      pPMx: pJ.price_max,
      pPMn: pJ.price_min,
      pPV: pJ.price_varies,
      pU: window.location.pathname,
      pV: pJ.vendor,
      pVU: v
    } 
    pA.push(pD);
    const cpT = pD.pT; 
    const pDS = JSON.stringify(pA);
    const lD = localStorage.getItem('rVP');
    if(lD == null) { 
      localStorage.setItem('rVP', pDS);
    } 
    else if (lD != null ) {
      const opD = localStorage.getItem('rVP');
      const cpD = (opD.match(/pT/g) || []).length;
      const rP =  opD.includes(cpT);
      if (cpD < nP && rP == false) {
        jR = JSON.parse(opD);
        jRA = jR.concat(pA);
        jRAS = JSON.stringify(jRA);
        localStorage.setItem('rVP', jRAS);
      }
      else if (cpD >= nP && rP == false) {
        jR = JSON.parse(opD);
        jR.shift();
        jRA = jR.concat(pA);
        jRA =  JSON.stringify(jRA);
        localStorage.setItem('rVP', jRA);
      }
    }
  }
  RecV();
};
theme.Product = (function() {
  function Product(container) {
    var sectionId = container.getAttribute('data-section-id');
    var productId = container.getAttribute('data-product-id');
    var Carousel = document.getElementById('glider-carousel-' + sectionId);
    var c = container.getAttribute('data-cart');
    theme.product_options_js(container);
    theme.product_selectCallback(container);
    theme.swatches(container);
    theme.product_media(container);
    theme.qtyinput_quantity(container);
    if(c == 'true'){
      theme.ajax_cart(container);
    }
    theme.tabs(container);    
    Product.prototype.onBlockSelect = function(ev) {
      var tI = container.querySelectorAll('.title');
      var tB = container.querySelectorAll('.tab-body');
      var tT = ev.target;
      var tH = container.querySelector(ev.target.getAttribute('href'));
      var mSI = ev.target.getAttribute('data-gslide');
      if (tI) {
        tI.forEach(function(t) {
          t.classList.remove('first');
          t.setAttribute('tabindex','-1');
        });
        tB.forEach(function(t) {
          t.classList.add('hide');
          t.setAttribute('aria-hidden','true');
          t.querySelector('.tabindex').setAttribute('tabindex','-1');
        });
      }
      tT.classList.add('first');
      tT.setAttribute('tabindex','0');
      tH.classList.remove('hide');
      tH.setAttribute('aria-hidden','false');
      tH.querySelector('.tabindex').setAttribute('tabindex','0');
      //mS.slideTo(mSI, 300);  
      Glider(Carousel).scrollItem(parseInt(mSI));  
    };
  }
  // option_selection.js
  !function(){"undefined"==typeof window.Shopify&&(window.Shopify={}),Shopify.each=function(t,e){for(var n=0;n<t.length;n++)e(t[n],n)},Shopify.map=function(t,e){for(var n=[],i=0;i<t.length;i++)n.push(e(t[i],i));return n},Shopify.arrayIncludes=function(t,e){for(var n=0;n<t.length;n++)if(t[n]==e)return!0;return!1},Shopify.uniq=function(t){for(var e=[],n=0;n<t.length;n++)Shopify.arrayIncludes(e,t[n])||e.push(t[n]);return e},Shopify.isDefined=function(t){return"undefined"!=typeof t},Shopify.getClass=function(t){return Object.prototype.toString.call(t).slice(8,-1)},Shopify.extend=function(t,e){function n(){}n.prototype=e.prototype,t.prototype=new n,t.prototype.constructor=t,t.baseConstructor=e,t.superClass=e.prototype},Shopify.locationSearch=function(){return window.location.search},Shopify.locationHash=function(){return window.location.hash},Shopify.replaceState=function(t){window.history.replaceState({},document.title,t)},Shopify.urlParam=function(t){var e=RegExp("[?&]"+t+"=([^&#]*)").exec(Shopify.locationSearch());return e&&decodeURIComponent(e[1].replace(/\+/g," "))},Shopify.newState=function(t,e){var n;return n=Shopify.urlParam(t)?Shopify.locationSearch().replace(RegExp("("+t+"=)[^&#]+"),"$1"+e):""===Shopify.locationSearch()?"?"+t+"="+e:Shopify.locationSearch()+"&"+t+"="+e,n+Shopify.locationHash()},Shopify.setParam=function(t,e){Shopify.replaceState(Shopify.newState(t,e))},Shopify.Product=function(t){Shopify.isDefined(t)&&this.update(t)},Shopify.Product.prototype.update=function(t){for(property in t)this[property]=t[property]},Shopify.Product.prototype.optionNames=function(){return"Array"==Shopify.getClass(this.options)?this.options:[]},Shopify.Product.prototype.optionValues=function(t){if(!Shopify.isDefined(this.variants))return null;var e=Shopify.map(this.variants,function(e){var n="option"+(t+1);return void 0==e[n]?null:e[n]});return null==e[0]?null:Shopify.uniq(e)},Shopify.Product.prototype.getVariant=function(t){var e=null;return t.length!=this.options.length?e:(Shopify.each(this.variants,function(n){for(var i=!0,r=0;r<t.length;r++){var o="option"+(r+1);n[o]!=t[r]&&(i=!1)}if(1==i)return void(e=n)}),e)},Shopify.Product.prototype.getVariantById=function(t){for(var e=0;e<this.variants.length;e++){var n=this.variants[e];if(t==n.id)return n}return null},Shopify.money_format="${{amount}}",Shopify.formatMoney=function(t,e){function n(t,e){return"undefined"==typeof t?e:t}function i(t,e,i,r){if(e=n(e,2),i=n(i,","),r=n(r,"."),isNaN(t)||null==t)return 0;t=(t/100).toFixed(e);var o=t.split("."),s=o[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g,"$1"+i),a=o[1]?r+o[1]:"";return s+a}"string"==typeof t&&(t=t.replace(".",""));var r="",o=/\{\{\s*(\w+)\s*\}\}/,s=e||this.money_format;switch(s.match(o)[1]){case"amount":r=i(t,2);break;case"amount_no_decimals":r=i(t,0);break;case"amount_with_comma_separator":r=i(t,2,".",",");break;case"amount_no_decimals_with_comma_separator":r=i(t,0,".",",");break;case"amount_no_decimals_with_space_separator":r=i(t,0," ");break;case"amount_with_apostrophe_separator":r=i(t,2,"'")}return s.replace(o,r)},Shopify.OptionSelectors=function(t,e){return this.selectorDivClass="selector-wrapper",this.selectorClass="single-option-selector",this.variantIdFieldIdSuffix="-variant-id",this.variantIdField=null,this.historyState=null,this.selectors=[],this.domIdPrefix=t,this.product=new Shopify.Product(e.product),this.onVariantSelected=Shopify.isDefined(e.onVariantSelected)?e.onVariantSelected:function(){},this.setActiveThumbnail=e.setActiveThumbnail,this.switchProductImage=e.switchProductImage,this.settings=e.settings,this.replaceSelector(t),this.initDropdown(),e.enableHistoryState&&(this.historyState=new Shopify.OptionSelectors.HistoryState(this)),!0},Shopify.OptionSelectors.prototype.initDropdown=function(){var t={initialLoad:!0},e=this.selectVariantFromDropdown(t);if(!e){var n=this;setTimeout(function(){n.selectVariantFromParams(t)||n.fireOnChangeForFirstDropdown.call(n,t)})}},Shopify.OptionSelectors.prototype.fireOnChangeForFirstDropdown=function(t){this.selectors[0].element.onchange(t)},Shopify.OptionSelectors.prototype.selectVariantFromParamsOrDropdown=function(t){var e=this.selectVariantFromParams(t);e||this.selectVariantFromDropdown(t)},Shopify.OptionSelectors.prototype.replaceSelector=function(t){var e=document.getElementById(t),n=e.parentNode;Shopify.each(this.buildSelectors(),function(t){n.insertBefore(t,e)}),e.style.display="none",this.variantIdField=e},Shopify.OptionSelectors.prototype.selectVariantFromDropdown=function(t){var e=document.getElementById(this.domIdPrefix).querySelector("[selected]");if(e||(e=document.getElementById(this.domIdPrefix).querySelector('[selected="selected"]')),!e)return!1;var n=e.value;return this.selectVariant(n,t)},Shopify.OptionSelectors.prototype.selectVariantFromParams=function(t){var e=Shopify.urlParam("variant");return this.selectVariant(e,t)},Shopify.OptionSelectors.prototype.selectVariant=function(t,e){var n=this.product.getVariantById(t);if(null==n)return!1;for(var i=0;i<this.selectors.length;i++){var r=this.selectors[i].element,o=r.getAttribute("data-option"),s=n[o];null!=s&&this.optionExistInSelect(r,s)&&(r.value=s)}return"undefined"!=typeof jQuery?jQuery(this.selectors[0].element).trigger("change",e):this.selectors[0].element.onchange(e),!0},Shopify.OptionSelectors.prototype.optionExistInSelect=function(t,e){for(var n=0;n<t.options.length;n++)if(t.options[n].value==e)return!0},Shopify.OptionSelectors.prototype.insertSelectors=function(t,e){Shopify.isDefined(e)&&this.setMessageElement(e),this.domIdPrefix="product-"+this.product.id+"-variant-selector";var n=document.getElementById(t);Shopify.each(this.buildSelectors(),function(t){n.appendChild(t)})},Shopify.OptionSelectors.prototype.buildSelectors=function(){for(var t=0;t<this.product.optionNames().length;t++){var e=new Shopify.SingleOptionSelector(this,t,this.product.optionNames()[t],this.product.optionValues(t));e.element.disabled=!1,this.selectors.push(e)}var n=this.selectorDivClass,i=this.product.optionNames(),r=Shopify.map(this.selectors,function(t){var e=document.createElement("div");if(e.setAttribute("class",n),i.length>=1){var r=document.createElement("label");r.htmlFor=t.element.id,r.innerHTML=t.name,e.appendChild(r)}return e.appendChild(t.element),e});return r},Shopify.OptionSelectors.prototype.selectedValues=function(){for(var t=[],e=0;e<this.selectors.length;e++){var n=this.selectors[e].element.value;t.push(n)}return t},Shopify.OptionSelectors.prototype.updateSelectors=function(t,e){var n=this.selectedValues(),i=this.product.getVariant(n);i?(this.variantIdField.disabled=!1,this.variantIdField.value=i.id):this.variantIdField.disabled=!0,this.onVariantSelected(i,this,e),null!=this.historyState&&this.historyState.onVariantChange(i,this,e)},Shopify.OptionSelectorsFromDOM=function(t,e){var n=e.optionNames||[],i=e.priceFieldExists||!0,r=e.delimiter||"/",o=this.createProductFromSelector(t,n,i,r);e.product=o,Shopify.OptionSelectorsFromDOM.baseConstructor.call(this,t,e)},Shopify.extend(Shopify.OptionSelectorsFromDOM,Shopify.OptionSelectors),Shopify.OptionSelectorsFromDOM.prototype.createProductFromSelector=function(t,e,n,i){if(!Shopify.isDefined(n))var n=!0;if(!Shopify.isDefined(i))var i="/";var r=document.getElementById(t),o=r.childNodes,s=(r.parentNode,e.length),a=[];Shopify.each(o,function(t,r){if(1==t.nodeType&&"option"==t.tagName.toLowerCase()){var o=t.innerHTML.split(new RegExp("\\s*\\"+i+"\\s*"));0==e.length&&(s=o.length-(n?1:0));var l=o.slice(0,s),c=n?o[s]:"",u=(t.getAttribute("value"),{available:!t.disabled,id:parseFloat(t.value),price:c,option1:l[0],option2:l[1],option3:l[2]});a.push(u)}});var l={variants:a};if(0==e.length){l.options=[];for(var c=0;c<s;c++)l.options[c]="option "+(c+1)}else l.options=e;return l},Shopify.SingleOptionSelector=function(t,e,n,i){this.multiSelector=t,this.values=i,this.index=e,this.name=n,this.element=document.createElement("select");for(var r=0;r<i.length;r++){var o=document.createElement("option");o.value=i[r],o.innerHTML=i[r],this.element.appendChild(o)}return this.element.setAttribute("class",this.multiSelector.selectorClass),this.element.setAttribute("data-option","option"+(e+1)),this.element.id=t.domIdPrefix+"-option-"+e,this.element.onchange=function(n,i){i=i||{},t.updateSelectors(e,i)},!0},Shopify.Image={preload:function(t,e){for(var n=0;n<t.length;n++){var i=t[n];this.loadImage(this.getSizedImageUrl(i,e))}},loadImage:function(t){(new Image).src=t},switchImage:function(t,e,n){if(t&&e){var i=this.imageSize(e.src),r=this.getSizedImageUrl(t.src,i);n?n(r,t,e):e.src=r}},imageSize:function(t){var e=t.match(/.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/);return null!==e?e[1]:null},getSizedImageUrl:function(t,e){if(null==e)return t;if("master"==e)return this.removeProtocol(t);var n=t.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);if(null!=n){var i=t.split(n[0]),r=n[0];return this.removeProtocol(i[0]+"_"+e+r)}return null},removeProtocol:function(t){return t.replace(/http(s)?:/,"")}},Shopify.OptionSelectors.HistoryState=function(t){this.browserSupports()&&this.register(t)},Shopify.OptionSelectors.HistoryState.prototype.register=function(t){window.addEventListener("popstate",function(e){t.selectVariantFromParamsOrDropdown({popStateCall:!0})})},Shopify.OptionSelectors.HistoryState.prototype.onVariantChange=function(t,e,n){this.browserSupports()&&(!t||n.initialLoad||n.popStateCall||Shopify.setParam("variant",t.id))},Shopify.OptionSelectors.HistoryState.prototype.browserSupports=function(){return window.history&&window.history.replaceState}}();
  // Drift 1.4.1 | https://github.com/imgix/drift | Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
  var u="undefined"!=typeof window&&window===this?this:"undefined"!=typeof global&&null!=global?global:this;function v(){v=function(){},u.Symbol||(u.Symbol=A)}var B=0;function A(t){return"jscomp_symbol_"+(t||"")+B++}!function(t){function i(n){if(e[n])return e[n].T;var s=e[n]={ja:n,fa:!1,T:{}};return t[n].call(s.T,s,s.T,i),s.fa=!0,s.T}var e={};i.u=t,i.h=e,i.c=function(t,e,n){i.g(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},i.r=function(t){v(),v(),"undefined"!=typeof Symbol&&Symbol.toStringTag&&(v(),Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})),Object.defineProperty(t,"__esModule",{value:!0})},i.m=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.ba)return t;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var s in t)i.c(n,s,function(i){return t[i]}.bind(null,s));return n},i.i=function(t){var e=t&&t.ba?function(){return t.default}:function(){return t};return i.c(e,"a",e),e},i.g=function(t,i){return Object.prototype.hasOwnProperty.call(t,i)},i.o="",i(i.v=0)}([function(t,i,e){function n(t,i){if(i=void 0===i?{}:i,this.h=t,this.g=this.g.bind(this),!a(this.h))throw new TypeError("`new Drift` requires a DOM element as its first argument.");t=i.namespace||null;var e=i.showWhitespaceAtEdges||!1,n=i.containInline||!1,s=i.inlineOffsetX||0,o=i.inlineOffsetY||0,h=i.inlineContainer||document.body,r=i.sourceAttribute||"data-zoom",d=i.zoomFactor||3,u=void 0===i.paneContainer?document.body:i.paneContainer,c=i.inlinePane||375,f=!("handleTouch"in i)||!!i.handleTouch,p=i.onShow||null,l=i.onHide||null,b=!("injectBaseStyles"in i)||!!i.injectBaseStyles,v=i.hoverDelay||0,m=i.touchDelay||0,y=i.hoverBoundingBox||!1,g=i.touchBoundingBox||!1;if(i=i.boundingBoxContainer||document.body,!0!==c&&!a(u))throw new TypeError("`paneContainer` must be a DOM element when `inlinePane !== true`");if(!a(h))throw new TypeError("`inlineContainer` must be a DOM element");this.a={j:t,P:e,I:n,K:s,L:o,w:h,R:r,f:d,ga:u,ea:c,C:f,O:p,N:l,da:b,F:v,A:m,D:y,G:g,H:i},this.a.da&&!document.querySelector(".drift-base-styles")&&((i=document.createElement("style")).type="text/css",i.classList.add("drift-base-styles"),i.appendChild(document.createTextNode(".drift-bounding-box,.drift-zoom-pane{position:absolute;pointer-events:none}@keyframes noop{0%{zoom:1}}@-webkit-keyframes noop{0%{zoom:1}}.drift-zoom-pane.drift-open{display:block}.drift-zoom-pane.drift-closing,.drift-zoom-pane.drift-opening{animation:noop 1ms;-webkit-animation:noop 1ms}.drift-zoom-pane{overflow:hidden;width:100%;height:100%;top:0;left:0}.drift-zoom-pane-loader{display:none}.drift-zoom-pane img{position:absolute;display:block;max-width:none;max-height:none}")),(t=document.head).insertBefore(i,t.firstChild)),this.v(),this.u()}function s(t){t=void 0===t?{}:t,this.h=this.h.bind(this),this.g=this.g.bind(this),this.m=this.m.bind(this),this.s=!1;var i=void 0===t.J?null:t.J,e=void 0===t.f?c():t.f,n=void 0===t.U?c():t.U,s=void 0===t.j?null:t.j,o=void 0===t.P?c():t.P,h=void 0===t.I?c():t.I;this.a={J:i,f:e,U:n,j:s,P:o,I:h,K:void 0===t.K?0:t.K,L:void 0===t.L?0:t.L,w:void 0===t.w?document.body:t.w},this.o=this.i("open"),this.Y=this.i("opening"),this.u=this.i("closing"),this.v=this.i("inline"),this.V=this.i("loading"),this.ha()}function o(t){t=void 0===t?{}:t,this.m=this.m.bind(this),this.B=this.B.bind(this),this.g=this.g.bind(this),this.c=this.c.bind(this);var i=t;t=void 0===i.b?c():i.b;var e=void 0===i.l?c():i.l,n=void 0===i.R?c():i.R,s=void 0===i.C?c():i.C,o=void 0===i.O?null:i.O,a=void 0===i.N?null:i.N,r=void 0===i.F?0:i.F,d=void 0===i.A?0:i.A,u=void 0===i.D?c():i.D,f=void 0===i.G?c():i.G,p=void 0===i.j?null:i.j,l=void 0===i.f?c():i.f;i=void 0===i.H?c():i.H,this.a={b:t,l:e,R:n,C:s,O:o,N:a,F:r,A:d,D:u,G:f,j:p,f:l,H:i},(this.a.D||this.a.G)&&(this.o=new h({j:this.a.j,f:this.a.f,S:this.a.H})),this.enabled=!0,this.M()}function h(t){this.s=!1;var i=void 0===t.j?null:t.j,e=void 0===t.f?c():t.f;t=void 0===t.S?c():t.S,this.a={j:i,f:e,S:t},this.c=this.g("open"),this.h()}function a(t){return f?t instanceof HTMLElement:t&&"object"==typeof t&&null!==t&&1===t.nodeType&&"string"==typeof t.nodeName}function r(t,i){i.forEach((function(i){t.classList.add(i)}))}function d(t,i){i.forEach((function(i){t.classList.remove(i)}))}function c(){throw Error("Missing parameter")}e.r(i);var f="object"==typeof HTMLElement;h.prototype.g=function(t){var i=["drift-"+t],e=this.a.j;return e&&i.push(e+"-"+t),i},h.prototype.h=function(){this.b=document.createElement("div"),r(this.b,this.g("bounding-box"))},h.prototype.show=function(t,i){this.s=!0,this.a.S.appendChild(this.b);var e=this.b.style;e.width=Math.round(t/this.a.f)+"px",e.height=Math.round(i/this.a.f)+"px",r(this.b,this.c)},h.prototype.W=function(){this.s&&this.a.S.removeChild(this.b),this.s=!1,d(this.b,this.c)},h.prototype.setPosition=function(t,i,e){var n=window.pageXOffset,s=window.pageYOffset;t=e.left+t*e.width-this.b.clientWidth/2+n,i=e.top+i*e.height-this.b.clientHeight/2+s,t<e.left+n?t=e.left+n:t+this.b.clientWidth>e.left+e.width+n&&(t=e.left+e.width-this.b.clientWidth+n),i<e.top+s?i=e.top+s:i+this.b.clientHeight>e.top+e.height+s&&(i=e.top+e.height-this.b.clientHeight+s),this.b.style.left=t+"px",this.b.style.top=i+"px"},o.prototype.i=function(t){t.preventDefault()},o.prototype.u=function(t){this.a.A&&this.V(t)&&!this.s||t.preventDefault()},o.prototype.V=function(t){return!!t.touches},o.prototype.M=function(){this.a.b.addEventListener("mouseenter",this.g,!1),this.a.b.addEventListener("mouseleave",this.B,!1),this.a.b.addEventListener("mousemove",this.c,!1),this.a.C?(this.a.b.addEventListener("touchstart",this.g,!1),this.a.b.addEventListener("touchend",this.B,!1),this.a.b.addEventListener("touchmove",this.c,!1)):(this.a.b.addEventListener("touchstart",this.i,!1),this.a.b.addEventListener("touchend",this.i,!1),this.a.b.addEventListener("touchmove",this.i,!1))},o.prototype.ca=function(){this.a.b.removeEventListener("mouseenter",this.g,!1),this.a.b.removeEventListener("mouseleave",this.B,!1),this.a.b.removeEventListener("mousemove",this.c,!1),this.a.C?(this.a.b.removeEventListener("touchstart",this.g,!1),this.a.b.removeEventListener("touchend",this.B,!1),this.a.b.removeEventListener("touchmove",this.c,!1)):(this.a.b.removeEventListener("touchstart",this.i,!1),this.a.b.removeEventListener("touchend",this.i,!1),this.a.b.removeEventListener("touchmove",this.i,!1))},o.prototype.g=function(t){this.u(t),this.h=t,"mouseenter"==t.type&&this.a.F?this.v=setTimeout(this.m,this.a.F):this.a.A?this.v=setTimeout(this.m,this.a.A):this.m()},o.prototype.m=function(){if(this.enabled){var t=this.a.O;t&&"function"==typeof t&&t(),this.a.l.show(this.a.b.getAttribute(this.a.R),this.a.b.clientWidth,this.a.b.clientHeight),this.h&&((t=this.h.touches)&&this.a.G||!t&&this.a.D)&&this.o.show(this.a.l.b.clientWidth,this.a.l.b.clientHeight),this.c()}},o.prototype.B=function(t){t&&this.u(t),this.h=null,this.v&&clearTimeout(this.v),this.o&&this.o.W(),(t=this.a.N)&&"function"==typeof t&&t(),this.a.l.W()},o.prototype.c=function(t){if(t)this.u(t),this.h=t;else{if(!this.h)return;t=this.h}if(t.touches)var i=(t=t.touches[0]).clientX,e=t.clientY;else i=t.clientX,e=t.clientY;i=(i-(t=this.a.b.getBoundingClientRect()).left)/this.a.b.clientWidth,e=(e-t.top)/this.a.b.clientHeight,this.o&&this.o.setPosition(i,e,t),this.a.l.setPosition(i,e,t)},u.Object.defineProperties(o.prototype,{s:{configurable:!0,enumerable:!0,get:function(){return this.a.l.s}}}),t=document.createElement("div").style;var p="undefined"!=typeof document&&("animation"in t||"webkitAnimation"in t);s.prototype.i=function(t){var i=["drift-"+t],e=this.a.j;return e&&i.push(e+"-"+t),i},s.prototype.ha=function(){this.b=document.createElement("div"),r(this.b,this.i("zoom-pane"));var t=document.createElement("div");r(t,this.i("zoom-pane-loader")),this.b.appendChild(t),this.c=document.createElement("img"),this.b.appendChild(this.c)},s.prototype.X=function(t){this.c.setAttribute("src",t)},s.prototype.Z=function(t,i){this.c.style.width=t*this.a.f+"px",this.c.style.height=i*this.a.f+"px"},s.prototype.setPosition=function(t,i,e){var n=this.c.offsetWidth,s=this.c.offsetHeight,o=this.b.offsetWidth,h=this.b.offsetHeight,a=o/2-n*t,r=h/2-s*i,d=o-n,u=h-s,c=0<d,f=0<u;s=c?d/2:0,n=f?u/2:0,d=c?d/2:d,u=f?u/2:u,this.b.parentElement===this.a.w&&(f=window.pageXOffset,c=window.pageYOffset,t=e.left+t*e.width-o/2+this.a.K+f,i=e.top+i*e.height-h/2+this.a.L+c,this.a.I&&(t<e.left+f?t=e.left+f:t+o>e.left+e.width+f&&(t=e.left+e.width-o+f),i<e.top+c?i=e.top+c:i+h>e.top+e.height+c&&(i=e.top+e.height-h+c)),this.b.style.left=t+"px",this.b.style.top=i+"px"),this.a.P||(a>s?a=s:a<d&&(a=d),r>n?r=n:r<u&&(r=u)),this.c.style.transform="translate("+a+"px, "+r+"px)",this.c.style.webkitTransform="translate("+a+"px, "+r+"px)"},s.prototype.M=function(){this.b.removeEventListener("animationend",this.h,!1),this.b.removeEventListener("animationend",this.g,!1),this.b.removeEventListener("webkitAnimationEnd",this.h,!1),this.b.removeEventListener("webkitAnimationEnd",this.g,!1),d(this.b,this.o),d(this.b,this.u)},s.prototype.show=function(t,i,e){this.M(),this.s=!0,r(this.b,this.o),this.c.getAttribute("src")!=t&&(r(this.b,this.V),this.c.addEventListener("load",this.m,!1),this.X(t)),this.Z(i,e),this.ia?this.aa():this.$(),p&&(this.b.addEventListener("animationend",this.h,!1),this.b.addEventListener("webkitAnimationEnd",this.h,!1),r(this.b,this.Y))},s.prototype.aa=function(){this.a.w.appendChild(this.b),r(this.b,this.v)},s.prototype.$=function(){this.a.J.appendChild(this.b)},s.prototype.W=function(){this.M(),this.s=!1,p?(this.b.addEventListener("animationend",this.g,!1),this.b.addEventListener("webkitAnimationEnd",this.g,!1),r(this.b,this.u)):(d(this.b,this.o),d(this.b,this.v))},s.prototype.h=function(){this.b.removeEventListener("animationend",this.h,!1),this.b.removeEventListener("webkitAnimationEnd",this.h,!1),d(this.b,this.Y)},s.prototype.g=function(){this.b.removeEventListener("animationend",this.g,!1),this.b.removeEventListener("webkitAnimationEnd",this.g,!1),d(this.b,this.o),d(this.b,this.u),d(this.b,this.v),this.b.setAttribute("style",""),this.b.parentElement===this.a.J?this.a.J.removeChild(this.b):this.b.parentElement===this.a.w&&this.a.w.removeChild(this.b)},s.prototype.m=function(){this.c.removeEventListener("load",this.m,!1),d(this.b,this.V)},u.Object.defineProperties(s.prototype,{ia:{configurable:!0,enumerable:!0,get:function(){var t=this.a.U;return!0===t||"number"==typeof t&&window.innerWidth<=t}}}),n.prototype.v=function(){this.l=new s({J:this.a.ga,f:this.a.f,P:this.a.P,I:this.a.I,U:this.a.ea,j:this.a.j,K:this.a.K,L:this.a.L,w:this.a.w})},n.prototype.u=function(){this.c=new o({b:this.h,l:this.l,C:this.a.C,O:this.a.O,N:this.a.N,R:this.a.R,F:this.a.F,A:this.a.A,D:this.a.D,G:this.a.G,j:this.a.j,f:this.a.f,H:this.a.H})},n.prototype.M=function(t){this.l.X(t)},n.prototype.i=function(){this.c.enabled=!1},n.prototype.m=function(){this.c.enabled=!0},n.prototype.g=function(){this.c.B(),this.c.ca()},u.Object.defineProperties(n.prototype,{s:{configurable:!0,enumerable:!0,get:function(){return this.l.s}},f:{configurable:!0,enumerable:!0,get:function(){return this.a.f},set:function(t){this.a.f=t,this.l.a.f=t,this.c.a.f=t,this.o.a.f=t}}}),Object.defineProperty(n.prototype,"isShowing",{get:function(){return this.s}}),Object.defineProperty(n.prototype,"zoomFactor",{get:function(){return this.f},set:function(t){this.f=t}}),n.prototype.setZoomImageURL=n.prototype.M,n.prototype.disable=n.prototype.i,n.prototype.enable=n.prototype.m,n.prototype.destroy=n.prototype.g,window.Drift=n}]);
  return Product;
})();
theme.ProductRecommendations = (function() {
  function ProductRecommendations(container) {
    var sectionId = container.getAttribute('data-section-id');    
    var productId = container.getAttribute('data-product-id');
    var l = container.dataset.limit;
    var u = theme.routes_product_recommendations_url + '?section_id=product-recommendations&product_id=' + productId + '&limit=' + l;
    fetch(u)
    .then(function(response) {
      return response.text();
    })
    .then(function(h) {
      if (h.trim() === '') return;
      container.innerHTML = h;
      container.innerHTML = container.querySelector('.product-recommendations').innerHTML;
      if (theme.settings.quickView) {
        theme.quick();
      }
      var Carousel = document.getElementById('glider-carousel-' + sectionId);
      if (Carousel) {
        theme.slider(container);
      }
      if (theme.settings.cart) {
        theme.ajax_cart(container);
      }
      theme.swatches(container);
    }).catch(function (err) {
      container.classList.add('hidden');
      console.log('!: ' + err);
    });
  }
  return ProductRecommendations;
})();
theme.ProductRelated = (function() {
  function ProductRelated(container) {
    var sectionId = container.getAttribute('data-section-id');    
    var productId = container.getAttribute('data-product-id');
    var Carousel = document.getElementById('glider-carousel-' + sectionId);
    if (Carousel) {
      theme.slider(container);
    }
    if (theme.settings.cart) {
      theme.ajax_cart(container);
    }
    theme.swatches(container);
  }
  return ProductRelated;
})();
theme.LibraryLoader = (function() {
  var types = {
    link: 'link',
    script: 'script'
  };
  var status = {
    requested: 'requested',
    loaded: 'loaded'
  };
  var cloudCdn = 'https://cdn.shopify.com/shopifycloud/';
  var libraries = {
    plyrShopifyStyles: {
      tagId: 'plyr-shopify-styles',
      src: cloudCdn + 'plyr/v2.0/shopify-plyr.css',
      type: types.link
    },
    modelViewerUiStyles: {
      tagId: 'shopify-model-viewer-ui-styles',
      src: cloudCdn + 'model-viewer-ui/assets/v1.0/model-viewer-ui.css',
      type: types.link
    }
  };
  function load(libraryName, callback) {
    var library = libraries[libraryName];
    if (!library) return;
    if (library.status === status.requested) return;
    callback = callback || function() {};
    if (library.status === status.loaded) {
      callback();
      return;
    }
    library.status = status.requested;
    var tag;
    switch (library.type) {
      case types.script:
        tag = createScriptTag(library, callback);
        break;
      case types.link:
        tag = createLinkTag(library, callback);
        break;
    }
    tag.id = library.tagId;
    library.element = tag;
    var firstScriptTag = document.getElementsByTagName(library.type)[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }
  function createScriptTag(library, callback) {
    var tag = document.createElement('script');
    tag.src = library.src;
    tag.addEventListener('load', function() {
      library.status = status.loaded;
      callback();
    });
    return tag;
  }
  function createLinkTag(library, callback) {
    var tag = document.createElement('link');
    tag.href = library.src;
    tag.rel = 'stylesheet';
    tag.type = 'text/css';
    tag.addEventListener('load', function() {
      library.status = status.loaded;
      callback();
    });
    return tag;
  }
  return {
    load: load
  };
})();
theme.product_video = (function() {
  var videos = {};
  var hosts = {
    shopify: 'shopify',
    external: 'external'
  };
  var selectors = {
    productMediaWrapper: '[data-product-single-media-wrapper]'
  };
  var attributes = {
    enableVideoLooping: 'enable-video-looping',
    videoId: 'video-id'
  };
  function init(videoContainer, sectionId) {
    if (!videoContainer) {
      return;
    }
    var videoElement = videoContainer.querySelector('iframe, video');
    if (!videoElement) {
      return;
    }
    var mediaId = videoContainer.getAttribute('data-media-id');
    videos[mediaId] = {
      mediaId: mediaId,
      sectionId: sectionId,
      host: hostFromVideoElement(videoElement),
      container: videoContainer,
      element: videoElement,
      ready: function() {
        createPlayer(this);
      }
    };
    window.Shopify.loadFeatures([
      {
        name: 'video-ui',
        version: '2.0',
        onLoad: setupVideos
      }
    ]);
    theme.LibraryLoader.load('plyrShopifyStyles');
  }
  function setupVideos(errors) {
    if (errors) {
      fallbackToNativeVideo();
      return;
    }
    loadVideos();
  }
  function createPlayer(video) {
    if (video.player) {
      return;
    }
    var productMediaWrapper = video.container.closest(selectors.productMediaWrapper);
    var enableLooping = productMediaWrapper.getAttribute('data-' + attributes.enableVideoLooping) === 'true';
    // eslint-disable-next-line no-undef
    video.player = new Shopify.Video(video.element, {
      loop: { active: enableLooping }
    });
    var pauseVideo = function() {
      if (!video.player) return;
      video.player.pause();
    };
    productMediaWrapper.addEventListener('mediaHidden', pauseVideo);
    productMediaWrapper.addEventListener('xrLaunch', pauseVideo);
    productMediaWrapper.addEventListener('mediaVisible', function() {
      if (theme.Helpers.isTouch()) return;
      if (!video.player) return;
      video.player.play();
    });
  }
  function hostFromVideoElement(video) {
    if (video.tagName === 'VIDEO') {
      return hosts.shopify;
    }
    return hosts.external;
  }
  function loadVideos() {
    for (var key in videos) {
      if (videos.hasOwnProperty(key)) {
        var video = videos[key];
        video.ready();
      }
    }
  }
  function fallbackToNativeVideo() {
    for (var key in videos) {
      if (videos.hasOwnProperty(key)) {
        var video = videos[key];

        if (video.nativeVideo) continue;

        if (video.host === hosts.shopify) {
          video.element.setAttribute('controls', 'controls');
          video.nativeVideo = true;
        }
      }
    }
  }
  function removeSectionVideos(sectionId) {
    for (var key in videos) {
      if (videos.hasOwnProperty(key)) {
        var video = videos[key];

        if (video.sectionId === sectionId) {
          if (video.player) video.player.destroy();
          delete videos[key];
        }
      }
    }
  }
  return {
    init: init,
    hosts: hosts,
    loadVideos: loadVideos,
    removeSectionVideos: removeSectionVideos
  };
})();
function onYouTubeIframeAPIReady() {
  theme.product_video.loadVideos(theme.product_video.hosts.external);
}
theme.product_model = (function() {
  var modelJsonSections = {};
  var models = {};
  var xrButtons = {};
  var selectors = {
    mediaGroup: '[data-product-single-media-group]',
    xrButton: '[data-shopify-xr]'
  };
  function init(modelViewerContainers, sectionId) {
    modelJsonSections[sectionId] = {
      loaded: false
    };
    modelViewerContainers.forEach(function(modelViewerContainer, index) {
      var mediaId = modelViewerContainer.getAttribute('data-media-id');
      var modelViewerElement = modelViewerContainer.querySelector(
        'model-viewer'
      );
      var modelId = modelViewerElement.getAttribute('data-model-id');
      if (index === 0) {
        var mediaGroup = modelViewerContainer.closest(selectors.mediaGroup);
        var xrButton = mediaGroup.querySelector(selectors.xrButton);
        xrButtons[sectionId] = {
          element: xrButton,
          defaultId: modelId
        };
      }
      models[mediaId] = {
        modelId: modelId,
        sectionId: sectionId,
        container: modelViewerContainer,
        element: modelViewerElement
      };
    });
    window.Shopify.loadFeatures([
      {
        name: 'shopify-xr',
        version: '1.0',
        onLoad: setupShopifyXr
      },
      {
        name: 'model-viewer-ui',
        version: '1.0',
        onLoad: setupModelViewerUi
      }
    ]);
    theme.LibraryLoader.load('modelViewerUiStyles');
  }
  function setupShopifyXr(errors) {
    if (errors) return;
    if (!window.ShopifyXR) {
      document.addEventListener('shopify_xr_initialized', function() {
        setupShopifyXr();
      });
      return;
    }
    for (var sectionId in modelJsonSections) {
      if (modelJsonSections.hasOwnProperty(sectionId)) {
        var modelSection = modelJsonSections[sectionId];
        if (modelSection.loaded) continue;
        var modelJson = document.querySelector('#ModelJson-' + sectionId);
        window.ShopifyXR.addModels(JSON.parse(modelJson.innerHTML));
        modelSection.loaded = true;
      }
    }
    window.ShopifyXR.setupXRElements();
  }
  function setupModelViewerUi(errors) {
    if (errors) return;
    for (var key in models) {
      if (models.hasOwnProperty(key)) {
        var model = models[key];
        if (!model.modelViewerUi) {
          model.modelViewerUi = new Shopify.ModelViewerUI(model.element);
        }
        setupModelViewerListeners(model);
      }
    }
  }
  function setupModelViewerListeners(model) {
    var xrButton = xrButtons[model.sectionId];
    model.container.addEventListener('mediaVisible', function() {
      xrButton.element.setAttribute('data-shopify-model3d-id', model.modelId);
      if (theme.Helpers.isTouch()) return;
      model.modelViewerUi.play();
    });
    model.container.addEventListener('mediaHidden', function() {
      xrButton.element.setAttribute(
        'data-shopify-model3d-id',
        xrButton.defaultId
      );
      model.modelViewerUi.pause();
    });
    model.container.addEventListener('xrLaunch', function() {
      model.modelViewerUi.pause();
    });
  }
  function removeSectionModels(sectionId) {
    for (var key in models) {
      if (models.hasOwnProperty(key)) {
        var model = models[key];
        if (model.sectionId === sectionId) {
          models[key].modelViewerUi.destroy();
          delete models[key];
        }
      }
    }
    delete modelJsonSections[sectionId];
  }
  return {
    init: init,
    removeSectionModels: removeSectionModels
  };
})();
theme.product_media = function (container) {  
  var sectionId = container.getAttribute('data-section-id');
  var productMediaWrapper = container.querySelectorAll('[data-product-single-media-wrapper]');
  var productMediaTypeModel = container.querySelectorAll('[data-product-media-type-model]');
  var productMediaTypeVideo = container.querySelectorAll('[data-product-media-type-video]');
  productMediaTypeVideo.forEach(function(p) {
    theme.product_video.init(p, sectionId);
  });
  if (productMediaTypeModel.length < 1) return;
  theme.product_model.init(productMediaTypeModel, sectionId);
  document.addEventListener('shopify_xr_launch', function() {
    var currentMedia = container.querySelector(productMediaWrapper + ':not(.hidden)');
    currentMedia.dispatchEvent(new CustomEvent('xrLaunch'));
  });
};
theme.StoreAvailabilityLoad = function (container) {
  var sectionId = container.getAttribute('data-section-id'),
      sectionType = container.getAttribute('data-section-type');
  var pJ = document.getElementById('ProductJson-' + sectionId),
      pS = 'product-select-' + sectionId;
  if (!pJ || !pJ.innerHTML.length) {
    return;
  }
  this.productSingleObject = JSON.parse(pJ.innerHTML);
  this.container = container;
  var sectionId = container.getAttribute('data-section-id');
  this.selectors = {
    storeAvailabilityContainer: '[data-store-availability-container]',
    originalSelectorId: '#product-select-' + sectionId,
    singleOptionSelector: 'form.product-form-' + sectionId + ' .single-option-selector',
  };
  this.storeAvailabilityContainer = container.querySelector(
    this.selectors.storeAvailabilityContainer
  );
  if (this.storeAvailabilityContainer) {
    this.storeAvailability = new theme.StoreAvailability(
      this.storeAvailabilityContainer
    );
  }
  if (this.storeAvailability) {
    var e = document.getElementById(pS);
    var value = e.options[e.selectedIndex].value;
    this.storeAvailability.updateContent(
      value,
      this.productSingleObject.title
    );
  }
};
theme.StoreAvailability = (function(container) {
  var selectors = {
    storeAvailabilityModalProductTitle: '[data-store-availability-modal-product-title]'
  };
  function StoreAvailability(container) {
    this.container = container;
    this.pT = this.container.dataset.productTitle;
  }
  StoreAvailability.prototype = Object.assign({}, StoreAvailability.prototype, {
    updateContent: function(variantId) {
      var variantSectionUrl =
          this.container.dataset.baseUrl +
          '/variants/' +
          variantId +
          '/?section_id=store-availability';
      var self = this;
      fetch(variantSectionUrl)
      .then(function(response) {
        return response.text();
      })
      .then(function(storeAvailabilityHTML) {
        if (storeAvailabilityHTML.trim() === '') {
          return;
        }
        self.container.innerHTML = storeAvailabilityHTML;
        self.container.innerHTML = self.container.firstElementChild.innerHTML;
        var storeAvailabilityModalProductTitle = self.container.querySelector(
          selectors.storeAvailabilityModalProductTitle
        );
        if (storeAvailabilityModalProductTitle) {
          storeAvailabilityModalProductTitle.textContent = self.pT;
        }
        var el = self.container.querySelector('.srfc');        
        const body = document.body;
        const content = self.container.querySelector('.StoreAvailabilityModal');        
        if (!el) return;
        el.onclick = (e) => {
          const newInstance = basicLightbox.create(content, {
            onShow: (instance) => {              
              body.classList.add('basicLightbox__active');
              instance.element().querySelector('button').onclick = () => instance.close()
            },
            onClose: (instance) => {
              body.classList.remove('basicLightbox__active');
              content.innerHTML = instance.element().querySelector('.basicLightbox__placeholder').innerHTML;
            }
          })
          newInstance.show()
        }
      });
    },
  });
  return StoreAvailability;
})();

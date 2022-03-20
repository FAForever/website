document.addEventListener("DOMContentLoaded", function (event) {
  console.log("Lock and loaded!");

  //JS for the main navbar menus to open on hover and close when leaving (GAME, COMMUNITY, etc). It uses mobilenav-active because it just needs the display:block        
  let navlist = document.getElementsByClassName("nav_list");
  let navabsolute = document.getElementsByClassName("nav_absolute");


  for (let i = 0; i < navlist.length; i++) {
    navlist[i].addEventListener("mouseover", function () {
      navabsolute[i].classList.add("mobilenav_active");
      
    });

    navlist[i].addEventListener("mouseout", function () {
      for (x = 0; x < navabsolute.length; x++) {
        navabsolute[x].classList.remove("mobilenav_active");

      }
    });
  }

  //JS for mobile navbar, when clicking the menus on the navbar, it shows of the contents inside of them. For example GAME > Tutorials, Advanced AI, etc.
  let blackitem = document.getElementsByClassName("mobilenav_item");
  let blackul = document.getElementsByClassName("mobilenav_ul");

  for (let i = 0; i < blackitem.length; i++) {
    blackitem[i].addEventListener("click", function () {
      listopen(i);
    });
  }
  function listopen(xlist) {
    for (let i = 0; i < blackul.length; i++) {
      if (xlist == i) {
        blackul[xlist].classList.toggle("mobilenav_active");
        blackitem[xlist].classList.toggle("mobilenav_caret");

      } else {
        blackul[i].classList.remove("mobilenav_active");
        blackitem[i].classList.remove("mobilenav_caret");

      }

    }
  }


  //JS for the 3 white bars in the mobile nav bar that open said nav bar. You click the 3 bars and the mobile navbar is opened
  let blackmobile = document.getElementsByClassName("mobilenav_mobile");
  let blackbars = document.getElementById("mobilenav_bars");
  let blackbg = document.getElementById("mobilenav_bg");
  blackbars.addEventListener("click", function () {
    blackmobile[0].classList.toggle("mobilenav_mobile_active");
    blackbars.classList.toggle("mobilenav_change");
    blackbg.classList.toggle("mobilenav_bg_active");
  });

  // JS for stuff appearing on scroll (Some elements don't appear on-screen until you scroll down), not sure exactly how it works, would love if someone
  // can explain it for me.

  // https://webdesign.tutsplus.com/tutorials/animate-on-scroll-with-javascript--cms-36671
  const scrollElements = document.querySelectorAll(".scrollFade");


  const elementInView = (el = 1) => {
    const elementTop = el.getBoundingClientRect().top;
    return (
      elementTop <= (window.innerHeight || document.documentElement.clientHeight)
    );
  };

  const elementOutofView = (el) => {
    const elementTop = el.getBoundingClientRect().top;
    return (
      elementTop > (window.innerHeight || document.documentElement.clientHeight)
    );
  };

  const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
      if (elementInView(el, 1.25)) {
        el.classList.add("scrolled");
      } else {
        el.classList.remove("scrolled");
      }
    });
  };

  window.addEventListener('scroll', () => {
    handleScrollAnimation();
    console.log("You scrolled!");
  });





  //function to make highligthed text change colors/pulsate (it goes from white to gold and viceversa)
  let highlightText = document.getElementsByClassName("highlightText");
  let x = 0;
  setInterval(highlightPulse, 2000);

  function highlightPulse() {

    if (x < 1) {
      x++;
      for (let i = 0; i < highlightText.length; i++) {

        highlightText[i].style.transition = "1s";
        highlightText[i].style.color = "#FFFFFF";
      }
    } else {
      x--;
      for (let i = 0; i < highlightText.length; i++) {
        highlightText[i].style.color = "#f7941d";
      }

    }
  }
  


  // stuff for the ACU faction cards
  let acuCard = document.getElementsByClassName("acuCard");
  let factionAbsolute = document.getElementsByClassName("factionAbsolute");
  let acuUEF = document.getElementById("acuUEF");
  acuUEF.style.backgroundImage = "url(/../../images/acuuef.jpg)";
  let acuSeraphim = document.getElementById("acuSeraphim");
  let acuBlankScreen = document.getElementById("acuBlankScreen");

  for (let i = 0; i < acuCard.length; i++) {
    acuCard[i].addEventListener("click", () => {
      factionAbsolute[i].classList.add("acuAbsoluteActive");
      factionAbsolute[i].style.opacity = "1";
      acuBlankScreen.style.display = "block";


      if (i == 1) {
        acuUEF.style.backgroundImage = "url(/../../images/acucybran.jpg)";
      } else if (i == 2) {
        acuSeraphim.style.backgroundImage = "url(/../../images/acuaeon.jpg)";
      }

    });
    acuBlankScreen.addEventListener("click", () => {

      acuBlankScreen.style.display = "none";
      factionAbsolute[i].style.opacity = "0";
      setTimeout(() => {
        factionAbsolute[i].classList.remove("acuAbsoluteActive");
      }, 400);


      if (i === 1) {
        acuUEF.style.backgroundImage = "url(/../../images/acuuef.jpg)";
      } else if (i === 2) {
        acuSeraphim.style.backgroundImage = "url(/../../images/acuseraphim.jpg)";
      }
    });

  }

  //change zoomout and eco images

  /*
    let setons = document.getElementById("rectangleImage");
    let setonsPicture = '/../../images/zoomout';
    let counterA = 0;
    setInterval(changeImage, 1200);
    function changeImage() {
      if (counterA < 9) {
        counterA++;
        setons.src = setonsPicture + counterA + '.jpg';
  
      } else {
        counterA = 0;
      }
    } */
});

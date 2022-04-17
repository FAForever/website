document.addEventListener("DOMContentLoaded", () => {
  console.log("Lock and loaded!");

 async function playerCounterJSON() {
    const response = await fetch('js/app/members/recent.json');
    const data = await response.json();
    return data;
  }
  playerCounterJSON()
    .then((data) => {
      document.getElementById('playerCounter').insertAdjacentHTML("afterbegin", data.length);
    });



  //JS for the main navbar menus to open on hover and close when leaving (GAME, COMMUNITY, etc). It uses mobilenav-active because it just needs the display:block        
  let topNavAbsolute = document.getElementsByClassName("topNavAbsolute");
  let topNavList = document.getElementsByClassName("topNavList");
  let navlist = document.getElementsByClassName("nav_list");
  let navabsolute = document.getElementsByClassName("nav_absolute");


  for (let i = 0; i < navlist.length; i++) {
    //When you mouseover/click, menu appears
    navlist[i].addEventListener("mouseover", () => {
      navabsolute[i].classList.add("mobilenav_active");
    });
    
    //when you mouseout/leave, menu dissapears
    navlist[i].addEventListener("mouseout", () => {
      for (x = 0; x < navabsolute.length; x++) {
        navabsolute[x].classList.remove("mobilenav_active");
      }
    });
  }
  //The mouseover here needs to change to click but by doing so, the mouseout triggers as soon as you  enter the list or leave the icon.
  topNavList[0].addEventListener("mouseover", () => {
    topNavAbsolute[0].classList.add("mobilenav_active");
  });
  topNavList[0].addEventListener("mouseout", () => {
    for (x = 0; x < topNavAbsolute.length; x++) {
      topNavAbsolute[x].classList.remove("mobilenav_active");
    }
  });
  
  
  //JS for mobile navbar, when clicking the menus on the navbar, it shows of the contents inside of them. For example GAME > Tutorials, Advanced AI, etc.
  let blackitem = document.getElementsByClassName("mobilenav_item");
  let blackul = document.getElementsByClassName("mobilenav_ul");

  for (let i = 0; i < blackitem.length; i++) {
    blackitem[i].addEventListener("click", () => {
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
  blackbars.addEventListener("click", () => {
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
  let factionCard = document.getElementsByClassName("factionCard");
  let xACU = 10;
  
  for (let i = 0; i < acuCard.length; i++) {
    acuCard[i].addEventListener("click", () => {
      for (let i = 0; i < acuCard.length; i++) {
        factionCard[i].classList.remove("factionActive");
        acuCard[i].classList.remove("acuActive");
      }
      if (xACU == i) {
        xACU = 5;
      } else {
        xACU = i;
        factionCard[i].classList.toggle("factionActive");
        acuCard[i].classList.toggle("acuActive");
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

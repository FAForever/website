
document.addEventListener("DOMContentLoaded", () => {




  
  //JS for the main navbar menus to open on hover and close when leaving (GAME, COMMUNITY, etc). It uses mobilenav-active because it just needs the display:block        

  let navList = document.getElementsByClassName("navList");
  let navAbsolute = document.querySelectorAll(".navAbsolute");
  let stillHere = 0;

  for (let i = 0; i < navList.length; i++) {
    //When you mouseover/click, menu appears
    navList[i].addEventListener("mouseout", () => {
      stillHere = 1;
      navAbsolute[i].classList.remove("navAbsoluteActive");
      setTimeout(() => {
        if (stillHere === 1) {
          navAbsolute.forEach(list => list.style.opacity = "0%");
        }
      }, 0);

    });
    navList[i].addEventListener("mouseover", () => {
      stillHere = 0;
      navAbsolute[i].classList.add("navAbsoluteActive");
      setTimeout(() => {
        navAbsolute[i].style.opacity = "100%";
      }, 10);
    });
    //when you mouseout/leave, menu dissapears
  }
  
  let mobileNavLi = document.querySelectorAll(".mobileNavLi");
  let mobileNavUl = document.querySelectorAll(".mobileNavUl");
  let mobileCaret = document.querySelectorAll(".mobileCaret");
  let mobileSameElementClicked = 7;
  mobileNavUl[0].classList.add('MobileNavULActive');
  
  // When you click a mobile nav
  // Nav li === the options/dropdown menu
  // Nav ul === The category
  mobileNavUl.forEach((ul,index) => ul.addEventListener('click', () => {
    mobileNavLi.forEach(li => li.style.display = "none");
    mobileNavUl.forEach(li => li.style.backgroundColor = "#262626");
    mobileCaret.forEach(li => li.classList.remove("mobileCaretActive"));
    if (mobileSameElementClicked !== index) {
      mobileNavUl[index].style.backgroundColor = "#3F3F3FFF";
      mobileNavLi[index].style.display = "block";
      mobileCaret[index].classList.add("mobileCaretActive");  
    }
    if (mobileSameElementClicked === index) {
      mobileSameElementClicked = 7;
    } else {
      mobileSameElementClicked = index;  
    }

  }));
  
  let mobileNavBar = document.querySelectorAll('.mobileNavBar');
  let mobileTransitionBar = document.querySelectorAll('.mobileTransition');
  let faBars = document.querySelectorAll('.fa-bars');
  let closeMobileMenu = document.querySelectorAll('.fa-times');
  let bodyHTML = document.body;

  faBars[0].addEventListener('click', () => {
    mobileNavBar[0].style.display = "block";
    mobileTransitionBar[0].style.display = "none";
    mobileTransitionBar[0].style.opacity = "0";
    bodyHTML.classList.add("stopScroll");
    setTimeout( () => {
      mobileNavBar[0].style.opacity = "1";
    }, 1);
  });
  
  closeMobileMenu[0].addEventListener('click', () => {
    mobileNavBar[0].style.opacity = "0";
    mobileTransitionBar[0].style.display = "grid";
    bodyHTML.classList.remove("stopScroll");
    setTimeout( () => {
      mobileNavBar[0].style.display = "none";
      mobileTransitionBar[0].style.opacity = "1";
    }, 500); 
  });




  let loginList = document.getElementById("loginList");
  let loginAbsolute = document.getElementById("loginAbsolute");
  let stillHovering = 0;
  
  
  //when you mouse is over the login, it should appear
  loginList.addEventListener("mouseover", () => {
    stillHovering = 0;
   
    setTimeout(() => {
      loginAbsolute.style.display = "block";
      //console.log('timeout done');
    }, 0);
  });
    //When you mouseover/click, menu appears
    //when you mouseout/leave, menu dissapears
    loginList.addEventListener("mouseout", () => {
      stillHovering = 1;
      
      setTimeout(() => {
        if (stillHovering === 1) {
          loginAbsolute.style.display = "none";
        }
      }, 0);

    });
    
 
    
  
  

  //function to make highligthed text change colors/pulsate (it goes from white to gold and viceversa)
  let highlightText = document.querySelectorAll(".highlightText");
  let highLigthCounter = 0;

  function highlightPulse() {
    if (highLigthCounter < 1) {
      highLigthCounter++;
      highlightText.forEach(element => element.style.transition = "1s");
      highlightText.forEach(element => element.style.color = "#FFFFFF");
    } else {
      highLigthCounter--;
      highlightText.forEach(element => element.style.color = "#f7941d");
      
    }
  }

  setInterval(highlightPulse, 2000);
  
});

let pages = htmlElement.split(',');
if (pages[0] === '/all') {
  document.getElementById('flashMessageContainer').style.display = 'block';
} else {
  pages.forEach(route => {

    if (window.location.href.includes(route)) {
      document.getElementById('flashMessageContainer').style.display = 'block';
    }
  });  
}



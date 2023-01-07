
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
  
  const mobileNavMenuContent = document.querySelectorAll(".mobileNavMenuContent");
  const mobileNavElement = document.querySelectorAll(".mobileNavElement");
  const mobileNavMenu = document.querySelectorAll(".mobileNavMenu");
  const returnMenu = document.querySelector('#returnMenu');
  //Random variable to determine whether same menu was clicked
  let mobileSameElementClicked = 7;
  
  //Code that works out how the mobileNav menus are open
  mobileNavMenu.forEach((element,index) => element.addEventListener('click', () => {
    mobileNavMenuContent.forEach(item => item.style.display = "none");
    mobileNavMenu.forEach(item => item.style.backgroundColor = "#262626");
    mobileNavElement.forEach(item => item.style.display = 'none');
    returnMenu.style.display = 'none';

    if (mobileSameElementClicked !== index) {
      returnMenu.style.display = 'block';
      mobileNavMenu[index].style.display = "block";
      mobileNavMenu[index].style.backgroundColor = "#3F3F3FFF";
      mobileNavMenuContent[index].style.display = "block";
      mobileSameElementClicked = index;

    } else {
      mobileSameElementClicked = 7;
      mobileNavElement.forEach(item => item.style.display = 'block');
    }
  }));
  // Clicking the return Menu Brings us back
  returnMenu.addEventListener('click', () => {
    mobileNavMenuContent.forEach(item => item.style.display = "none");
    mobileNavMenu.forEach(item => item.style.backgroundColor = "#262626");
    mobileNavElement.forEach(item => item.style.display = 'block');
    returnMenu.style.display = 'none';
  });
  
  
  // Code that creates the transition from menu closing to menu opening
  let mobileNavBar = document.querySelector('#mobileNavBar');
  let mobileTransitionBar = document.querySelectorAll('.mobileTransition');
  let openMenu = document.querySelector('#openMenu');
  let closeMenu = document.querySelector('#closeMenu');
  let bodyHTML = document.body;

  openMenu.addEventListener('click', () => {
    console.log('clicked')
    mobileNavBar.style.display = "grid";
    mobileTransitionBar[0].style.display = "none";
    mobileTransitionBar[0].style.opacity = "0";
    bodyHTML.classList.add("stopScroll");
    setTimeout( () => {
      mobileNavBar.style.opacity = "1";
    }, 1);
  });
  
  closeMenu.addEventListener('click', () => {
    mobileNavBar.style.opacity = "0";
    mobileTransitionBar[0].style.display = "grid";
    bodyHTML.classList.remove("stopScroll");
    setTimeout( () => {
      mobileNavBar.style.display = "none";
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

    if (window.location.href.includes(route) && window.innerWidth > 900) {
      document.getElementById('flashMessageContainer').style.display = 'block';
    }
  });  
}


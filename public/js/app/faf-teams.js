console.log("Azul");

let flipContainer = document.getElementsByClassName("flipContainer");
let gridImage = document.getElementsByClassName("gridImage");
let flipText = document.getElementsByClassName("flipText");

for (let i = 0; i < flipContainer.length; i++) {
  flipContainer[i].addEventListener('click', function() {
    for (let j = 0; j < flipContainer.length; j++) {
      
    }

    flipContainer[i].classList.toggle("flipAnimationBack");
    flipContainer[i].classList.toggle("flipAnimation");
    setTimeout(() => {
      gridImage[i].classList.toggle("flipInactive");
      flipText[i].classList.toggle("flipInactive");
      
    }, 200);
    
    

  });
}

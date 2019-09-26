// import { log } from "util";

document.addEventListener('DOMContentLoaded', () => {

  console.log('IronGenerator JS imported successfully!');
  
  
}, false);


console.log("adding step >>>>>. ", document.querySelector('#addStepButton'));


document.querySelector("#addStepButton").onclick = function(){

  let thePtag = document.createElement(`p`);
  thePtag.setAttribute('class', `cookingStepsInput`)
  thePtag.innerHTML = `
  Step ${document.getElementsByClassName("cookingStepsInput").length + 1}:
  `;

  let theInputTag = document.createElement(`input`);
  theInputTag.setAttribute('id', `theInstructions`);
  theInputTag.setAttribute('type', 'text');
  theInputTag.setAttribute('name', 'instructionInput');

  thePtag.append(theInputTag);
  

  document.querySelector("#cookingSteps").append(thePtag);
};    



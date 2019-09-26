import axios from "axios";

// import { log } from "util";

document.addEventListener('DOMContentLoaded', () => {

  console.log('IronGenerator JS imported successfully!');
  
  
}, false);





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





// let btns = document.querySelectorAll(".deleteBtn")
// let id = document.getElementById('recipe-id').innerHTML
// for(let i=0; i<btns.length; i++ ){

//   btns[i].onclick = function(){
//     axios.post(`http://localhost:3000/recipes/${id}/step/${i}`)
//     .then(()=>{
//       console.log('yay')
//     })
//     .catch((err)=>{
//       console.log(err);
//     })
//   }


// }
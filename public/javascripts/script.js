

document.addEventListener('DOMContentLoaded', () => {

  console.log('IronGenerator JS imported successfully!');

  let spans = document.getElementsByClassName('cookingStepsInput');
  for(let i=0; i<spans.length; i++){
    spans[i].innerHTML = 'Step: '+ Number(i+1);
  }
  
  
}, false);





document.querySelector("#addStepButton").onclick = function(){

  let thePtag = document.createElement(`p`);
  thePtag.setAttribute('class', `cookingStepsInput`)
  thePtag.innerHTML = `
  Step ${document.getElementsByClassName("cookingStepsInput").length + 1}:`;

  let theInputTag = document.createElement(`input`);
  theInputTag.setAttribute('id', `theInstructions`);
  theInputTag.setAttribute('type', 'text');
  theInputTag.setAttribute('name', 'instructionInput');

  thePtag.append(theInputTag);
  

  document.querySelector("#cookingSteps").append(thePtag);
};    





let btns = document.querySelectorAll(".deleteBtn")
let id = document.getElementById('recipe-id').innerHTML
for(let i=0; i<btns.length; i++ ){

  btns[i].onclick = function(e){

    
       axios.post(`http://localhost:3000/recipes/deletestep/${id}/step/${i}`, {})
      .then((x)=>{
      
      
        btns[i].parentElement.remove()

        let spans = document.getElementsByClassName('cookingStepsInput');

        for(let i=0; i<spans.length; i++){
          spans[i].innerHTML = 'Step: '+ Number(i+1);
        }


   
    })
    .catch((err)=>{
      console.log(err);
    })
  }


 }
function goBack() {
  window.history.back();
}
// go back button


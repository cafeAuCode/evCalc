// function updateSpans() {
//       document.getElementById("selectedBatterySize").textContent = document.getElementById("batterySize").value;
//       document.getElementById("selectedVehicleEfficiency").textContent = document.getElementById("vehicleEfficiency").value;
//       document.getElementById("selectedPsiValue").textContent = document.getElementById("psiRange").value;
//       document.getElementById("selectedVehicleWeight").textContent = document.getElementById("vehicleWeight").value;
//       document.getElementById("selectedEcoAbility").textContent = document.getElementById("ecoAbility").value;
//       document.getElementById("selectedRegen").textContent = document.getElementById("regen").value;
//     }
    


    function updateRange() {

      let vehicleEfficiency = Number(document.getElementById("vehicleEfficiency").value);
      let batterySize = Number(document.getElementById("batterySize").value);
      let stateOfCharge = Number(document.getElementById("stateOfCharge").value);
      let vehicleWeight = Number(document.getElementById("vehicleWeight").value);
      let ecoAbility = Number(document.getElementById("ecoAbility").value);
      let regen = Number(document.getElementById("regen").value);
      let psiRange = Number(document.getElementById("psiRange").value);

      // Range mathmatic equation (in miles) 
      let expectedRange = (((batterySize * stateOfCharge * 0.01) * (62.1371 * vehicleEfficiency)) / (vehicleWeight/12)) * (1 - ((vehicleWeight - 1000) / 4000) * 0.4) * (1 - 0.2 * (1 - ecoAbility / 100)) * (1 + 0.3 * (regen / 100)) * (1 + 0.15 * (psiRange / 100));
    
      document.getElementById("range").innerHTML = "Estimated range: " + expectedRange.toFixed(1) + " miles";
    }
    
const inputIds = ['stateOfCharge', 'batterySize', 'vehicleEfficiency', 'psiRange', 'vehicleWeight', 'ecoAbility', 'regen'];

inputIds.forEach(function(inputId) {
  const inputElem = document.getElementById(inputId);
  const spanElem = document.getElementById('selected' + inputId.charAt(0).toUpperCase() + inputId.slice(1));
  
  inputElem.addEventListener('input', function() {
    spanElem.textContent = inputElem.value;
    updateRange();
  });

  // Set the initial value of the span element to match the input element
});





// tirePressure Module Script:

let tireDiameter = 195;
let canvas = document.getElementById("myCanvas");
canvas.width = 100;
canvas.height = 100;
let context = canvas.getContext("2d");

let centerX = canvas.width / 2;
let centerY = canvas.height / 2;
let minRadius = 0.45 * tireDiameter / 2;
let maxRadius = 0.5 * tireDiameter / 2;
let rimRadius = 0.3 * tireDiameter / 2;


// Create Tire within canvas

        function drawTire(radius, color) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.beginPath();
            context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
            context.fillStyle = color;
            context.fill();
            context.lineWidth = 1;
            context.strokeStyle = "#003300";
            context.stroke();

            context.fillStyle = "rgba(128, 128, 128, 0.4)";
            context.fill();
        }

// Create rim within the tire, to appear more like a car wheel

        function drawRim(radius) {
            context.beginPath();
            context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
            context.fillStyle = "white";
            context.fill();
            context.lineWidth = 1;
            context.strokeStyle = "#003300";
            context.stroke();

            let spokeCount = 8;
            let spokeRadius = radius * 0.9;
            let spokeAngle = 2 * Math.PI / spokeCount;

            for (let i = 0; i < spokeCount; i++) {
                let angle = i * spokeAngle;
                context.beginPath();
                context.moveTo(centerX, centerY);
                context.lineTo(centerX + spokeRadius * Math.cos(angle), centerY + spokeRadius * Math.sin(angle));
                context.stroke();
            }

            let innerRadius = radius * 0.1;
            context.beginPath();
            context.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI, false);
            context.fillStyle = "white";
            context.fill();
            context.stroke();
        }

// Change text below inflating tire during animation to help guide evCalc user

        function updateTireSize(psi) {
            let color;
            let psiAdviceText;
            
            if (psi >= 0 && psi < 10) {
              color = [0, 0, 0];
              psiAdviceText = "Hover tire to add air.";
            } else if (psi >= 10 && psi < 25) {
              let percent = (psi - 10) / 15;
              color = [Math.floor(0 + percent * (0 - 0)), Math.floor(255 * percent), Math.floor(0 + percent * (255 - 0))];
              psiAdviceText = "Great! This will improve efficiency.";
            } else if (psi >= 25 && psi < 45) {
              color = [0, 255, 0];
              psiAdviceText = "Check with manufacturer for best tire pressure.";
            } else if (psi >= 45 && psi < 60) {
              let percent = (psi - 45) / 15;
              color = [Math.floor(255 * percent), Math.floor(255 * (1 - percent)), 0];
              psiAdviceText = "Do not over-inflate!";
            } else if (psi == 60) {
                color = [255, 0, 0];
                psiValue.textContent = "POP!";
                psiAdviceText = "ssss.."
              } else {
                psiValue.textContent = psi + " PSI";
              }
              
            
            let radius = minRadius + (psi / 60) * (maxRadius - minRadius);
            drawTire(radius, 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')');
            drawRim(rimRadius);

            updateRange();

            psiAdvice.textContent = psiAdviceText;
          }  

// Animate tire, deflate tire @ 60 psi

        let psiRange = document.getElementById("psiRange");
        let intervalId = null;

        canvas.addEventListener("mouseenter", function () {
            intervalId = setInterval(function () {
                let psi = parseInt(psiRange.value) + 1;
                if (psi <= 60) {
                    psiRange.value = psi;
                    psiValue.textContent = psi + " PSI";
                    updateTireSize(psi);
                    if (psi > 40) {
                        clearInterval(intervalId);
                        intervalId = setInterval(function () {
                            let psi = parseInt(psiRange.value) + 1;
                            if (psi <= 60) {
                                psiRange.value = psi;
                                psiValue.textContent = psi + " PSI";
                                updateTireSize(psi);
                            } else {
                                // tire pop animation
                                let duration = 1000; // 2000ms = 2s
                                let startTime = new Date().getTime();
                                let endTime = startTime + duration;
                                let startPsi = psi;
                                let endPsi = 0;
                                let animationIntervalId = setInterval(function () {
                                    let now = new Date().getTime();
                                    let elapsed = now - startTime;
                                    if (elapsed < duration) {
                                        // interpolate psi between start and end values
                                        let psi = Math.round(startPsi - (startPsi - endPsi) * elapsed / duration);
                                        psiRange.value = psi;
                                        psiValue.textContent = psi + " PSI";
                                        updateTireSize(psi);
                                    } else {
                                        // end of animation, reset to 20 psi
                                        clearInterval(animationIntervalId);
                                        psiRange.value = 20;
                                        psiValue.textContent = "20 PSI";
                                        updateTireSize(0);
                                    }
                                }, 20); // 20ms = 50fps
                            }
                        }, 200); // 2000ms = 2s
                    }
                } else {
                    // tire pop animation
                    let duration = 1000; // 2000ms = 2s
                    let startTime = new Date().getTime();
                    let endTime = startTime + duration;
                    let startPsi = psi;
                    let endPsi = 0;
                    let animationIntervalId = setInterval(function () {
                        let now = new Date().getTime();
                        let elapsed = now - startTime;
                        if (elapsed < duration) {
                            // interpolate psi between start and end values
                            let psi = Math.round(startPsi - (startPsi - endPsi) * elapsed / duration);
                            psiRange.value = psi;
                            psiValue.textContent = psi + " PSI";
                            updateTireSize(psi);
                        } else {
                            // end of animation, reset to 0 psi
                            clearInterval(animationIntervalId);
                            psiRange.value = 20;
                            psiValue.textContent = "20 PSI";
                            updateTireSize(0);
                        }
                    }, 20); // 20ms = 50fps
                }
            }, 100);
        });
        
        canvas.addEventListener("mouseleave", function () {
            clearInterval(intervalId);
        });

        psiRange.addEventListener("input", function () {
            let psi = psiRange.value;
            psiValue.textContent = psi + " PSI";
            updateTireSize(psi);
        });

        updateTireSize(0);
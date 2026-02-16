(function () {
  const techList = document.getElementById("techList");
  const featuresList = document.getElementById("featuresList");

  const statTech = document.getElementById("statTech");
  const statFeat = document.getElementById("statFeat");

  if (techList && statTech) {
    statTech.textContent = String(techList.querySelectorAll("li").length);
  }

  if (featuresList && statFeat) {
    statFeat.textContent = String(featuresList.querySelectorAll("li").length);
  }
})();

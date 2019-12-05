function getFIScore() {
  var spending = document.getElementById('spending').value;
  var netWorth = document.getElementById('net-worth').value;
  var fiScore = document.getElementById('fi-score');
  var score = Math.round(netWorth / (spending * 25) * 100);
  fiScore.innerText = `You are ${score}% FI`;
  return score;
}

function getYearsToFI() {
  var spending = document.getElementById('spending').value;
  var netWorth = document.getElementById('net-worth').value;
  var savingsRate = document.getElementById('savings-rate').value;
  var statement = document.getElementById('years-to-fi');
  var necessaryNetWorth = spending * 25;
  var yearsToFi = 0;
  var expectedNetWorth = 0;
  while(necessaryNetWorth > expectedNetWorth) {
    expectedNetWorth = netWorth * (1.06) ** yearsToFi +
                       (savingsRate * (1.06) ** yearsToFi - 1) /
                       0.06;
    console.log('year ' + yearsToFi + ' net worth: ' + expectedNetWorth)
    yearsToFi++;
  }
  statement.innerText = `You're on pace to reach FI in ${yearsToFi} years.`;
  return yearsToFi;
}

function giveFISummary(score) {
  var statement = ''
  if(score >= 100) {
    statement = 'fi-summary-4';
  } else if(score >= 75 && score < 100) {
    statement = 'fi-summary-3';
  } else if(score >= 50 && score < 75) {
    statement = 'fi-summary-2';
  } else if(score > 0 && score < 50) {
    statement = 'fi-summary-1';
  } else {
    statement = 'fi-summary-1'
  }
  document.getElementById(statement).classList.remove('inactive')
}

function resetSummaries() {
  var summaries = document.getElementsByClassName('summary')
  for(var i = 0; i < summaries.length; i++) {
    summaries[i].classList.add('inactive')
  }
}

function calculateValues() {
  resetSummaries()
  var fiScore = getFIScore();
  var yearsToFi = getYearsToFI();
  giveFISummary(fiScore);
}

document.getElementById('submit').addEventListener('click', calculateValues);

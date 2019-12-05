function compoundInterestWithMonthlyContibutionsReturns(startingValue, monthlyContrib, years, rateOfReturn) {
    return startingValue * (1 + rateOfReturn) ** years + 
      (monthlyContrib * (1 + rateOfReturn) ** years - 1) / rateOfReturn;
}

function getFIScore() {
  var spending = document.getElementById('spending').value;
  var netWorth = document.getElementById('net-worth').value;
  var score = Math.round(netWorth / (spending * 25) * 100);
  return score;
}

function getYearsToFI() {
  var spending = document.getElementById('spending').value;
  var netWorth = document.getElementById('net-worth').value;
  var savingsRate = document.getElementById('savings-rate').value;
  var necessaryNetWorth = spending * 25;
  var yearsToFi = 1;
  var expectedNetWorth = 0;
  while(necessaryNetWorth > expectedNetWorth) {
    expectedNetWorth = compoundInterestWithMonthlyContibutionsReturns(netWorth, savingsRate, yearsToFi, 0.06);
    console.log('year ' + yearsToFi + ' net worth: ' + expectedNetWorth)
    yearsToFi++;
  }
  return yearsToFi;
}

function getChartValues() {
  var spending = document.getElementById('spending').value;
  var netWorth = document.getElementById('net-worth').value;
  var savingsRate = document.getElementById('savings-rate').value;
  var necessaryNetWorth = spending * 25;
  var yearsToFi = 1;
  var expectedNetWorth = 0;
  var chartValues = {}
  while(necessaryNetWorth > expectedNetWorth) {
    expectedNetWorth = compoundInterestWithMonthlyContibutionsReturns(netWorth, savingsRate, yearsToFi, 0.06);
    chartValues[`Year ${yearsToFi}`] = expectedNetWorth.toFixed(2);
    yearsToFi++;
  }
  return chartValues;
}

function getSavingsPercentage() {
  var grossIncome = parseInt(document.getElementById('gross-income').value);
  var savingsRate = document.getElementById('savings-rate').value * 12;
  return Math.round((savingsRate / grossIncome) * 100);
}

function resetSummaries() {
  var fiSummaries = document.getElementsByClassName('fi-summary');
  for(var i = 0; i < fiSummaries.length; i++) {
    fiSummaries[i].classList.add('inactive')
  }
}

function giveSummaries(fiScore, yearsToFi, savingsPercentage) {
  giveFISummary(fiScore);
  giveYearsToFiSummary(yearsToFi);
  giveSavingsSummary(savingsPercentage);
}

function giveFISummary(score) {
  var fiScore = document.getElementById('fi-score');
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
  fiScore.innerText = `You are ${score}% FI`;
  document.getElementById(statement).classList.remove('inactive')
}

function giveSavingsSummary(savingsPercentage) {
  var savingsStatement = document.getElementById('savings-percentage');
  savingsStatement.innerText = `You're currently saving ${savingsPercentage}% of your income`;
}

function giveYearsToFiSummary(yearsToFi) {
  var yearsToFiStatement = document.getElementById('years-to-fi');
  yearsToFiStatement.innerText = `You're on pace to reach FI in ${yearsToFi} years.`;
}

function calculateValues() {
  resetSummaries()
  var fiScore = getFIScore();
  var yearsToFi = getYearsToFI();
  var chartValues = getChartValues();
  var savingsPercentage = getSavingsPercentage();
  giveSummaries(fiScore, yearsToFi, savingsPercentage);
  makeChart(chartValues)
}

function makeChart(chartValues) {
  var ctx = document.getElementById('myChart');
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(chartValues),
      datasets: [{
        label: 'Net Worth $',
        data: Object.values(chartValues),
        backgroundColor: 'rgba(205, 38, 83, 0.2)',
        borderColor: 'rgba(205, 38, 83, 1)',
        borderWidth: 1,
      }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: false
                }
            }]
        }
    }
  })
}

document.getElementById('submit').addEventListener('click', calculateValues);

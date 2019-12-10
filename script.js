var myChart

function compoundInterestWithMonthlyContibutionsReturns(startingValue, monthlyContrib, years, rateOfReturn) {
  // assumes annual compounding
  // https://www.thecalculatorsite.com/articles/finance/future-value-formula.php
  return startingValue * ((1 + rateOfReturn)** years) + 
    ((monthlyContrib * 12) * (((1 + rateOfReturn)**years) - 1) / rateOfReturn);
}

function getFIValue() {
  var spending = parseInt(document.getElementById('spending').value);
  return spending * 25;
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
  var yearsToFi = 0;
  var expectedNetWorth = 0;
  while(necessaryNetWorth > expectedNetWorth) {
    expectedNetWorth = compoundInterestWithMonthlyContibutionsReturns(netWorth, savingsRate, yearsToFi, 0.06);
    yearsToFi++;
  }
  return yearsToFi - 1;
}

function getChartValues() {
  var spending = document.getElementById('spending').value;
  var netWorth = document.getElementById('net-worth').value;
  var savingsRate = document.getElementById('savings-rate').value;
  var necessaryNetWorth = spending * 25;
  var yearsToFi = 0;
  var expectedNetWorth = 0;
  var chartValues = {}
  while(necessaryNetWorth > expectedNetWorth) {
    expectedNetWorth = compoundInterestWithMonthlyContibutionsReturns(netWorth, savingsRate, yearsToFi, 0.06);
    chartValues[`Year ${yearsToFi}`] = expectedNetWorth.toFixed(2);
    yearsToFi++;
  }
  return chartValues;
}

function getAdjustedChartValues(yearsToFi) {
  var spending = document.getElementById('spending').value;
  var netWorth = document.getElementById('net-worth').value;
  var savingsRate = document.getElementById('savings-rate').value;
  var expectedNetWorth = 0;
  var adjustedChartValues = {}
  for(var i = 0; i <= yearsToFi; i++) {
    expectedNetWorth = compoundInterestWithMonthlyContibutionsReturns(netWorth, savingsRate * 2, i, 0.06);
    adjustedChartValues[`Year ${i}`] = expectedNetWorth.toFixed(2);
  }
  return adjustedChartValues;
}

function getSavingsPercentage() {
  var grossIncome = parseInt(document.getElementById('gross-income').value);
  var savingsRate = document.getElementById('savings-rate').value * 12;
  return Math.round((savingsRate / grossIncome) * 100);
}

function resetSummaries() {
  var fiSummaries = document.getElementsByClassName('fi-summary');
  var savingsSummaries = document.getElementsByClassName('savings-summary');
  var timeSummaries = document.getElementsByClassName('time-to-fi');
  for(var i = 0; i < fiSummaries.length; i++) {
    fiSummaries[i].classList.add('inactive')
    savingsSummaries[i].classList.add('inactive')
    timeSummaries[i].classList.add('inactive')
  }
  document.getElementById('fi-score').innerText = '';
  document.getElementById('savings-percentage').innerText = '';
  document.getElementById('years-to-fi').innerText = '';
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
  } else if(score >= 75) {
    statement = 'fi-summary-3';
  } else if(score >= 50) {
    statement = 'fi-summary-2';
  } else if(score > 0) {
    statement = 'fi-summary-1';
  } else {
    statement = 'fi-summary-0'
  }

  if(score || score === 0) {
    fiScore.innerText = `You are ${score}% FI`;
    document.getElementById(statement).classList.remove('inactive')
  }
}

function giveSavingsSummary(savingsPercentage) {
  var savingsStatement = document.getElementById('savings-percentage');
  var statementId;

  if(savingsPercentage < 10) {
    statementId = 'savings-summary-0';
  } else if(savingsPercentage < 20) {
    statementId = 'savings-summary-1';
  } else if(savingsPercentage < 50) {
    statementId = 'savings-summary-2';
  } else if(savingsPercentage <= 100) {
    statementId = 'savings-summary-3';
  } else if(savingsPercentage > 100) {
    statementId = 'savings-summary-4';
  }

  if(savingsPercentage) {
    savingsStatement.innerText = `You're currently saving ${savingsPercentage}% of your income`;
    document.getElementById(statementId).classList.remove('inactive');
  }
}

function giveYearsToFiSummary(yearsToFi) {
  var yearsToFiStatement = document.getElementById('years-to-fi');
  var statementId;
  if(yearsToFi >= 30) {
    statementId = 'time-to-fi-0';
  } else if(yearsToFi >= 20) {
    statementId = 'time-to-fi-1';
  } else if(yearsToFi >= 10) {
    statementId = 'time-to-fi-2';
  } else if(yearsToFi >= 1) {
    statementId = 'time-to-fi-3';
  } else if(yearsToFi < 1) {
    statementId = 'time-to-fi-4';
  }

  var willNotMakeIt = 'You\'re not on pace to reach FI!';
  var inProgressText = yearsToFi > 100 ? willNotMakeIt : `You're on pace to reach FI in ${yearsToFi} years.`;
  var finishedText = 'You\'ve made it to FI!'

  yearsToFiStatement.innerText = yearsToFi > 0 ? inProgressText : finishedText;
  document.getElementById(statementId).classList.remove('inactive');
}

function calculateValues() {
  resetSummaries()
  var fiValue = getFIValue();
  var fiScore = getFIScore();
  var yearsToFi = getYearsToFI();
  var chartValues = getChartValues();
  var adjustedChartValues = getAdjustedChartValues(yearsToFi);
  var savingsPercentage = getSavingsPercentage();
  giveSummaries(fiScore, yearsToFi, savingsPercentage);
  myChart ? updateChart(chartValues, adjustedChartValues, fiValue) : makeChart(chartValues, adjustedChartValues, fiValue);
}

function updateChart(chartValues, adjustedChartValues, fiValue) {
  myChart.data.labels = Object.keys(chartValues);
  myChart.data.datasets[0].data = Object.values(chartValues);
  myChart.data.datasets[1].data = Object.values(adjustedChartValues);
  myChart.data.datasets[2].data = new Array(Object.keys(chartValues).length).fill(fiValue);
  myChart.update();
}

function makeChart(chartValues, adjustedChartValues, fiValue) {
  var calcDescription = document.getElementById('calculator-description');
  var ctx = document.getElementById('myChart');
  calcDescription.classList.add('inactive');
  ctx.classList.remove('inactive');
  myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(chartValues),
      datasets: [{
          label: 'Your Net Worth',
          data: Object.values(chartValues),
          backgroundColor: 'rgba(205, 38, 83, 0.2)',
          borderColor: 'rgba(205, 38, 83, 1)',
          borderWidth: 1,
        },
        {
          label: 'If you doubled your savings rate',
          data: Object.values(adjustedChartValues),
          backgroundColor: 'rgba(126, 176, 155, 0.2)',
          borderColor: 'rgba(126, 176, 155, 1)',
          borderWidth: 1,
        },
        {
          label: 'FI Goal',
          data: new Array(Object.keys(chartValues).length).fill(fiValue),
          borderColor: 'rgba(65, 60, 88, 1)',
          backgroundColor: 'rgba(205, 38, 83, 0)',
          type: 'line',
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

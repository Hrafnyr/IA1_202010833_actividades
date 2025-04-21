async function fit_predict_draw() {
    const { PolynomialRegression, joinArrays } = await import('https://luisespino.github.io/mlearnjs/mlearn.mjs');

    const myPolynomialRegression = await PolynomialRegression(); 
    const model = new myPolynomialRegression(4);

    const X = [2,33,34,107,33,2,34,33,34,34,34,49,34,34,34,33,34,2,31,
               2,11,15,15,11,2,2,2,34,10]; //Aduana
    const y = [2,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,2,1,2,3,3,3,3,2,2,2,1,3]; //Vía

    model.fit(X, y);

    yPredict = model.predict(X)
    //console.log(yPredict);

    const myjoinArrays = await joinArrays();
    const arr = myjoinArrays('x', X, 'y', y, 'yPredict', yPredict);

    const log = document.getElementById('log');
    const yPred = yPredict.map(num => parseFloat(num.toFixed(2)));
    const mse = model.mse(y, yPredict);
    const r2 = model.r2(y, yPredict);
    log.innerHTML = 'X: '+X+'<br>y: '+y+'<br>yPredict: '+yPred;
    log.innerHTML += '<br>MSE: '+mse+'<br>Score (R²) polinomial: '+r2;

    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);    
    function drawChart() {
        var data = google.visualization.arrayToDataTable(arr);
        var options = {
            series: {
                0: {type: 'scatter'},
                1: {type: 'line', curveType: 'function'}}
        };  
        var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
        chart.draw(data, options);         
    }
}

fit_predict_draw();

let values ="";
async function fit_predict() {
    const { DecisionTreeClassifier, LabelEncoder, accuracyScore } = await import('https://luisespino.github.io/mlearnjs/mlearn.mjs');

    const PAIS = [1005, 2102, 2102, 2104, 2102, 3201, 2102, 2102, 2102, 2102,
        2102, 2102, 2102, 2102, 2102, 2102, 2102, 1005, 1007, 1005,
        1005, 3102, 3102, 1005, 1005, 1005, 1005, 2102, 4113];

    const VALOR =  [6000, 140591, 53105, 239047, 1278, 50, 225, 3107, 513754, 3182,
        3613, 515, 20160, 2097, 76581, 58392, 18668, 51551, 81200, 486980,
        138574, 579056, 37361, 286514, 1626, 2365, 11171, 7611, 937095];

    const ADUANA = [2, 33, 34, 107, 33, 2, 34, 33, 34, 34,
        34, 49, 34, 34, 34, 33, 34, 2, 31, 2,
        11, 15, 15, 11, 2, 2, 2, 34, 10];

    const VIA = [2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 
        1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 
        3, 3, 3, 3, 2, 2, 2, 1, 3];

    const table = PAIS.map((_, i) => [PAIS[i], VALOR[i], ADUANA[i], VIA[i]]);

    showTable(table);

    const etiquetaPais = PAIS.map(categorizarPais);
    const etiquetaValor = VALOR.map(categorizarValor);
    const etiquetaAduana = ADUANA.map(categorizarAduana);
    const etiquetaVia = VIA.map(categorizarVia);

    const tableNew = etiquetaPais.map((_, i) => [etiquetaPais[i],etiquetaValor[i], etiquetaAduana[i], etiquetaVia[i]]);
    showTable(tableNew);

    const myLabelEncoder = await LabelEncoder(); 
    const encoder = new myLabelEncoder();

    const enc1 = encoder.fitTransform(etiquetaPais);
    const enc2 = encoder.fitTransform(etiquetaValor);
    const enc3 = encoder.fitTransform(etiquetaAduana);
    const enc4 = encoder.fitTransform(etiquetaVia);

    const features = enc1.map((_, i) => [enc1[i], enc2[i], enc3[i]]);
     
    const myDecisionTree = await DecisionTreeClassifier(); 
    const model = new myDecisionTree();

    
    model.fit(features, enc4);

    const encYPredict = model.predict(features)
    const yPredict = encoder.inverseTransform(encYPredict);

    const myAccuracyScore = await accuracyScore();
    const accuracy = myAccuracyScore(enc4, encYPredict);

    const log = document.getElementById('logTree');
    log.innerHTML = '<br><br>LabelEncoder:<br>'+JSON.stringify(features, null, 2);
    log.innerHTML += '<br><br>Predict:<br>'+ JSON.stringify(yPredict, null, 2);
    log.innerHTML += '<br><br>AccuracyScore: '+accuracy;
    values = model.printTree(model.tree);
    log.innerHTML += '<br><br><strong>Descriptive tree:</strong><br>'+values;
    log.innerHTML += '<br><br><strong>Gain track:</strong><br>'+model.gain;
}

function showTable(table) {
    let container = document.getElementById('table-container');

    // Crear el elemento de la tabla
    let tableElement = document.createElement('table');

    // Crear la cabecera de la tabla
    let header = tableElement.createTHead();
    let headerRow = header.insertRow();
    let headers = ['PAIS', 'VALOR', 'ADUANA', 'VIA'];
    headers.forEach(headerText => {
        let cell = headerRow.insertCell();
        cell.textContent = headerText;
    });

    // Crear el cuerpo de la tabla
    let body = tableElement.createTBody();
    table.forEach(rowData => {
        let row = body.insertRow();
        rowData.forEach(cellData => {
            let cell = row.insertCell();
            cell.textContent = cellData;
        });
    });

    // Insertar la tabla en el contenedor
    container.appendChild(tableElement);
}

function categorizarPais(p) {
    if ([2102, 2104].includes(p)) return 'grupo_central';    // Muy frecuente
    if ([1005, 1007].includes(p)) return 'grupo_norte';      // Frecuente
    if ([3102, 3201].includes(p)) return 'grupo_sur';        // Menos frecuente
    if ([4113].includes(p)) return 'grupo_raro';             // Poco frecuente
    return 'grupo_desconocido';
}

function categorizarValor(v) {
    if (v < 1000) return 'muy_bajo';
    if (v < 10000) return 'bajo';
    if (v < 50000) return 'medio';
    if (v < 200000) return 'alto';
    return 'muy_alto';
}

function categorizarAduana(a) {
    // Aduanas principales por frecuencia
    if ([34, 33].includes(a)) return 'alta_frecuencia';
    if ([2, 11, 15].includes(a)) return 'media_frecuencia';
    return 'baja_frecuencia';
}

function categorizarVia(v) {
    if (v === 1) return 'terrestre';
    if (v === 2) return 'aerea';
    if (v === 3) return 'maritima';
    return 'desconocida';
}

//---------------------
function generateTreeGraph() {
    const nodes = [
        { id: 0, label: "Feature 2", shape: "box" },
        { id: 1, label: "Value: 0", shape: "box" },
        { id: 2, label: "Feature 1", shape: "box" },
        { id: 3, label: "Value: 0", shape: "box" },
        { id: 4, label: "Label: 0", shape: "box" },
        { id: 5, label: "Value: 3", shape: "box" },
        { id: 6, label: "Label: 0", shape: "box" },
        { id: 7, label: "Value: 1", shape: "box" },
        { id: 8, label: "Label: 2", shape: "box" },
        { id: 9, label: "Value: 2", shape: "box" },
        { id: 10, label: "Feature 0", shape: "box" },
        { id: 11, label: "Value: 0", shape: "box" },
        { id: 12, label: "Label: 2", shape: "box" },
        { id: 13, label: "Value: 2", shape: "box" },
        { id: 14, label: "Label: 2", shape: "box" },
        { id: 15, label: "Value: 4", shape: "box" },
        { id: 16, label: "Feature 0", shape: "box" },
        { id: 17, label: "Value: 2", shape: "box" },
        { id: 18, label: "Label: 2", shape: "box" },
        { id: 19, label: "Value: 0", shape: "box" },
        { id: 20, label: "Label: 0", shape: "box" },
        { id: 21, label: "Value: 1", shape: "box" },
        { id: 22, label: "Label: 1", shape: "box" },
        { id: 23, label: "Value: 2", shape: "box" },
        { id: 24, label: "Feature 0", shape: "box" },
        { id: 25, label: "Value: 1", shape: "box" },
        { id: 26, label: "Label: 1", shape: "box" },
        { id: 27, label: "Value: 0", shape: "box" },
        { id: 28, label: "Label: 1", shape: "box" },
        { id: 29, label: "Value: 3", shape: "box" },
        { id: 30, label: "Label: 2", shape: "box" }
    ];

    const edges = [
        { from: 0, to: 1 },
        { from: 1, to: 2 },
        { from: 2, to: 3 },
        { from: 3, to: 4 },
        { from: 2, to: 5 },
        { from: 5, to: 6 },
        { from: 2, to: 7 },
        { from: 7, to: 8 },
        { from: 2, to: 9 },
        { from: 9, to: 10 },
        { from: 10, to: 11 },
        { from: 11, to: 12 },
        { from: 10, to: 13 },
        { from: 13, to: 14 },
        { from: 2, to: 15 },
        { from: 15, to: 16 },
        { from: 16, to: 17 },
        { from: 17, to: 18 },
        { from: 16, to: 19 },
        { from: 19, to: 20 },
        { from: 0, to: 21 },
        { from: 21, to: 22 },
        { from: 0, to: 23 },
        { from: 23, to: 24 },
        { from: 24, to: 25 },
        { from: 25, to: 26 },
        { from: 24, to: 27 },
        { from: 27, to: 28 },
        { from: 24, to: 29 },
        { from: 29, to: 30 }
    ];

    const container = document.getElementById('graph-container');
    const data = {
        nodes: new vis.DataSet(nodes),
        edges: new vis.DataSet(edges)
    };
    const options = {
        layout: {
            hierarchical: {
                enabled: true,
                direction: "UD",
                sortMethod: "directed"
            }
        },
        edges: {
            arrows: { to: { enabled: true } },
            smooth: true
        },
        nodes: {
            font: { face: "monospace" },
            shape: "box"
        },
        physics: false
    };

    new vis.Network(container, data, options);
}


//---------------------

fit_predict();
generateTreeGraph();

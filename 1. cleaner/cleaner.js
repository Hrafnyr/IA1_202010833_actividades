// MIT License
// Copyright (c) 2020 Luis Espino
// Version Modificada: Moises David Maldonado de León

const price = {}; // Almacena el precio acumulada de cada estado
const visits = {}; // Almacena cuántas veces se ha visitado cada estado

// Se utilizar un estado aleatorio para "ensuciar"
function generate_random_dirt(states) {

  //Probabilidad del 40%
  if (Math.random() < 0.3) states[1] = "DIRTY";
  if (Math.random() < 0.2) states[2] = "DIRTY";
}

// Mostrar Estados visitados
function showStates(visited_states) {
    document.getElementById("info").innerHTML = "<br><strong>Estados visitados:</strong>";
    visited_states.forEach(state => {
        document.getElementById("info").innerHTML += "<br> " + state;
    });
}

function get_state_key(states) {
    return states.join("-");
}

// Inicializar estados
function initialize_state(states) {
    let key = get_state_key(states);
    if (!(key in price)) {
        price[key] = 0;
        visits[key] = 0;
    }
}

/* Implementación de monte carlo:
 1. Se asigna un precio a cada estado.
 2. El agente elige acciones basadas en el promedio de recompensas pasadas.
 3. Se evita caer en ciclos innecesarios.
 
 Se modifica la funcion inicial:
    function reflex_agent(location, state){
        if (state=="DIRTY") return "CLEAN";
        else if (location=="A") return "RIGHT";
        else if (location=="B") return "LEFT";
    }
 */

function monte_carlo_agent(state, states) {
    initialize_state(states);
    let key = get_state_key(states);
    
    if (state === "DIRTY") {
        price[key] += 1; // Precio por limpiar y contador de visita
        visits[key] += 1;
        return "CLEAN";
    } else {
        //Mover segun sea el precio basado en los precios
        let move_right = get_state_key(["B", states[1], states[2]]);
        let move_left = get_state_key(["A", states[1], states[2]]);
        
        let right_reward = price[move_right] || 0;
        let left_reward = price[move_left] || 0;
        
        if (right_reward > left_reward) return "RIGHT";
        else if (left_reward > right_reward) return "LEFT";
        else return Math.random() < 0.5 ? "RIGHT" : "LEFT"; //Tomar un valor aleatorio de cambio de Sala.
    }
}

// Se modifica la funcion test
function test(states, visited_states) {
  initialize_state(states)
  let location = states[0];
  let state = location == "A" ? states[1] : states[2];
  let action_result = monte_carlo_agent(state, states);
  let state_key = get_state_key(states)

  //Se agrega a la lista de visitados
  if (!visited_states.has(state_key)) {
      visited_states.add(state_key);
  }

  //Mostrar información
  document.getElementById("log").innerHTML += "<br><br>Location: " + location + " | Action: " + action_result;

  //Esta parte se queda sin cambios
  if (action_result == "CLEAN") {
      if (location == "A") states[1] = "CLEAN";
      else if (location == "B") states[2] = "CLEAN";
  } 
  else if (action_result == "RIGHT") states[0] = "B";
  else if (action_result == "LEFT") states[0] = "A";

  //Ensuciar aleatoriamente
  generate_random_dirt(states);

  //Verificar si ya se visitaron todos los estados, para parar
  if (visited_states.size < 8) {
      setTimeout(function () { test(states, visited_states); }, 2000);
  } else {
      document.getElementById("log").innerHTML += "<br><br>Todos los estados han sido visitados";
      showStates(visited_states);
    }
}

//---------------------------------------------
var states = ["A", "DIRTY", "DIRTY"];
var visited_states = new Set(); //Para guardar los estados visitados y detenerse
test(states, visited_states);

/* 
Notas finales:
Para las probabilidades de ensuciar. Valores alto hará que se tarde más.
Para el cambio de sala se puede evaluar tambien el comportamiento para que se quedé más
tiempo en una sala.
*/
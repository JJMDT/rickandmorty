const lista = document.getElementById('appRickAndMorty');
const URL = 'https://rickandmortyapi.com/api/character/';
const botonSiguiente = document.getElementById('botonCargarMas');
const botonAtras = document.getElementById('botonCargarMenos');
const nrPag = document.getElementById('numeroPagina');
const buscarP = document.getElementById('buscarPersonaje');
const botonBuscar = document.getElementById('botonBuscar');
const reset = document.getElementById('reset');
const selectStatus = document.getElementById('status');
const selectSpecies= document.getElementById('species');
const result = document.getElementById('resultados');
const paginacion = document.querySelector('.paginacion');



let pagina = 0;
let contador= 0 


  

function filtrarSpecies(species){
  lista.innerHTML='';
  fetch(URL+ `?species=${species}`)
  .then ((response) => response.json())
  .then ((data) => {
    const paginas =[];
    for (let i = 1; i <= data.info.pages; i++){
      paginas.push(
        fetch (URL + `?species=${species}&page=${i}`)
        .then((response)=> response.json())
      );     
    }
    Promise.all(paginas).then((data)=>{
      const personajes=data.reduce(
      (acc,curr) =>acc.concat(curr.results),[])
      mostrarLista(personajes);
      mostrarCantidadDePersonajes()
      document.getElementById('paginacion').style.display = 'none';

      contador=0
    });
  });
}
      
function mostrarMasResultadosFiltrados(status) {
  lista.innerHTML = '';
  fetch(URL + `?status=${status}`)
    .then((response) => response.json())
    .then((data) => {
      const paginas = [];
      for (let i = 1; i <= data.info.pages; i++) {
        paginas.push(
          fetch(URL + `?status=${status}&page=${i}`).then((response) =>
            response.json()
          
          )
        );
      }
      Promise.all(paginas).then((data) => {
        const personajes = data.reduce(
          (acc, curr) => acc.concat(curr.results),
          []
        );
        mostrarLista(personajes);
        mostrarCantidadDePersonajes()
        document.getElementById('paginacion').style.display = 'none';

      contador=0
      });
    });
}

selectSpecies.addEventListener('change', function (event) {
  const species = selectSpecies.value;
  filtrarSpecies(species);
});


selectStatus.addEventListener('change', function (event) {
  const status = selectStatus.value;
  mostrarMasResultadosFiltrados(status);
});

botonSiguiente.addEventListener('click',mostrarMas);


function resetear() {
  lista.innerHTML = '';
  pagina = 1;
  nrPag.innerHTML = ` Pagina ${pagina}`;
  actualizarBotones();
  fetch(URL + `?page=${pagina}`)
    .then((response) => response.json())
    .then((data) => mostrarLista(data.results));
    selectSpecies.value = 'ninguno';
    selectStatus.value = 'ninguno';
    resultados.innerHTML='';
    buscarP.value=''
    document.getElementById('paginacion').style.display = 'flex';




  }
reset.addEventListener('click', resetear);



mostrarMas()
function mostrarMas(){
  if (pagina >= 0){
    lista.innerHTML = '';
    pagina++;
    nrPag.innerHTML=` Pagina ${pagina}`
    actualizarBotones()
  }

  fetch(URL+`?page=${pagina}`)
      .then((response) => response.json())
      .then((data) => mostrarLista(data.results));
    }

    botonAtras.addEventListener('click', mostrarMenos)
    function mostrarMenos(){
      
      if ( pagina > 1){
        lista.innerHTML='';
        pagina--;
        nrPag.innerHTML=` Pagina ${pagina}`
      actualizarBotones() 
      } 

      fetch(URL+`?page=${pagina}`)
      .then((response) => response.json())
      .then((data) => mostrarLista(data.results));
    }

    botonBuscar.addEventListener('click',buscarPersonaje);

    function buscarPersonaje() {
      
      const nombre = buscarP.value;
      lista.innerHTML = '';
      
      fetch(URL + `?name=${nombre}`)
        .then((response) => response.json())
        .then((data) => {

          const paginas = [];
          for (let i = 1; i <= data.info.pages; i++) {
            paginas.push(
              fetch(URL + `?name=${nombre}&page=${i}`).then((response) =>
                response.json()
              )
            );
          }
          Promise.all(paginas).then((data) => {
            const personajes = data.reduce(
              (acc, curr) => acc.concat(curr.results),
              []
            );
            mostrarLista(personajes);
            mostrarCantidadDePersonajes()
            document.getElementById('paginacion').style.display = 'none';
            contador=0
          });
        });
    }
    function actualizarBotones(){
      if (pagina <= 1){
        botonAtras.disabled=true;
      } else {
        botonAtras.disabled=false;
      }
     
        if (pagina >= 42){
          botonSiguiente.disabled=true;
        } else {
          botonSiguiente.disabled=false;
        }
    }

  
    
    
 

          function mostrarLista(personaje){
          
            personaje.forEach((personaje) => {
            
              const div = document.createElement('div')
              let estadoClass = '';
                if (personaje.status === 'Alive') {
                  estadoClass = 'estadoGreen';
                } else if (personaje.status === 'Dead') {
                  estadoClass = 'estadoRed';
                } else {
                  estadoClass = 'estadoGray';
                }
              div.classList.add('cardPersonaje')
              div.innerHTML=`
              <div class="imgPersonaje">
              <img src="${personaje.image}">
              </div>
              <h5 class="nombre"> ${personaje.name}</h5>
              <p>#${personaje.id}</p>
              <p class="${estadoClass}"> ${personaje.status}</p>
              <p>Especie: ${personaje.species}</p>
              <p>Localizacion: ${personaje.location.name}</p>
              `
            lista.append(div);
            contador++;

          });
          console.log(pagina)
        }
          function mostrarCantidadDePersonajes(){
            resultados.innerHTML='numero de resultados ' + contador

          }

  


    
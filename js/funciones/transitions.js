// Inicializa el arrastre del ítem de transición y el drop en el timeline
function initializeTransitionsDragDrop() {
  const transitionItem = document.getElementById('transitionItem');
  transitionItem.addEventListener('dragstart', function(e) {
    // Se envía el tipo de transición (crossfade) y duración por defecto (1 segundo)
    e.dataTransfer.setData('text/plain', JSON.stringify({
      type: 'crossfade',
      duration: 1
    }));
  });
  
  // Listener de drop en el contenedor de pistas
  const tracksContainerEl = document.getElementById('tracksContainer');
  tracksContainerEl.addEventListener('dragover', function(e) {
    e.preventDefault();
  });
  tracksContainerEl.addEventListener('drop', function(e) {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    if (data) {
      let transitionData = JSON.parse(data);
      // Se calcula el tiempo de inicio en función de la posición x y PIXELS_PER_SECOND
      let x = e.offsetX;
      let startTime = x / PIXELS_PER_SECOND;
      createTransition(transitionData.type, startTime, transitionData.duration);
    }
  });
}

// Crea un nuevo objeto de transición y lo agrega al array global
function createTransition(type, startTime, duration) {
  let transition = {
    id: Date.now(), // ID basado en timestamp
    type: type,
    startTime: startTime,
    duration: duration
  };
  transitions.push(transition);
  renderTransitionOnTimeline(transition);
}

// Representa visualmente la transición en el timeline
function renderTransitionOnTimeline(transition) {
  const tracksContainerEl = document.getElementById('tracksContainer');
  const div = document.createElement('div');
  div.classList.add('transition');
  div.setAttribute('data-id', transition.id);
  // Posicionamiento según tiempo y duración
  div.style.position = 'absolute';
  div.style.left = (transition.startTime * PIXELS_PER_SECOND) + 'px';
  div.style.width = (transition.duration * PIXELS_PER_SECOND) + 'px';
  div.style.top = '0';
  div.style.height = '100%';
  // Estilos visuales
  div.style.backgroundColor = 'rgba(255,255,255,0.2)';
  div.style.border = '2px dashed var(--accent-color)';
  div.style.boxSizing = 'border-box';
  div.innerHTML = `<span style="position:absolute; top:0; left:0; color: var(--accent-color); font-size:0.8em;">${transition.type}</span>`;
  tracksContainerEl.appendChild(div);
}

// Inicializamos la funcionalidad de arrastre y drop
initializeTransitionsDragDrop();


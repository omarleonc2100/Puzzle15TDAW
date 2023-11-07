class Caja {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  
    obtenerCajaSuperior() {
      if (this.y === 0) return null;
      return new Caja(this.x, this.y - 1);
    }
  
    obtenerCajaDerecha() {
      if (this.x === 3) return null;
      return new Caja(this.x + 1, this.y);
    }
  
    obtenerCajaInferior() {
      if (this.y === 3) return null;
      return new Caja(this.x, this.y + 1);
    }
  
    obtenerCajaIzquierda() {
      if (this.x === 0) return null;
      return new Caja(this.x - 1, this.y);
    }
  
    obtenerCajasVecinas() {
      return [
        this.obtenerCajaSuperior(),
        this.obtenerCajaDerecha(),
        this.obtenerCajaInferior(),
        this.obtenerCajaIzquierda()
      ].filter(caja => caja !== null);
    }
  
    obtenerCajaVecinaAleatoria() {
      const cajasVecinas = this.obtenerCajasVecinas();
      return cajasVecinas[Math.floor(Math.random() * cajasVecinas.length)];
    }
  }
  
  const intercambiarCajas = (cuadricula, caja1, caja2) => {
    const temp = cuadricula[caja1.y][caja1.x];
    cuadricula[caja1.y][caja1.x] = cuadricula[caja2.y][caja2.x];
    cuadricula[caja2.y][caja2.x] = temp;
  };
  
  const estaResuelto = cuadricula => {
    return (
      cuadricula[0][0] === 1 &&
      cuadricula[0][1] === 2 &&
      cuadricula[0][2] === 3 &&
      cuadricula[0][3] === 4 &&
      cuadricula[1][0] === 5 &&
      cuadricula[1][1] === 6 &&
      cuadricula[1][2] === 7 &&
      cuadricula[1][3] === 8 &&
      cuadricula[2][0] === 9 &&
      cuadricula[2][1] === 10 &&
      cuadricula[2][2] === 11 &&
      cuadricula[2][3] === 12 &&
      cuadricula[3][0] === 13 &&
      cuadricula[3][1] === 14 &&
      cuadricula[3][2] === 15 &&
      cuadricula[3][3] === 0
    );
  };
  
  const obtenerCuadriculaAleatoria = () => {
    let cuadricula = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 0]];
  
    // Barajar
    let cajaVacia = new Caja(3, 3);
    for (let i = 0; i < 1000; i++) {
      const cajaVecinaAleatoria = cajaVacia.obtenerCajaVecinaAleatoria();
      intercambiarCajas(cuadricula, cajaVacia, cajaVecinaAleatoria);
      cajaVacia = cajaVecinaAleatoria;
    }
  
    if (estaResuelto(cuadricula)) return obtenerCuadriculaAleatoria();
    return cuadricula;
  };
  
  class Estado {
    constructor(cuadricula, movimiento, tiempo, estado) {
      this.cuadricula = cuadricula;
      this.movimiento = movimiento;
      this.tiempo = tiempo;
      this.estado = estado;
    }
  
    static listo() {
      return new Estado(
        [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
        0,
        0,
        "listo"
      );
    }
  
    static iniciar() {
      return new Estado(obtenerCuadriculaAleatoria(), 0, 0, "jugando");
    }
  }
  
  class Juego {
    constructor(estado) {
      this.estado = estado;
      this.idTemporizador = null;
      this.temporizador = this.temporizador.bind(this);
      this.renderizar();
      this.manejarClickCaja = this.manejarClickCaja.bind(this);
    }
  
    static listo() {
      return new Juego(Estado.listo());
    }
  
    temporizador() {
      this.establecerEstado({ tiempo: this.estado.tiempo + 1 });
    }
  
    establecerEstado(nuevoEstado) {
      this.estado = { ...this.estado, ...nuevoEstado };
      this.renderizar();
    }
  
    manejarClickCaja(caja) {
      return function() {
        const cajasVecinas = caja.obtenerCajasVecinas();
        const cajaVacia = cajasVecinas.find(
          cajaVecina => this.estado.cuadricula[cajaVecina.y][cajaVecina.x] === 0
        );
        if (cajaVacia) {
          const nuevaCuadricula = [...this.estado.cuadricula];
          intercambiarCajas(nuevaCuadricula, caja, cajaVacia);
          if (estaResuelto(nuevaCuadricula)) {
            clearInterval(this.idTemporizador);
            this.establecerEstado({
              estado: "ganado",
              cuadricula: nuevaCuadricula,
              movimiento: this.estado.movimiento + 1
            });
          } else {
            this.establecerEstado({
              cuadricula: nuevaCuadricula,
              movimiento: this.estado.movimiento + 1
            });
          }
        }
      }.bind(this);
    }
  
    renderizar() {
      const { cuadricula, movimiento, tiempo, estado } = this.estado;
  
      // Renderizar cuadricula
      const nuevaCuadricula = document.createElement("div");
      nuevaCuadricula.className = "cuadricula";
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          const boton = document.createElement("button");
  
          if (estado === "jugando") {
            boton.addEventListener("click", this.manejarClickCaja(new Caja(j, i)));
          }
  
          boton.textContent = cuadricula[i][j] === 0 ? "" : cuadricula[i][j].toString();
          nuevaCuadricula.appendChild(boton);
        }
      }
      document.querySelector(".cuadricula").replaceWith(nuevaCuadricula);
  
      // Renderizar botón
      const nuevoBoton = document.createElement("button");
      if (estado === "listo") nuevoBoton.textContent = "Jugar";
      if (estado === "jugando") nuevoBoton.textContent = "Reiniciar";
      if (estado === "ganado") nuevoBoton.textContent = "Jugar";
      nuevoBoton.addEventListener("click", () => {
        clearInterval(this.idTemporizador);
        this.idTemporizador = setInterval(this.temporizador, 1000);
        this.establecerEstado(Estado.iniciar());
      });
      document.querySelector(".pie button").replaceWith(nuevoBoton);
  
      // Renderizar movimiento
      document.getElementById("movimiento").textContent = `Movimiento: ${movimiento}`;
  
      // Renderizar tiempo
      document.getElementById("tiempo").textContent = `Tiempo: ${tiempo}`;
  
      // Renderizar mensaje
      if (estado === "ganado") {
        document.querySelector(".mensaje").textContent = "¡Ganaste!";
      } else {
        document.querySelector(".mensaje").textContent = "";
      }
    }
  }
  
  const JUEGO = Juego.listo();
  
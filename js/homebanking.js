//Declaración de variables
const nombreUsuario = "Mike Cardona";
const codigoSeguridad = "1234";
const servicios = [
    { nombre: "Agua", precio: 350, codigo: "1" },
    { nombre: "Telefono", precio: 425, codigo: "2" },
    { nombre: "Luz", precio: 210, codigo: "3" },
    { nombre: "Internet", precio: 570, codigo: "4" },
];
const cuentas = [
    { nombre: "Cuenta amiga 1", numeroCuenta: "1234567" },
    { nombre: "Cuenta amiga 2", numeroCuenta: "7654321" },
];
var saldoCuenta = 5000;
var limiteExtraccion = 3000;


//Ejecución de las funciones que actualizan los valores de las variables en el HTML.
window.onload = function() {
    iniciarSesion();
    cargarNombreEnPantalla();
    actualizarSaldoEnPantalla();
    actualizarLimiteEnPantalla();
}


//Funciones que tenes que completar
function cambiarLimiteDeExtraccion() {
    alertify.prompt( 'Ingrese el nuevo limite de extracción', '', '', 
                    function(evt, value) { 
                        limiteExtraccion = parseInt(value);
                        if (limiteExtraccion > saldoCuenta) {
                            alertify.error('No se pudo cambiar el limite por que el limite es mayor al saldo de la cuenta');
                        } else {
                            actualizarLimiteEnPantalla();
                            alertify.success(`El nuevo limite de extracción es: ${value} `) ;
                        }
                    }, 
                    function() { 
                        alertify.error('Cancelado') 
                    });
}

function extraerDinero() {
    var cantidad = 0;
    var saldoAnterior = saldoCuenta;
    alertify.prompt( 'Ingrese el valor a extraer', '', '', 
                    function(evt, value) { 
                        cantidad = parseInt(value);
                        if (haySaldoDisponible(cantidad)) {
                            saldoCuenta = restarDinero(cantidad);
                            actualizarSaldoEnPantalla();
                            alertify.success(`Saldo retirado: ${value} <br> 
                                              Saldo anterior: ${saldoAnterior} <br>
                                              Saldo actual ${saldoCuenta}`) ;
                        }
                    }, 
                    function() { 
                        alertify.error('Cancelado') 
                    });
                        
}

function haySaldoDisponible(cantidad) {
    if (cantidad > limiteExtraccion ) {
        alertify.error('La cantidad de dinero que intentas extraer es mayor a tu limite de extracion');
        return false;
    } else if(cantidad > saldoCuenta) { 
        alertify.error('No hay saldo suficiente en tu cuenta para extrar esa cantidad de dinero');
        return false;
    } else if (cantidad % 100) {
        alertify.error(`Solo se pueden extraer billetes de 100`);
        return false;
    }
    return true;
}

function depositarDinero() {
    var cantidad = 0;
    var saldoAnterior = saldoCuenta;
    alertify.prompt( 'Ingrese el valor a depositar', '', '', 
                    function(evt, value) { 
                        cantidad = parseInt(value);
                        saldoCuenta = sumarDinero(cantidad);
                        actualizarSaldoEnPantalla();
                        alertify.success(`Saldo depositado: ${value} <br> 
                                          Saldo anterior: ${saldoAnterior} <br>
                                          Saldo actual ${saldoCuenta}`) ;
                    }, 
                    function() { 
                        alertify.error('Cancelado') 
                    });
}

function pagarServicio() {
    var cadena = "";
    var servicio = "";
    var saldoAnterior = saldoCuenta;
    for(var i = 0; i < servicios.length; i++) {
        cadena += `${servicios[i].codigo} - ${servicios[i].nombre} <br>`;
    }
    alertify.prompt( `Ingrese el numero que corresponda al valor que queres pagar <br> ${cadena}`, '', '', 
                        function(evt, value) { 
                            servicio = value - 1;
                            if(validarServicios(servicio)){
                                saldoCuenta = restarDinero(servicios[servicio].precio);
                                actualizarSaldoEnPantalla();
                                alertify.success(`Has pagado el servido de ${servicios[servicio].nombre} <br>
                                                Saldo anterior: ${saldoAnterior} <br>
                                                Dinero descontado: ${value} <br> 
                                                Saldo actual ${saldoCuenta}`) ;
                            }
                        }, 
                        function() { 
                            alertify.error('Cancelado') 
                        });

}

function validarServicios(pos) {
    if ( servicios[pos] == undefined ) {
        alertify.error('No existe el servicio seleccionado') 
        return false
    } else if( servicios[pos].precio > saldoCuenta ) {
        alertify.error(`No hay saldo suficiente para pagar el servicio de ${servicios[pos].nombre}`) 
        return false
    }

    return true;
}

function transferirDinero() {
    var cantidad = 0;
    var saldoAnterior = saldoCuenta;

    alertify.prompt( 'Ingrese el valor a transferir', '', '', 
                    function(evt, value) { 
                        cantidad = parseInt(value);
                        if(cantidad <= saldoCuenta) {
                            alertify.prompt().destroy(); 
                            alertify.alert( 'Ingrese numero de cuenta', '<input type="text" class="ajs-input" id="cuentaID">', 
                                function(){ 
                                    if(validarCuenta(document.getElementById("cuentaID").value)) {
                                        saldoCuenta = restarDinero(cantidad);
                                        actualizarSaldoEnPantalla();
                                        alertify.success(`Se ha transferido: ${cantidad} <br> 
                                                          Cuenta destino: ${document.getElementById("cuentaID").value} `) ;
                                    } else {
                                        alertify.error('La cuenta no existe, no se puedo hacer la transferencia');
                                    }
                                });
                        } else {
                            alertify.error('No se puede transferir no se cuenta con el monto suficiente');
                        }
                    }, 
                    function() { 
                        alertify.error('Cancelado') 
                    });

}

function validarCuenta(numero) {
    for(var i = 0; i < cuentas.length; i++) {
        if (numero == cuentas[i].numeroCuenta) return true;
    }
    return false;
}

function iniciarSesion() {
    alertify.prompt( 'Ingrese el codigo de seguridad', '', '', 
                    function(evt, value) { 
                        if (value == codigoSeguridad){
                            alertify.prompt().destroy(); 
                            alertify.alert('Bienvenido',`Bienvenido ${nombreUsuario} ya puedes comenzar hacer tus actividades`);
                            saldoCuenta = 5000;
                            actualizarSaldoEnPantalla();
                            return true;
                        } else {
                            alertify.alert('Codigo incorrecto, tu dinero ha sido retenido por cuestiones de seguridad');
                            saldoCuenta = 0;
                            actualizarSaldoEnPantalla();
                            return false;
                        }
                    }, 
                    function() { 
                        alertify.error('Codigo incorrecto, tu dinero ha sido retenido por cuestiones de seguridad');
                        saldoCuenta = 0;
                        actualizarSaldoEnPantalla();
                        return false;
                    });
    
}

function sumarDinero(dinero){
    return saldoCuenta + parseInt(dinero);
}

function restarDinero(dinero){
    return saldoCuenta - parseInt(dinero);
}


//Funciones que actualizan el valor de las variables en el HTML
function cargarNombreEnPantalla() {
    document.getElementById("nombre").innerHTML = "Bienvenido/a " + nombreUsuario;
}

function actualizarSaldoEnPantalla() {
    document.getElementById("saldo-cuenta").innerHTML = "$" + saldoCuenta;
}

function actualizarLimiteEnPantalla() {
    document.getElementById("limite-extraccion").innerHTML = "Tu límite de extracción es: $" + limiteExtraccion;
}
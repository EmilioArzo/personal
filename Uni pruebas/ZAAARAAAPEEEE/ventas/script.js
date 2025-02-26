
        // Clase para manejar la comanda
        class GestorComanda {
            constructor() {
                this.items = [];
                this.ivaPorcentaje = 16; // 16% de IVA
            }
            
            // Agregar un producto a la comanda
            agregarProducto(id, nombre, precio) {
                // Verificar si el producto ya está en la comanda
                const itemExistente = this.items.find(item => item.id === id);
                
                if (itemExistente) {
                    // Si existe, incrementar la cantidad
                    itemExistente.cantidad++;
                    itemExistente.importe = itemExistente.precio * itemExistente.cantidad;
                } else {
                    // Si no existe, agregarlo a la comanda
                    this.items.push({
                        id: id,
                        nombre: nombre,
                        precio: precio,
                        cantidad: 1,
                        importe: precio
                    });
                }
                
                // Actualizar la vista de la comanda
                this.actualizarVistaComanda();
            }
            
            // Actualizar cantidad de un producto
            actualizarCantidad(id, nuevaCantidad) {
                // Encontrar el item por su ID
                const item = this.items.find(item => item.id === id);
                
                if (item) {
                    // Actualizar la cantidad y recalcular el importe
                    item.cantidad = nuevaCantidad;
                    item.importe = item.precio * item.cantidad;
                    
                    // Si la cantidad es 0, eliminar el item
                    if (nuevaCantidad <= 0) {
                        this.eliminarProducto(id);
                        return;
                    }
                    
                    // Actualizar la vista
                    this.actualizarVistaComanda();
                }
            }
            
            // Eliminar un producto de la comanda
            eliminarProducto(id) {
                // Filtrar el array para eliminar el item con el ID correspondiente
                this.items = this.items.filter(item => item.id !== id);
                
                // Actualizar la vista
                this.actualizarVistaComanda();
            }
            
            // Calcular subtotal
            calcularSubtotal() {
                return this.items.reduce((total, item) => total + item.importe, 0);
            }
            
            // Calcular IVA
            calcularIVA() {
                const subtotal = this.calcularSubtotal();
                return subtotal * (this.ivaPorcentaje / 100);
            }
            
            // Calcular total
            calcularTotal() {
                return this.calcularSubtotal() + this.calcularIVA();
            }
            
            // Actualizar la vista de la comanda
            actualizarVistaComanda() {
                const cuerpoComanda = document.getElementById('cuerpo-comanda');
                const subtotalElement = document.getElementById('subtotal');
                const ivaElement = document.getElementById('iva');
                const totalElement = document.getElementById('total');
                
                // Limpiar el cuerpo de la tabla
                cuerpoComanda.innerHTML = '';
                
                // Si no hay items, mostrar mensaje
                if (this.items.length === 0) {
                    cuerpoComanda.innerHTML = '<tr><td colspan="5" class="text-center">No hay productos en la comanda</td></tr>';
                    subtotalElement.textContent = '$0';
                    ivaElement.textContent = '$0';
                    totalElement.textContent = '$0';
                    return;
                }
                
                // Generar filas para cada item
                this.items.forEach(item => {
                    const fila = document.createElement('tr');
                    fila.innerHTML = `
                        <td>${item.nombre}</td>
                        <td>$${item.precio}</td>
                        <td>
                            <span class="boton-disminuir" data-id="${item.id}">-</span>
                            <span>${item.cantidad}</span>
                            <span class="boton-aumentar" data-id="${item.id}">+</span>
                        </td>
                        <td>$${item.importe}</td>
                        <td><span class="boton-eliminar" data-id="${item.id}">×</span></td>
                    `;
                    cuerpoComanda.appendChild(fila);
                });
                
                // Actualizar los totales
                const subtotal = this.calcularSubtotal();
                const iva = this.calcularIVA();
                const total = this.calcularTotal();
                
                subtotalElement.textContent = `${subtotal}`;
                ivaElement.textContent = `${iva.toFixed(0)}`;
                totalElement.textContent = `${total.toFixed(0)}`;
                
                // Agregar event listeners para los botones de la comanda
                this.agregarEventosComanda();
            }
            
            // Agregar eventos a los botones de la comanda
            agregarEventosComanda() {
                // Botones para aumentar cantidad
                document.querySelectorAll('.boton-aumentar').forEach(boton => {
                    boton.addEventListener('click', (e) => {
                        const id = e.target.dataset.id;
                        const item = this.items.find(item => item.id === id);
                        if (item) {
                            this.actualizarCantidad(id, item.cantidad + 1);
                        }
                    });
                });
                
                // Botones para disminuir cantidad
                document.querySelectorAll('.boton-disminuir').forEach(boton => {
                    boton.addEventListener('click', (e) => {
                        const id = e.target.dataset.id;
                        const item = this.items.find(item => item.id === id);
                        if (item && item.cantidad > 1) {
                            this.actualizarCantidad(id, item.cantidad - 1);
                        }
                    });
                });
                
                // Botones para eliminar producto
                document.querySelectorAll('.boton-eliminar').forEach(boton => {
                    boton.addEventListener('click', (e) => {
                        const id = e.target.dataset.id;
                        this.eliminarProducto(id);
                    });
                });
            }
            
            // Cancelar comanda
            cancelarComanda() {
                this.items = [];
                this.actualizarVistaComanda();
            }
            
            // Obtener los datos de la comanda para enviar al servidor
            obtenerDatosComanda() {
                return {
                    items: this.items,
                    subtotal: this.calcularSubtotal(),
                    iva: this.calcularIVA(),
                    total: this.calcularTotal(),
                    fecha: new Date().toISOString(),
                    usuario: "Ventas de mostrador"
                };
            }
        }
        
        // Clase para manejar el pago
        class ProcesadorPago {
            constructor() {
                this.modal = new bootstrap.Modal(document.getElementById('modal-pago'));
            }
            
            // Mostrar modal de pago
            mostrarModal() {
                this.modal.show();
            }
            
            // Ocultar modal de pago
            ocultarModal() {
                this.modal.hide();
            }
            
            // Procesar pago (simulación)
            procesarPago(datosTarjeta) {
                return new Promise((resolve, reject) => {
                    // Simulación: Si el número de tarjeta comienza con 4, el pago es exitoso
                    setTimeout(() => {
                        if (datosTarjeta.numeroTarjeta.startsWith('4')) {
                            resolve({ exitoso: true, mensaje: "Pago procesado correctamente" });
                        } else {
                            reject({ exitoso: false, mensaje: "Pago denegado. Verifique sus datos." });
                        }
                    }, 1500); // Simulamos una demora de 1.5 segundos
                });
            }
            
            // Enviar datos de la comanda al servidor (simulación)
            enviarComandaServidor(datosComanda) {
                return new Promise((resolve) => {
                    // Simulación de envío al servidor
                    setTimeout(() => {
                        console.log("Comanda enviada al servidor:", datosComanda);
                        resolve({ exitoso: true, mensaje: "Comanda registrada correctamente" });
                    }, 1000);
                });
            }
        }
        
        // Inicialización cuando se carga el documento
        document.addEventListener('DOMContentLoaded', function() {
            // Instanciar las clases
            const gestorComanda = new GestorComanda();
            const procesadorPago = new ProcesadorPago();
            
            // Agregar event listeners para botones de agregar productos
            document.querySelectorAll('.boton-agregar').forEach(boton => {
                boton.addEventListener('click', (e) => {
                    const id = e.target.dataset.id;
                    const nombre = e.target.dataset.nombre;
                    const precio = parseFloat(e.target.dataset.precio);
                    
                    gestorComanda.agregarProducto(id, nombre, precio);
                    
                    // Mostrar notificación
                    Swal.fire({
                        title: 'Producto agregado',
                        text: `${nombre} se ha agregado a tu comanda`,
                        icon: 'success',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 2000
                    });
                });
            });
            
            // Event listener para el botón de cancelar
            document.getElementById('boton-cancelar').addEventListener('click', () => {
                Swal.fire({
                    title: '¿Cancelar comanda?',
                    text: "Se eliminarán todos los productos de la comanda",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Sí, cancelar',
                    cancelButtonText: 'No, mantener'
                }).then((result) => {
                    if (result.isConfirmed) {
                        gestorComanda.cancelarComanda();
                        Swal.fire(
                            'Cancelada',
                            'La comanda ha sido cancelada',
                            'success'
                        );
                    }
                });
            });
            
            // Event listener para el botón de pagar
            document.getElementById('boton-pagar').addEventListener('click', () => {
                // Verificar si hay productos en la comanda
                if (gestorComanda.items.length === 0) {
                    Swal.fire({
                        title: 'Comanda vacía',
                        text: 'Agrega productos a la comanda para continuar',
                        icon: 'info'
                    });
                    return;
                }
                
                // Mostrar modal de pago
                procesadorPago.mostrarModal();
            });
            
            // Event listener para el formulario de pago
            document.getElementById('formulario-pago').addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Recopilar datos del formulario
                const datosTarjeta = {
                    nombreTitular: document.getElementById('nombre-titular').value,
                    numeroTarjeta: document.getElementById('numero-tarjeta').value.replace(/\s/g, ''),
                    fechaExpiracion: document.getElementById('fecha-expiracion').value,
                    codigoSeguridad: document.getElementById('codigo-seguridad').value
                };
                
                // Mostrar indicador de carga
                Swal.fire({
                    title: 'Procesando pago',
                    html: 'Por favor espere...',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
                
                // Procesar el pago
                procesadorPago.procesarPago(datosTarjeta)
                    .then((resultado) => {
                        // Pago exitoso
                        procesadorPago.ocultarModal();
                        
                        // Enviar datos de la comanda al servidor
                        return procesadorPago.enviarComandaServidor(gestorComanda.obtenerDatosComanda())
                            .then(() => {
                                // Mostrar mensaje de éxito
                                Swal.fire({
                                    title: '¡Pago exitoso!',
                                    text: 'Su pedido ha sido registrado correctamente',
                                    icon: 'success'
                                }).then(() => {
                                    // Limpiar la comanda
                                    gestorComanda.cancelarComanda();
                                });
                            });
                    })
                    .catch((error) => {
                        // Pago fallido
                        procesadorPago.ocultarModal();
                        
                        // Mostrar mensaje de error
                        Swal.fire({
                            title: 'Error en el pago',
                            text: error.mensaje,
                            icon: 'error'
                        });
                    });
            });
            
            // Formatear número de tarjeta
            document.getElementById('numero-tarjeta').addEventListener('input', function (e) {
                let valor = e.target.value.replace(/\D/g, '');
                let valorFormateado = '';
                
                for (let i = 0; i < valor.length; i++) {
                    if (i > 0 && i % 4 === 0) {
                        valorFormateado += ' ';
                    }
                    valorFormateado += valor.charAt(i);
                }
                
                e.target.value = valorFormateado;
            });
            
            // Formatear fecha de expiración
            document.getElementById('fecha-expiracion').addEventListener('input', function (e) {
                let valor = e.target.value.replace(/\D/g, '');
                
                if (valor.length > 2) {
                    e.target.value = valor.substring(0, 2) + '/' + valor.substring(2, 4);
                } else {
                    e.target.value = valor;
                }
            });
            
            // Limitar CVV a 3 o 4 dígitos
            document.getElementById('codigo-seguridad').addEventListener('input', function (e) {
                e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
            });
        });
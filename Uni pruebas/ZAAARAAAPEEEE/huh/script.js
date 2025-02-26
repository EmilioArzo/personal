        // Obtener el campo de entrada
        const nombreUsuario = document.getElementById('nombreUsuario');

        // Escuchar el evento 'input' para validar la entrada
        nombreUsuario.addEventListener('input', function (e) {
            // Reemplazar cualquier carácter que no sea letra o espacio
            e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
        });

        
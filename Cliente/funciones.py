import requests

correoglobal = ""
claveglobal = ""

#  #  ##  ####  ##      Cada función interactúa con una API RESTful utilizando la biblioteca requests de Python
## # #  #  #   #  #     para enviar solicitudes HTTP y procesar las respuestas, brindando funcionalidades como
# ## #  #  #   ####     registro de usuarios, autenticación, gestión de favoritos, bloqueo de usuarios y 
#  #  ##   #   #  #     obtención de información de usuarios.









def registro():

    # registro() 
    # solicita al usuario ingresar datos como nombre, correo, clave y descripción
    # para REGISTRAR un nuevo usuario a través de una solicitud POST a la API. 
    # Muestra mensajes de éxito o error según la respuesta recibida.

    nombre = input('Ingrese su nombre: ')
    correo = input('Ingrese su correo: ')
    clave = input('Ingrese su clave: ')
    descripcion = input('Ingrese su descripcion: ')

    if not nombre or not correo or not clave:
        print('Datos incompletos')
        return
    
    url = 'http://localhost:3000/api/registrar'

    data = {
        'nombre': nombre,
        'correo': correo,
        'clave': clave,
        'descripcion': descripcion
    }

    response = requests.post(url, json=data)

    if response.headers.get('Content-Type') == 'application/json':
        responseData = response.json()

        if "estado" in responseData:
            print(responseData["mensaje"])
        else:
            print("Error desconocido: ", response)
    else:
        print("Algo fue mal....")












def login():

    # login() 
    # permite al usuario INICIAR SESIÓN ingresando correo y clave. 
    # Realiza una solicitud GET a la API de login y verifica las credenciales. 
    # Guarda el correo y la clave globalmente si las credenciales son correctas.

    global correoglobal, claveglobal
    url = "http://localhost:3000/api/login"

    correo = input("Introduce tu correo: ")
    clave = input("Introduce tu clave: ")

    params = {
        "correo": correo,
        "clave": clave
    }

    response = requests.get(url, params=params)
    data = response.json()

    if response.status_code == 200 and data["estado"] == 200:
        if data["credenciales_correctas"]:
            print("\n")
            print("Inicio de sesión exitoso!")
            print("Bienvenido a ComuniKen!")
            correoglobal = correo
            claveglobal = clave
            return True
        else:
            print("\n")
            print("Credenciales incorrectas. Por favor, intenta de nuevo.")
            return False
    else:
        print("Error:", data["mensaje"])
        return False

















def bloquear_usuario():

    # bloquear_usuario()
    # permite al usuario BLOQUEAR a otro usuario ingresando el correo del usuario a bloquear. 
    # Realiza una solicitud POST a la API de bloquear 
    # y muestra mensajes de éxito o error según la respuesta recibida.

    global correoglobal, claveglobal
    correo_bloqueado = input("Ingrese el correo del usuario que desea bloquear: ")

    if not correo_bloqueado or not correoglobal or not claveglobal:
        print("Datos incompletos")
        return
    
    url = "http://localhost:3000/api/bloquear"
    payload = {
        "correo": correoglobal,
        "correo_bloqueado": correo_bloqueado
    }
    response = requests.post(url, json=payload)

    if response.headers.get('Content-Type') == 'application/json':
        responsePlayload = response.json()

        if "estado" in responsePlayload:
            print(responsePlayload["mensaje"])
        else:
            print("Error desconocido: ", response)
    else:   
        print("Algo fue mal....")














def mark_fav():

    # mark_fav()
    # permite al usuario MARCAR a otro usuario COMO FAVORITO ingresando su correo. 
    # Realiza una solicitud POST a la API de marcarFAV 
    # y muestra mensajes de éxito o error según la respuesta recibida.

    global correoglobal
    correo_favorito = input("Ingrese el correo del usuario que desea marcar como favorito: ")

    if not correo_favorito or not correoglobal:
        print("Datos incompletos")
        return
    
    
    url = "http://localhost:3000/api/marcarFAV"

    payload = {
        "correo": correoglobal,
        "correo_favorito": correo_favorito
    }
    response = requests.post(url, json=payload)

    if response.headers.get('Content-Type') == 'application/json':
        responsePlayload = response.json()

        if "estado" in responsePlayload:
            print(responsePlayload["mensaje"])
        else:
            print("Error desconocido: ", response)
    else:   
        print("Algo fue mal....")

















def desmark_fav():

    # desmark_fav(): Permite al usuario DESMARCAR a otro usuario como favorito ingresando su correo. 
    # Realiza una solicitud DELETE a la API de desmarcarFAV 
    # y muestra mensajes de éxito o error según la respuesta recibida.

    global correoglobal
    correo_favorito = input("Ingrese el correo del usuario que desea desmarcar como favorito: ")

    if not correo_favorito or not correoglobal:
        print("Datos incompletos")
        return
    
    url = "http://localhost:3000/api/desmarcarFAV"
    params = {
        "correo": correoglobal,
        "correo_favorito": correo_favorito
    }

    response = requests.delete(url, params=params)

    if response.headers.get('Content-Type') == 'application/json':
        response_payload = response.json()

        if response_payload.get("status") == 200:
            print(response_payload["message"])
        else:
            print(response_payload.get("message", "Error desconocido"))
    else:   
        print("Algo fue mal....")

















def informacion ():

    # informacion()
    # permite al usuario OBTENER INFORMACIÓN de otro ingresando su correo. 
    # Realiza una solicitud GET a la API de informacion 
    # y muestra la información del usuario si (y sólo si) la solicitud es exitosa.

    correo = input("Ingrese el correo del usuario del que desea obtener informacion: ")
    
    if not correo:
        print("Datos incompletos")
        return
    

    url = "http://localhost:3000/api/informacion"


    playload = {
        "correo_informacion": correo
    }
    
    response = requests.get(url, params=playload)
    if response.status_code == 200:


        responsePlayload = response.json()
        
        if "status" in responsePlayload:
            # Mensajes de éxito
            if responsePlayload["status"] == 200:
                print("\nInformación del usuario: ")
                for key in responsePlayload["data"]:
                    print(key + ": " + responsePlayload["data"][key])
                print("\n")
            # Mensajes de error
            else:
                print("\n" + responsePlayload["mensaje"])
        else:
            print("Error desconocido:", response.status_code)

    else:
        print(f"Error {response.status_code} al intentar obtener la información del usuario.")





















def mostrarFAV(): 

    # mostrarFAV(): MUESTRA los usuarios FAVORITOS del usuario actual (utilizando el correo global). 
    # Realiza una solicitud GET a la API de favoritos 
    # y muestra los resultados si la solicitud es exitosa.

    correo = correoglobal

    url = "http://localhost:3000/api/favoritos"  
    params = {
        "correo": correo
    }

    try:
        response = requests.get(url, params=params)

        if response.status_code == 200:
            response_payload = response.json()

            if response_payload.get("status") == 200:
                print("Usuarios favoritos:")
                for fav in response_payload["data"]:
                    print(fav)
            else:
                print(response_payload.get("message", "Error desconocido"))
        else:
            print(f"Error: {response.status_code} - {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"Error de conexión: {e}")



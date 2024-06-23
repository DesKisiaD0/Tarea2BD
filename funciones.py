import requests

correoglobal = ""
claveglobal = ""





def verificar_conexion():
    try:
        response = requests.get("http://localhost:3000/api")
        if response.status_code == 200:
            print("Conexión al servidor exitosa.")
            return True
        else:
            print("Servidor no disponible. Código de estado:", response.status_code)
            return False
    except requests.exceptions.RequestException as e:
        print("Error al conectar con el servidor:", e)
        return False







def registro():
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
            print("Inicio de sesión exitoso!")
            correoglobal = correo
            claveglobal = clave
            return True
        else:
            print("Credenciales incorrectas. Por favor, intenta de nuevo.")
            return False
    else:
        print("Error:", data["mensaje"])
        return False

















def bloquear_usuario():
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
    global correoglobal
    correo_favorito = input("Ingrese el correo del usuario que desea desmarcar como favorito: ")

    if not correo_favorito or not correoglobal:
        print("Datos incompletos")
        return
    
    url = "http://localhost:3000/api/desmarcarFAV"

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


















def informacion ():
    correo = input("Ingrese el correo del usuario del que desea obtener informacion: ")
    
    if not correo:
        print("Datos incompletos")
        return
    

    url = "http://localhost:3000/api/informacion"


    payload = {
        "correo_informacion": correo
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





















def mostrarFAV():
    correo = input("Ingrese el correo del usuario del que desea obtener los favoritos: ")

    url = "http://localhost:3000/api/favoritos"
    payload = {
        "correo": correo
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



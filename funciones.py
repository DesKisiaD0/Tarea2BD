import requests


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
        response = response.json()

        if "estado" in response:
            print(response["mensaje"])
        else:
            print("Error desconocido: ", response)
    else:
        print("Algo fue mal....")



def login():
    global correoglobal, claveglobal
    correo = input('Ingrese su correo: ')
    clave = input('Ingrese su clave: ')

    if not correo or not clave:
        print('Datos incompletos')
        return
    
    url = 'http://localhost:3000/api/login'

    data = {
        'correo': correo,
        'clave': clave
    }

    response = requests.post(url, json=data)

    if response.headers.get('Content-Type') == 'application/json':
        response = response.json()

        if "estado" in response:
            print(response["mensaje"])
            if response["estado"]:
                correoglobal = correo
                claveglobal = clave
        else:
            print("Error desconocido: ", response)
    else:
        print("Algo fue mal....")




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
        response = response.json()

        if "estado" in response:
            print(response["mensaje"])
        else:
            print("Error desconocido: ", response)
    else:   
        print("Algo fue mal....")



def mark_fav():
    global correoglobal, claveglobal
    correo_favorito = input("Ingrese el correo del usuario que desea marcar como favorito: ")

    if not correo_favorito or not correoglobal or not claveglobal:
        print("Datos incompletos")
        return
    
    url = "http://localhost:3000/api/marcarFAV"
    payload = {
        "correo": correoglobal,
        "clave": claveglobal,
        "correo_favorito": correo_favorito
    }
    response = requests.post(url, json=payload)

    if response.headers.get('Content-Type') == 'application/json':
        response = response.json()

        if "estado" in response:
            print(response["mensaje"])
        else:
            print("Error desconocido: ", response)
    else:   
        print("Algo fue mal....")


def desmark_fav():
    global correoglobal, claveglobal
    correo_favorito = input("Ingrese el correo del usuario que desea desmarcar como favorito: ")

    if not correo_favorito or not correoglobal or not claveglobal:
        print("Datos incompletos")
        return
    
    url = "http://localhost:3000/api/desmarcarFAV"
    payload = {
        "correo": correoglobal,
        "clave": claveglobal,
        "correo_favorito": correo_favorito
    }
    response = requests.post(url, json=payload)

    if response.headers.get('Content-Type') == 'application/json':
        response = response.json()

        if "estado" in response:
            print(response["mensaje"])
        else:
            print("Error desconocido: ", response)
    else:   
        print("Algo fue mal....")

def informacion ():
    correo = input("Ingrese el correo del usuario del que desea obtener informacion: ")
    
    url = "http://localhost:3000/api/informacion"
    payload = {
        "correo_informacion": correo
    }
    response = requests.post(url, json=payload)

    if response.headers.get('Content-Type') == 'application/json':
        response = response.json()

        if "estado" in response:
            print(response["mensaje"])
        else:
            print("Error desconocido: ", response)
    else:   
        print("Algo fue mal....")




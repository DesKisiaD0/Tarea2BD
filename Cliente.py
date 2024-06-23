from funciones import *
import requests
import sys

MENU_INICIO = """
1. Registrarse
2. Iniciar sesion
3. Salir
"""

MENU_USUARIO = """
1. Ver informacion de una direccion de correo electronico
2. Bloquear un usuario
3. Marcar usuario como favorito
4. Desmarcar usuario como favorito
5. Mostrar usuarios favoritos
6. Salir
"""

MENU_SALIR = """
Hasta luego
"""

def mostrar_inicio():
    print(MENU_INICIO)
    opcion = input("Ingrese una opcion: ")
    return opcion

def mostrar_usuario():
    print(MENU_USUARIO)
    opcion = input("Ingrese una opcion: ")
    return opcion


def main():
    print("Bienvenido a la aplicacion de correo electronico")


    while True:
        opcion = mostrar_usuario()

        case = {
            "1": informacion,
            "2": bloquear_usuario,
            "3": mark_fav,
            "4": desmark_fav,
            "5": mostrarFAV,
            "6": lambda: print(MENU_SALIR)
        }

        out = case.get(opcion)
        if out:
            out()
            if opcion == "6":
                break
        else:
            print("Opcion no valida")


verificar_conexion()
while True:
    opcion = mostrar_inicio()
    if opcion == "1":
        registro()
    elif opcion == "2":
        login()
        main()
    elif opcion == "3":
        print(MENU_SALIR)
        break
    else:
        print("Opcion no valida")

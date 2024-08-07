# Bootcamp DevOps by RoxsRoss
![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=black)
![Node.js](https://img.shields.io/badge/-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![HTML5](https://img.shields.io/badge/-HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![Terraform](https://img.shields.io/badge/terraform-7B42BC?logo=terraform&logoColor=white&style=for-the-badge)
![VSCode](https://img.shields.io/badge/Visual_Studio_Code-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white)
![kubernetes](https://img.shields.io/badge/kubernetes-326CE5?logo=kubernetes&logoColor=white&style=for-the-badge)
![Azure](https://img.shields.io/badge/azure-0078D4?logo=microsoft-azure&logoColor=white&style=for-the-badge)
![Amazon](https://img.shields.io/badge/Amazon_AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Gcp](https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)
![Docker](https://img.shields.io/badge/docker-2496ED?logo=docker&logoColor=white&style=for-the-badge)
![python](https://img.shields.io/badge/python-3776AB?logo=python&logoColor=white&style=for-the-badge)
![golang](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)
![github Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)
![Gitlab](https://img.shields.io/badge/GitLab-330F63?style=for-the-badge&logo=gitlab&logoColor=white)
![Jenkins](	https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=Jenkins&logoColor=white)
![city](https://img.shields.io/badge/TeamCity-000000?style=for-the-badge&logo=TeamCity&logoColor=white)

---
![](https://github.com/roxsross/roxsross/blob/main/images/roxsross-banner-1.png)

🔥🔥🔥🔥

# tetris
Aplicación web Tetris usando Flask en el backend y p5.js en el frontend.

## Introducción
Este proyecto funciona como un servidor Flask con el que los usuarios pueden interactuar a través de su navegador, conociendo la IP de la máquina que lo está sirviendo y el puerto, que por defecto es 8080. Se muestra en el lado del cliente utilizando la biblioteca p5.js.

Intenta imitar la experiencia de Tetris en NES en términos de velocidad de caída y asignación de puntuaciones. La visualización de los elementos en el lienzo también es similar a la de NES Tetris. La mecánica del modo de juego en dúo está completamente inspirada en Tengen Tetris. Finalmente, la estética ha sido llevada a un estilo retro-cyberpunk, como si estuvieras jugando en una antigua pantalla verde de fósforo mientras el mundo se desmorona debido al despertar de los cyborgs.

Hay una tabla de puntuaciones en la que los jugadores pueden subir sus puntuaciones más altas y competir.

![Captura de pantalla del modo dúo](https://github.com/aitorperezzz/tengen-tetris/blob/master/images/tengen_readme.png)

## Modos de juego
Hay dos modos de juego:
* **Individual**: Jugarás solo. Puedes pausar y salir del juego. Podrás enviar tu puntuación más alta al servidor una vez que mueras.
* **Dúo**: Haz clic en *Buscar otro jugador* y una vez que otro usuario haga lo mismo en su cliente, ambos iniciarán un juego en dúo. Selecciona el nivel al principio (cada uno puede seleccionar su propio nivel) y juega. Podrás ver la pantalla de tu oponente a la derecha de la tuya para seguir sus movimientos. Las mismas piezas caerán para ambos, incluso si mueres y decides intentarlo de nuevo.

## Cómo ejecutarlo en tu máquina

1. `cd` a un nuevo directorio.
2. Clona este repositorio con `git clone`.
3. Esto funciona con Python 3, así que asegúrate de tenerlo instalado.
4. Asegúrate de tener el paquete `pip3` para la instalación de dependencias de Python 3. En Ubuntu, se puede instalar ejecutando `apt install python3-pip`. Con ello, instala las siguientes dependencias:
   * `pip3 install flask`
   * `pip3 install flask_socketio`
   * `pip3 install gevent-websockets`
5. Requiere la variable `DB_FILENAME` con el nombre de la base de datos ejemplo tetris.db
6. Ejecuta el servidor con `python3 application.py` o ejecútalo en segundo plano con `nohup python3 application.py > out.log &`.
7. Abre un navegador web y conéctate a `localhost:8080`. Si puedes ver una página, todo ha funcionado correctamente.
8. Averigua la dirección IP de tu máquina ejecutando `ip a`, y desde otro ordenador en la misma red, conéctate a `<ip>:8080`.

# ¡Dale una Estrella! ⭐

***Si estás planeando usar este repositorio para aprender, por favor dale una estrella. ¡Gracias!***


> Recuerda documentar los pasos y decisiones tomadas durante la configuraciónde este proyecto ¡Buena suerte!
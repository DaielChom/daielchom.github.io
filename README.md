# Curriculum vitae

Curriculum disponible en el sitio [web](daielchom.github.io) y elaborado usando [react-resume-template](https://github.com/tbakerx/react-resume-template), una plantilla de react para el Curriculum.

#### Dependencias
Se requiere de node y npm

* [node](https://nodejs.org/en/download/package-manager/)
* npm `sudo apt-get install npm`


#### Instalación
Para instalar el repositorio.

    $ git clone https://github.com/DaielChom/daielchom.github.io.git
    $ cd daielchom.github.io/resume
    $ npm install

#### Edición
Si se desean realizar cambios en la plantilla

    $ cd daielchom.github.io
    $ rm -rf ./css ./images ./js ./static asset-manifest.json favicon.ico index.html manifest.json resumeData.json service-worker.js
    $ cd resume
    $ npm start
  Se montará el proyecto en un servidor local. Editar los documentos en `public` o `src`.</br>
  Una vez terminados los cambios.

    $ npm run build

  Se generará el proyecto en un nuevo directorio `build`. Copiar el contenido de dicho directorio en el directorio `daielchom.github.io` para que Github tome el archivo index y lo monte en la pagina `.io`

### Convertir JSON a PDF
Instrucciones si se quiere actualizar el `pdf` del curriculum.

    $ cd documents
    $ sudo npm install hackmyresume -g
    $ sudo apt-get install wkhtmltopdf
    $ npm i jsonresume-theme-stackoverflow
    $ hackmyresume build resume.json to Daniel_C_Patiño.pdf -t node_modules/jsonresume-theme-stackoverflow

* jsonresume-theme-stackoverflow
* jsonresume-theme-short
* jsonresume-theme-flat

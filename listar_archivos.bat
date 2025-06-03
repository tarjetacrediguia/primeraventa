@echo off
setlocal enabledelayedexpansion

:: Verificar si se proporcionó una carpeta
if "%~1"=="" (
    set "carpeta=."
) else (
    set "carpeta=%~1"
)

:: Configurar archivo de salida
set "archivo_salida=lista_rutas.txt"

:: Eliminar archivo anterior si existe
if exist "%archivo_salida%" del "%archivo_salida%"

:: Obtener y guardar las rutas
echo Recopilando rutas de archivos en %carpeta%...
for /r "%carpeta%" %%a in (*) do (
    echo %%a >> "%archivo_salida%"
)

echo Listado completado. Resultados guardados en: %archivo_salida%
endlocal
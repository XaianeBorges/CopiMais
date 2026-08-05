@echo off
REM Iniciar CopiMais (Windows) e abrir navegador automaticamente quando disponível
SETLOCAL ENABLEDELAYEDEXPANSION
SET JAR_NAME=copimais.jar
SET DIR=%~dp0

REM Inicia o servidor em uma nova janela (usa jre local se existir)
IF EXIST "%DIR%jre\bin\java.exe" (
    start "CopiMais Server" "%DIR%jre\bin\java.exe" -Xms256m -Xmx1024m -jar "%DIR%%JAR_NAME%"
) ELSE (
    start "CopiMais Server" java -Xms256m -Xmx1024m -jar "%DIR%%JAR_NAME%"
)

REM Aguarda o servidor responder em http://localhost:8080/ (até ~30s)
SET /A COUNT=0
:WAIT_LOOP
powershell -Command "try { Invoke-WebRequest -Uri 'http://localhost:8080/' -UseBasicParsing -TimeoutSec 2 > $null; exit 0 } catch { exit 1 }"
IF %ERRORLEVEL% EQU 0 GOTO OPEN_BROWSER
TIMEOUT /T 1 >NUL
SET /A COUNT+=1
IF %COUNT% GEQ 30 GOTO OPEN_BROWSER
GOTO WAIT_LOOP

:OPEN_BROWSER
start "" "http://localhost:8080/"
ENDLOCAL
EXIT /B 0
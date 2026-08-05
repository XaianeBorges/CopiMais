@echo off
REM Iniciar CopiMais (Windows)
SETLOCAL
SET JAR_NAME=copimais.jar

REM Se existir uma JRE no pacote (pasta jre), usa ela; senão usa java do PATH
IF EXIST "%~dp0jre\bin\java.exe" (
  "%~dp0jre\bin\java.exe" -Xms256m -Xmx1024m -jar "%~dp0%JAR_NAME%"
) ELSE (
  java -Xms256m -Xmx1024m -jar "%~dp0%JAR_NAME%"
)
ENDLOCAL
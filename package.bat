@echo off
REM Builda o JAR e cria uma distribuicao nativa com o icone do CopiMais.
SETLOCAL

SET "ROOT=%~dp0"
SET "PACKAGE_TYPE=%~1"
IF "%PACKAGE_TYPE%"=="" SET "PACKAGE_TYPE=app-image"
IF /I NOT "%PACKAGE_TYPE%"=="app-image" IF /I NOT "%PACKAGE_TYPE%"=="exe" (
    echo Uso: package.bat [app-image^|exe]
    EXIT /B 2
)

CALL "%ROOT%mvnw.cmd" -q clean package -DskipTests
IF ERRORLEVEL 1 (
    echo Erro ao gerar o JAR.
    EXIT /B 1
)

IF EXIST "%ROOT%dist_package" RMDIR /S /Q "%ROOT%dist_package"

SET "JPACKAGE=jpackage"
IF EXIST "%JAVA_HOME%\bin\jpackage.exe" SET "JPACKAGE=%JAVA_HOME%\bin\jpackage.exe"

"%JPACKAGE%" ^
    --type "%PACKAGE_TYPE%" ^
    --dest "%ROOT%dist_package" ^
    --input "%ROOT%target" ^
    --name "CopiMais" ^
    --main-jar "copimais.jar" ^
    --icon "%ROOT%frontend\public\favicon.ico" ^
    --app-version "1.0.0" ^
    --vendor "CopiMais"
IF ERRORLEVEL 1 (
    echo Erro ao criar a distribuicao. Para --type exe, instale o WiX Toolset.
    EXIT /B 1
)

echo Distribuicao criada em "%ROOT%dist_package".
ENDLOCAL
EXIT /B 0

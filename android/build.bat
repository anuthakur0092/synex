@echo off
REM Simple wrapper to run gradlew with Java 17+ requirement handling
REM Download Java 17 from: https://adoptium.net/download/

REM Try common installation paths
if exist "C:\Program Files\Java\jdk-17\bin\java.exe" (
    set "JAVA_HOME=C:\Program Files\Java\jdk-17"
    goto :found
)

if exist "C:\Program Files\Eclipse Adoptium\jdk-17.0.11.9-hotspot\bin\java.exe" (
    set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.11.9-hotspot"
    goto :found
)

if exist "%LOCALAPPDATA%\Programs\Eclipse Adoptium\jdk-17.0.11.9-hotspot\bin\java.exe" (
    set "JAVA_HOME=%LOCALAPPDATA%\Programs\Eclipse Adoptium\jdk-17.0.11.9-hotspot"
    goto :found
)

echo ERROR: Java 17+ not found in common locations
echo Please install Java 17 from: https://adoptium.net/download/
echo And set JAVA_HOME environment variable
pause
exit /b 1

:found
echo Using Java from: %JAVA_HOME%
call gradlew.bat %*

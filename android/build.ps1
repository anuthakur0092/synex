# PowerShell wrapper script for gradlew with Java 17+ requirement handling
# Download Java 17 from: https://adoptium.net/download/

# Common Java 17 installation paths to check
$javaPaths = @(
    "C:\Program Files\Java\jdk-17",
    "C:\Program Files\Eclipse Adoptium\jdk-17.0.11.9-hotspot",
    "$env:LOCALAPPDATA\Programs\Eclipse Adoptium\jdk-17.0.11.9-hotspot",
    "C:\Program Files\Java\openjdk-17",
    "$env:LOCALAPPDATA\Programs\openjdk-17"
)

# Try to find Java 17
$javaHome = $null
foreach ($path in $javaPaths) {
    if (Test-Path "$path\bin\java.exe") {
        $javaHome = $path
        Write-Host "Found Java 17 at: $javaHome" -ForegroundColor Green
        break
    }
}

if ($null -eq $javaHome) {
    Write-Host "ERROR: Java 17+ not found in common locations" -ForegroundColor Red
    Write-Host "Please download and install Java 17 LTS from: https://adoptium.net/download/" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Cyan
    Write-Host "  1. Download: https://adoptium.net/download/ (select Java 17 LTS for Windows x64)"
    Write-Host "  2. Install to: C:\Program Files\Eclipse Adoptium\jdk-17.0.11.9-hotspot"
    Write-Host "  3. Re-run your command"
    exit 1
}

# Set JAVA_HOME and run gradlew
$env:JAVA_HOME = $javaHome
Write-Host "Using Java from: $env:JAVA_HOME" -ForegroundColor Cyan
Write-Host ""

# Call gradlew with all passed arguments
& .\gradlew.bat $args

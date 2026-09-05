$libsDir = "c:\Users\PC\Desktop\mdm app\libs"
if (!(Test-Path $libsDir)) {
    New-Item -ItemType Directory -Path $libsDir | Out-Null
}

$urls = @{
    "xlsx.full.min.js" = "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"
}

foreach ($item in $urls.GetEnumerator()) {
    $targetPath = Join-Path $libsDir $item.Key
    try {
        Write-Output "Downloading $($item.Key)..."
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        Invoke-WebRequest -Uri $item.Value -OutFile $targetPath -UseBasicParsing -TimeoutSec 30
        Write-Output "Successfully downloaded $($item.Key)"
    } catch {
        Write-Output "Error downloading $($item.Key): $($_.Exception.Message)"
    }
}

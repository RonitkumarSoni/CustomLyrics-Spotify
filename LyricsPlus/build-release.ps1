$ErrorActionPreference = 'Stop'
$baseDir = $PSScriptRoot
$releaseDir = Join-Path $baseDir 'release'
New-Item -ItemType Directory -Path $releaseDir -Force | Out-Null
$archivePath = Join-Path $releaseDir 'LyricsPlus-beta-1.1.4.zip'
$files = @('manifest.json','LRicon.png','popup.html','popup.js','popup.css','content.css','dist/bundle.js')
$manifest = Get-Content (Join-Path $baseDir 'manifest.json') -Raw | ConvertFrom-Json
if ($manifest.version -ne '1.1.4') { throw 'Archive name and manifest version differ.' }
foreach ($file in $files) { if (-not (Test-Path -LiteralPath (Join-Path $baseDir $file))) { throw "Missing $file" } }
foreach ($script in $manifest.content_scripts) {
  foreach ($file in @($script.js) + @($script.css)) {
    if ($file -notin $files) { throw "Manifest references an unpackaged file: $file" }
  }
}
foreach ($file in @($manifest.action.default_popup, $manifest.action.default_icon, $manifest.icons.'16', $manifest.icons.'48', $manifest.icons.'128')) {
  if ($file -notin $files) { throw "Manifest references an unpackaged file: $file" }
}
Add-Type -AssemblyName System.IO.Compression
$stream = [System.IO.File]::Open($archivePath, [System.IO.FileMode]::Create)
try {
  $zip = [System.IO.Compression.ZipArchive]::new($stream, [System.IO.Compression.ZipArchiveMode]::Create)
  try {
    foreach ($file in $files) {
      $entry = $zip.CreateEntry($file, [System.IO.Compression.CompressionLevel]::Optimal)
      $source = [System.IO.File]::OpenRead((Join-Path $baseDir $file))
      $target = $entry.Open()
      try { $source.CopyTo($target) } finally { $target.Dispose(); $source.Dispose() }
    }
  } finally { $zip.Dispose() }
} finally { $stream.Dispose() }
Write-Output $archivePath

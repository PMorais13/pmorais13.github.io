$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$projectRoot = Split-Path $PSScriptRoot -Parent
$sourceDir = Join-Path $projectRoot 'assets\heritages'
$outputPath = Join-Path $projectRoot 'js\portraits.js'
$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
  Where-Object MimeType -eq 'image/jpeg' |
  Select-Object -First 1
$quality = [System.Drawing.Imaging.EncoderParameters]::new(1)
$quality.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new(
  [System.Drawing.Imaging.Encoder]::Quality, [long]82
)

$entries = foreach ($file in Get-ChildItem -LiteralPath $sourceDir -Filter '*.png' |
    Where-Object { $_.BaseName -ne 'replicant-animal' -and $_.BaseName -notlike 'sintossauro-*' } |
    Sort-Object BaseName) {
  $source = [System.Drawing.Image]::FromFile($file.FullName)
  try {
    $height = [Math]::Min(600, $source.Height)
    $width = [Math]::Max(1, [int][Math]::Round($source.Width * $height / $source.Height))
    $bitmap = [System.Drawing.Bitmap]::new($width, $height)
    try {
      $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
      try {
        $graphics.Clear([System.Drawing.Color]::FromArgb(246, 242, 232))
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.DrawImage($source, 0, 0, $width, $height)
      } finally {
        $graphics.Dispose()
      }
      $stream = [System.IO.MemoryStream]::new()
      try {
        $bitmap.Save($stream, $jpegCodec, $quality)
        $base64 = [Convert]::ToBase64String($stream.ToArray())
        "  '$($file.BaseName)': 'data:image/jpeg;base64,$base64'"
      } finally {
        $stream.Dispose()
      }
    } finally {
      $bitmap.Dispose()
    }
  } finally {
    $source.Dispose()
  }
}

$content = "/* Retratos embutidos para exportação PDF via file://. Gere com scripts/build-portraits.ps1. */`n" +
  "window.TinyFrontiersPortraits = Object.freeze({`n" +
  ($entries -join ",`n") +
  "`n});`n"
[System.IO.File]::WriteAllText($outputPath, $content, [System.Text.Encoding]::ASCII)
Write-Output "Generated $($entries.Count) portraits: $outputPath"

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Add-Type -AssemblyName System.IO.Compression.FileSystem
$xlsxPath = "c:\Users\PC\Desktop\mdm app\mdm_1-5_July18.xlsx"
$zip = [System.IO.Compression.ZipFile]::OpenRead($xlsxPath)

$wbEntry = $zip.GetEntry("xl/workbook.xml")
$wbStream = $wbEntry.Open()
$wbReader = New-Object System.IO.StreamReader($wbStream, [System.Text.Encoding]::UTF8)
$wbXml = [xml]$wbReader.ReadToEnd()
$wbReader.Close()
$wbStream.Close()

$wbRelsEntry = $zip.GetEntry("xl/_rels/workbook.xml.rels")
$wbRelsStream = $wbRelsEntry.Open()
$wbRelsReader = New-Object System.IO.StreamReader($wbRelsStream, [System.Text.Encoding]::UTF8)
$wbRelsXml = [xml]$wbRelsReader.ReadToEnd()
$wbRelsReader.Close()
$wbRelsStream.Close()

$relMap = @{}
foreach ($rel in $wbRelsXml.Relationships.Relationship) {
    $relMap[$rel.Id] = $rel.Target
}

$ssEntry = $zip.GetEntry("xl/sharedStrings.xml")
$sharedStrings = @()
if ($ssEntry) {
    $ssStream = $ssEntry.Open()
    $ssReader = New-Object System.IO.StreamReader($ssStream, [System.Text.Encoding]::UTF8)
    $ssXml = [xml]$ssReader.ReadToEnd()
    $ssReader.Close()
    $ssStream.Close()
    
    foreach ($si in $ssXml.sst.si) {
        if ($si.t) {
            $sharedStrings += $si.t
        } elseif ($si.r) {
            $t = ($si.r | ForEach-Object { $_.t }) -join ""
            $sharedStrings += $t
        } else {
            $sharedStrings += ""
        }
    }
}

function Get-CellValue($c) {
    if (-not $c) { return "" }
    $t = $c.GetAttribute("t")
    $v = $c.v
    if ($t -eq "s") {
        $idx = [int]$v
        if ($idx -lt $sharedStrings.Count) {
            return $sharedStrings[$idx]
        }
        return "str#$idx"
    }
    if ($t -eq "inlineStr") {
        return $c.is.t
    }
    return $v
}

foreach ($s in $wbXml.workbook.sheets.sheet) {
    $target = $relMap[$s.id]
    if ($target -notmatch "^xl/") { $target = "xl/" + $target }
    
    $sheetEntry = $zip.GetEntry($target)
    if (-not $sheetEntry) { continue }
    $shStream = $sheetEntry.Open()
    $shReader = New-Object System.IO.StreamReader($shStream, [System.Text.Encoding]::UTF8)
    $shXml = [xml]$shReader.ReadToEnd()
    $shReader.Close()
    $shStream.Close()
    
    $outPath = "c:\Users\PC\Desktop\mdm app\sheet_$($s.name -replace '[^a-zA-Z0-9_-]', '_').txt"
    $sw = New-Object System.IO.StreamWriter($outPath, $false, [System.Text.Encoding]::UTF8)
    $sw.WriteLine("=== SHEET: $($s.name) ===")
    
    $rows = $shXml.worksheet.sheetData.row
    foreach ($r in $rows) {
        $rNum = $r.GetAttribute("r")
        $rowCells = @()
        $hasFormulas = @()
        foreach ($c in $r.c) {
            $ref = $c.GetAttribute("r")
            $val = Get-CellValue $c
            $formula = $c.f
            if ($formula) {
                $formulaStr = if ($formula -is [string]) { $formula } else { $formula.InnerText }
                $hasFormulas += "${ref}=[$formulaStr]=>${val}"
            }
            if ($val -ne "" -or $formula) {
                $rowCells += "${ref}:${val}"
            }
        }
        if ($rowCells.Count -gt 0) {
            $sw.WriteLine("R${rNum}: " + ($rowCells -join " | "))
            if ($hasFormulas.Count -gt 0) {
                $sw.WriteLine("  FORMULAS: " + ($hasFormulas -join " ; "))
            }
        }
    }
    $sw.Close()
    Write-Output "Wrote $outPath (Rows: $($rows.Count))"
}

$zip.Dispose()

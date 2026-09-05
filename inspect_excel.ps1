[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Add-Type -AssemblyName System.IO.Compression.FileSystem
$xlsxPath = "c:\Users\PC\Desktop\mdm app\mdm_1-5_July18.xlsx"
$zip = [System.IO.Compression.ZipFile]::OpenRead($xlsxPath)

# 1. Read workbook.xml & rels
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

# 2. Read sharedStrings.xml
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

# Iterate sheets
foreach ($s in $wbXml.workbook.sheets.sheet) {
    $target = $relMap[$s.id]
    if ($target -notmatch "^xl/") { $target = "xl/" + $target }
    Write-Output "========================================================="
    Write-Output "SHEET: $($s.name) (File: $target)"
    Write-Output "========================================================="
    
    $sheetEntry = $zip.GetEntry($target)
    if (-not $sheetEntry) {
        Write-Output "Entry not found: $target"
        continue
    }
    $shStream = $sheetEntry.Open()
    $shReader = New-Object System.IO.StreamReader($shStream, [System.Text.Encoding]::UTF8)
    $shXml = [xml]$shReader.ReadToEnd()
    $shReader.Close()
    $shStream.Close()
    
    # Read rows
    $rows = $shXml.worksheet.sheetData.row
    Write-Output "Total rows: $($rows.Count)"
    
    # Let's inspect first 50 rows or key rows
    foreach ($r in $rows) {
        $rNum = $r.GetAttribute("r")
        $rowCells = @()
        $hasFormulas = @()
        foreach ($c in $r.c) {
            $ref = $c.GetAttribute("r")
            $val = Get-CellValue $c
            $formula = $c.f
            if ($formula) {
                $formulaStr = ""
                if ($formula -is [string]) { $formulaStr = $formula } else { $formulaStr = $formula.InnerText }
                $hasFormulas += "$ref = formula($formulaStr) => $val"
            }
            if ($val -ne "") {
                $rowCells += "${ref}: $val"
            }
        }
        if ($rowCells.Count -gt 0 -or $hasFormulas.Count -gt 0) {
            if ([int]$rNum -le 50 -or $rNum -ge ($rows.Count - 10)) {
                Write-Output "Row $rNum | " + ($rowCells -join " | ")
                if ($hasFormulas.Count -gt 0) {
                    Write-Output "   Formulas: " + ($hasFormulas -join " ; ")
                }
            }
        }
    }
}

$zip.Dispose()

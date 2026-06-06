$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
try {
    $r = Invoke-RestMethod -Uri "http://localhost:3000/api/articles/recommend" -UseBasicParsing
    $articles = $r.data.article_list
    Write-Output "Total: $($articles.Count)"
    $blocked = @('安全拦截', '提示词注入', '营销软文', '技术水文')
    $commercial = '含商业推广'
    $filteredOut = 0
    $commercialCount = 0
    foreach ($a in $articles) {
        $tags = $a.tags
        $hasBlocked = $false
        $hasCommercial = $false
        foreach ($tag in $tags) {
            if ($blocked -contains $tag) { $hasBlocked = $true }
            if ($tag -eq $commercial) { $hasCommercial = $true }
        }
        if ($hasBlocked) { $filteredOut++ }
        if ($hasCommercial) { $commercialCount++ }
        $status = if ($hasBlocked) { "[BLOCKED]" } elseif ($hasCommercial) { "[COMM]" } else { "[OK]" }
        Write-Output "$status [$($a.category)] $($a.title.Substring(0, [Math]::Min(25, $a.title.Length)))"
    }
    Write-Output "Remaining: $($articles.Count - $filteredOut)"
} catch {
    Write-Output "ERROR: $_"
}

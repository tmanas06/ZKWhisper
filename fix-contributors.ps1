# PowerShell script to fix GitHub contributors
# Run this script to set your git identity and optionally rewrite history

Write-Host "GitHub Contributor Fix Script" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Green
Write-Host ""

# Get current git config
$currentName = git config user.name
$currentEmail = git config user.email

Write-Host "Current Git Configuration:" -ForegroundColor Yellow
Write-Host "  Name: $currentName"
Write-Host "  Email: $currentEmail"
Write-Host ""

# Get user input
$newName = Read-Host "Enter your name (or press Enter to keep current)"
$newEmail = Read-Host "Enter your email (or press Enter to keep current)"

if ([string]::IsNullOrWhiteSpace($newName)) {
    $newName = $currentName
}
if ([string]::IsNullOrWhiteSpace($newEmail)) {
    $newEmail = $currentEmail
}

# Set git config
git config user.name "$newName"
git config user.email "$newEmail"

Write-Host ""
Write-Host "Git configuration updated!" -ForegroundColor Green
Write-Host "  Name: $newName"
Write-Host "  Email: $newEmail"
Write-Host ""

# Check for other contributors
Write-Host "Checking for other contributors in git history..." -ForegroundColor Yellow
$contributors = git log --format="%an|%ae" | Sort-Object -Unique

if ($contributors) {
    Write-Host ""
    Write-Host "Found contributors:" -ForegroundColor Yellow
    $contributors | ForEach-Object {
        $parts = $_ -split '\|'
        Write-Host "  - $($parts[0]) <$($parts[1])>"
    }
    Write-Host ""
    
    $rewrite = Read-Host "Do you want to rewrite git history to change all commits to your identity? (y/N)"
    if ($rewrite -eq 'y' -or $rewrite -eq 'Y') {
        Write-Host ""
        Write-Host "WARNING: This will rewrite git history!" -ForegroundColor Red
        Write-Host "Make sure you have a backup and that no one else is working on this repo." -ForegroundColor Red
        $confirm = Read-Host "Type 'yes' to continue"
        
        if ($confirm -eq 'yes') {
            Write-Host ""
            Write-Host "Rewriting git history..." -ForegroundColor Yellow
            
            # Get the old email to replace (first other contributor)
            $otherContributor = ($contributors | Where-Object { $_ -notlike "*$newEmail*" } | Select-Object -First 1)
            if ($otherContributor) {
                $oldEmail = ($otherContributor -split '\|')[1]
                $oldName = ($otherContributor -split '\|')[0]
                
                Write-Host "Replacing commits from: $oldName <$oldEmail>" -ForegroundColor Yellow
                Write-Host "With: $newName <$newEmail>" -ForegroundColor Yellow
                
                # Use git filter-branch or git filter-repo
                $env:GIT_AUTHOR_NAME = $newName
                $env:GIT_AUTHOR_EMAIL = $newEmail
                $env:GIT_COMMITTER_NAME = $newName
                $env:GIT_COMMITTER_EMAIL = $newEmail
                
                git filter-branch -f --env-filter "
                    if [ `$GIT_COMMITTER_EMAIL = '$oldEmail' ]
                    then
                        export GIT_COMMITTER_NAME='$newName'
                        export GIT_COMMITTER_EMAIL='$newEmail'
                    fi
                    if [ `$GIT_AUTHOR_EMAIL = '$oldEmail' ]
                    then
                        export GIT_AUTHOR_NAME='$newName'
                        export GIT_AUTHOR_EMAIL='$newEmail'
                    fi
                " --tag-name-filter cat -- --branches --tags
                
                Write-Host ""
                Write-Host "History rewritten! You'll need to force push to GitHub:" -ForegroundColor Green
                Write-Host "  git push --force --all" -ForegroundColor Cyan
                Write-Host "  git push --force --tags" -ForegroundColor Cyan
            }
        }
    }
} else {
    Write-Host "No commits found in repository." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Done! Make sure to commit and push your changes." -ForegroundColor Green


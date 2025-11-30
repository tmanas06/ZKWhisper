# Script to completely remove other contributors from GitHub
# This will rewrite git history and force push to GitHub

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Remove Other Contributors from GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in a git repo
if (-not (Test-Path .git)) {
    Write-Host "Error: Not a git repository!" -ForegroundColor Red
    exit 1
}

# Get your information
Write-Host "Enter your Git information:" -ForegroundColor Yellow
$yourName = Read-Host "Your Name"
$yourEmail = Read-Host "Your Email"

if ([string]::IsNullOrWhiteSpace($yourName) -or [string]::IsNullOrWhiteSpace($yourEmail)) {
    Write-Host "Error: Name and Email are required!" -ForegroundColor Red
    exit 1
}

# Set git config
Write-Host ""
Write-Host "Setting git configuration..." -ForegroundColor Yellow
git config user.name "$yourName"
git config user.email "$yourEmail"
git config --global user.name "$yourName"
git config --global user.email "$yourEmail"

Write-Host "✓ Git config updated" -ForegroundColor Green
Write-Host ""

# Show current contributors
Write-Host "Current contributors in git history:" -ForegroundColor Yellow
git log --format="%an <%ae>" --all | Sort-Object -Unique | ForEach-Object {
    Write-Host "  - $_"
}
Write-Host ""

# Warning
Write-Host "WARNING: This will completely rewrite git history!" -ForegroundColor Red
Write-Host "All commits will be attributed to: $yourName <$yourEmail>" -ForegroundColor Yellow
Write-Host ""
Write-Host "This will:" -ForegroundColor Yellow
Write-Host "  1. Remove all old git history" -ForegroundColor Yellow
Write-Host "  2. Create a fresh initial commit with all current files" -ForegroundColor Yellow
Write-Host "  3. Force push to GitHub (overwriting remote history)" -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "Type 'YES' to continue (this cannot be undone)"

if ($confirm -ne "YES") {
    Write-Host "Cancelled." -ForegroundColor Yellow
    exit 0
}

# Get remote URL
$remoteUrl = (git remote get-url origin 2>$null)
if (-not $remoteUrl) {
    Write-Host "Error: No remote 'origin' found!" -ForegroundColor Red
    Write-Host "Please add your GitHub remote first:" -ForegroundColor Yellow
    Write-Host "  git remote add origin https://github.com/tmanas06/zknote.git" -ForegroundColor Cyan
    exit 1
}

Write-Host ""
Write-Host "Remote URL: $remoteUrl" -ForegroundColor Cyan
Write-Host ""

# Backup current branch
$currentBranch = git branch --show-current
if (-not $currentBranch) {
    $currentBranch = "main"
}

Write-Host "Current branch: $currentBranch" -ForegroundColor Cyan
Write-Host ""

# Step 1: Remove old git history
Write-Host "Step 1: Removing old git history..." -ForegroundColor Yellow
$gitDir = ".git"
if (Test-Path $gitDir) {
    Remove-Item -Recurse -Force $gitDir
    Write-Host "✓ Old git history removed" -ForegroundColor Green
}

# Step 2: Initialize new repository
Write-Host ""
Write-Host "Step 2: Initializing new repository..." -ForegroundColor Yellow
git init
git config user.name "$yourName"
git config user.email "$yourEmail"

# Step 3: Add all files
Write-Host ""
Write-Host "Step 3: Adding all files..." -ForegroundColor Yellow
git add .
$fileCount = (git status --porcelain | Measure-Object -Line).Lines
Write-Host "✓ Added $fileCount files" -ForegroundColor Green

# Step 4: Create initial commit
Write-Host ""
Write-Host "Step 4: Creating initial commit..." -ForegroundColor Yellow
git commit -m "Initial commit - ZKWhisper project"
Write-Host "✓ Initial commit created" -ForegroundColor Green

# Step 5: Add remote
Write-Host ""
Write-Host "Step 5: Setting up remote..." -ForegroundColor Yellow
git remote add origin $remoteUrl
Write-Host "✓ Remote added" -ForegroundColor Green

# Step 6: Create main branch if needed
Write-Host ""
Write-Host "Step 6: Setting up branch..." -ForegroundColor Yellow
git branch -M main
Write-Host "✓ Branch set to 'main'" -ForegroundColor Green

# Step 7: Force push
Write-Host ""
Write-Host "Step 7: Force pushing to GitHub..." -ForegroundColor Yellow
Write-Host "This will overwrite all history on GitHub!" -ForegroundColor Red
Write-Host ""

$finalConfirm = Read-Host "Type 'FORCE PUSH' to confirm"

if ($finalConfirm -eq "FORCE PUSH") {
    git push -u origin main --force
    Write-Host ""
    Write-Host "✓ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "The other contributor should now be removed from GitHub." -ForegroundColor Green
    Write-Host "It may take a few minutes for GitHub to update the contributors list." -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "Push cancelled. You can push manually later with:" -ForegroundColor Yellow
    Write-Host "  git push -u origin main --force" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Done!" -ForegroundColor Green


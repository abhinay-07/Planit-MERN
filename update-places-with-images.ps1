Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Update Places with Images" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "This script will:" -ForegroundColor Yellow
Write-Host "  1. Add image paths from your assets/images/places folder" -ForegroundColor White
Write-Host "  2. Update existing places OR create new ones" -ForegroundColor White
Write-Host "  3. Option to place all locations near YOUR location for testing" -ForegroundColor White
Write-Host ""

Write-Host "Options:" -ForegroundColor Green
Write-Host "  - Keep real Vijayawada locations (default)" -ForegroundColor White
Write-Host "  - OR set USE_MY_LOCATION=true in seed-places-with-images.js" -ForegroundColor White
Write-Host "    to place all within 500m-2km of your coordinates" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Do you want to edit the script to set your location? (y/N)"

if ($choice -eq "y" -or $choice -eq "Y") {
    Write-Host ""
    Write-Host "Opening seed-places-with-images.js..." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "To use your location:" -ForegroundColor Yellow
    Write-Host "  1. Change: USE_MY_LOCATION = false  -->  USE_MY_LOCATION = true" -ForegroundColor White
    Write-Host "  2. Update: MY_LOCATION = { lat: YOUR_LAT, lng: YOUR_LNG }" -ForegroundColor White
    Write-Host "  3. Save the file and come back here" -ForegroundColor White
    Write-Host ""
    
    code server/seed-places-with-images.js
    
    Read-Host "Press Enter after editing and saving the file..."
}

Write-Host ""
Write-Host "Running seed script..." -ForegroundColor Cyan
Write-Host ""

cd server
node seed-places-with-images.js

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Script completed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Refresh your browser at http://localhost:3000/home" -ForegroundColor White
Write-Host "  2. You should now see place images!" -ForegroundColor White
Write-Host "  3. Try the 'Near Me' button to see nearby places" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to exit"

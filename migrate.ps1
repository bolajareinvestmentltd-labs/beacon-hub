# PowerShell script to automate db:push with responses
$process = Start-Process -FilePath "npm" -ArgumentList "run", "db:push" -NoNewWindow -PassThru -RedirectStandardInput $null

# Wait for process to complete
$process | Wait-Process

# Return exit code
exit $process.ExitCode

@echo off
setlocal

REM 引数チェック
if "%~1"=="" (
    echo "ERR: specify the model name as an argument."
    exit /b 1
)

set MODEL=%~1
set FILE=graph-script-%MODEL%.txt

REM 既存チェック
if exist "%FILE%" (
    echo "already exist file: %FILE%"
    exit /b 0
)

REM 新規作成
echo # model: %MODEL% > "%FILE%"
echo "created: %FILE%"

endlocal
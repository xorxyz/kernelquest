# \\wsl.localhost\Ubuntu-20.04\home\kareniel\code

$AccountName = $env.STEAM_ACCOUNT_NAME
$Password = $env.STEAM_PASSWORD

\tmp\steamcmd.exe +login $AccountName $Password +run_app_build .\build-steam.vdf +quit

# \tmp\steamcmd.exe "set_steam_guard_code <code>"

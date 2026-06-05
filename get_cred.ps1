Add-Type -Namespace Win32 -Name CredApi -MemberDefinition @'
[DllImport("advapi32.dll", CharSet=CharSet.Unicode)]
public static extern bool CredRead(string target, int type, int reserved, out IntPtr credPtr);
[DllImport("advapi32.dll")]
public static extern void CredFree(IntPtr cred);
'@
$ptr = [IntPtr]::Zero
$ok = [Win32.CredApi]::CredRead('git:https://github.com', 1, 0, [ref]$ptr)
if ($ok) {
    $structSize = 80
    $userPtr = [System.Runtime.InteropServices.Marshal]::ReadIntPtr($ptr, [IntPtr]::Size * 2)
    $userName = [System.Runtime.InteropServices.Marshal]::PtrToStringUni($userPtr)
    $blobSize = [System.Runtime.InteropServices.Marshal]::ReadInt32($ptr, [IntPtr]::Size * 2 + 4)
    if ($blobSize -gt 0) {
        $blobPtr = [System.Runtime.InteropServices.Marshal]::ReadIntPtr($ptr, [IntPtr]::Size * 3)
        $password = [System.Runtime.InteropServices.Marshal]::PtrToStringUni($blobPtr, $blobSize / 2)
        Write-Output "USERNAME=$userName"
        Write-Output "PASSWORD_LEN=$($password.Length)"
        Write-Output "PASSWORD=$password"
    } else {
        Write-Output "USERNAME=$userName"
        Write-Output "PASSWORD=none"
    }
    [Win32.CredApi]::CredFree($ptr)
} else {
    Write-Output "CRED_NOT_FOUND"
}

importPackage(Packages.java.lang);

function OnCustomProcess (CEObject)
{
    CEObject.getProperties().putValue("RetryCount", new Integer(5));
    CEObject.save(RefreshMode.NO_REFRESH);
}
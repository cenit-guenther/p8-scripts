importPackage(Packages.java.lang);
importPackage(Packages.com.filenet.api.constants);


function OnCustomProcess (CEObject)
{
    CEObject.getProperties().putValue("RetryCount", new Integer(5));
    CEObject.save(RefreshMode.NO_REFRESH);
}

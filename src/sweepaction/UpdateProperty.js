importPackage(Packages.com.filenet.api.core);
importPackage(Packages.com.filenet.api.constants);
importPackage(Packages.com.filenet.api.exception);
importPackage(Packages.com.filenet.api.sweep);
importPackage(Packages.com.filenet.api.engine);

// Implement for custom job and queue sweeps.
function onSweep (sweepObject, sweepItems)
{	
    var hcc = HandlerCallContext.getInstance();
    hcc.traceDetail("Entering CustomSweepHandler.onSweep");
    hcc.traceDetail("sweepObject = " 
              + sweepObject.getProperties().getIdValue(PropertyNames.ID)
              + "sweepItems.length = " + sweepItems.length);

    // Iterate the sweepItems and change the class.
    ii = 0;
    for (ii = 0; ii < sweepItems.length; ii++)
    {
       // At the top of your loop, always check to make sure 
       // that the server is not shutting down. 
       // If it is, clean up and return control to the server.
       if (hcc != null && hcc.isShuttingDown())
       { 
          throw new EngineRuntimeException(ExceptionCode.E_BACKGROUND_TASK_TERMINATED,        
            this.constructor.name + " is terminating prematurely because the server is shutting down");
       }

       var item = sweepItems[ii].getTarget();
       String msg = "sweepItems[" + ii + "]= " + item.getProperties().getIdValue("ID");
       hcc.traceDetail(msg);

       try 
       {
          var queueItem = QueueItem (item);
          queueItem.getProperties().putValue('RetryCount', 5);
          queueItem.save(RefreshMode.NO_REFRESH);

          // Set outcome to PROCESSED if item processed successfully.
          sweepItems[ii].setOutcome(SweepItemOutcome.PROCESSED,
                "item processed by " + this.constructor.name);
       }
       // Set failure status on objects that fail to process.
       catch (ioe)
       {
          sweepItems[ii].setOutcome(SweepItemOutcome.FAILED, "CustomSweepHandler: " +
              ioe.rhinoException.getMessage());
       }
    }
    hcc.traceDetail("Exiting CustomSweepHandler.onSweep");
}

/* 
 * Called automatically when the handler is invoked by a custom sweep job 
 * or sweep policy. Specify properties required by the handler, if any.
 * If you return an empty array, then all properties are fetched.
 */
function getRequiredProperties()
{
    var pnames = ['Id', 'RetryCount'];
    return pnames.toString();	
}

/* Implement for custom sweep policies.
 * This method is not implemented because this is an example of a custom sweep job.
 */
function onPolicySweep (sweepObject, policyObject, sweepItems)
{}

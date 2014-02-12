// This takes a registerTask or registerMultiTask method and wraps it
// in a function that will work with Orchestrator.

module.exports = function (task, context) {
  var method = task.fn;

  // Return a function that will be invoked by Orchestrator.
  return function () {
    // clear promise for each run.
    context.deferred = false;

    // Execute task method from registerTask or registerMultiTask.
    var ret = method.apply(context, arguments);

    // If a task calls `this.async()`, it will create a promise on
    // the context object which will be resolved or rejected by the
    // task.  Optionally returning a promise is a bit like releasing
    // zalgo, but due to historical reasons, we don't have the luxury
    // of hinting Orchestrator correctly.
    if (!context.deferred) {
      return ret;
    } else {
      return context.deferred;
    }
  };
};
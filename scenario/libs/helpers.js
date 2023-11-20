async function runChromeJS(context, code, ...args) {
  await context.selenium.driver.setContext("chrome");
  const res = await context.selenium.driver
    .executeScript(code, ...args);
  await context.selenium.driver.setContext("content");
  return res;
}

const assertExtensionProcessEnabled = async (context) => {
  const isEnabled = await runChromeJS(
    context,
    () => WebExtensionPolicy.useRemoteWebExtensions
  );
  if (isEnabled) {
    context.log.info('OK: extension child process detected as enabled');
    return;
  }
  context.log.error('KO: extension child process detected as disabled');
  throw new Error("Extensions are not running in the childextension process");
}

const getStartTime = (context) => runChromeJS(context, function getStartTime() {
  return Cu.now();
});

const addProfilerMarker = (context, markerName, start, markerText) => runChromeJS(
  context,
  function addProfilerMarker(markerName, start, markerText) {
  ChromeUtils.addProfilerMarker(markerName, start, markerText);
}, markerName, start, markerText);

const runWithProfilerMarker = async (context, markerName, markerText, fn) => {
  let start = await getStartTime(context);
  await fn();
  await addProfilerMarker(context, markerName, start, markerText);
};

module.exports = {
  assertExtensionProcessEnabled,
  addProfilerMarker,
  getStartTime,
  runChromeJS,
  runWithProfilerMarker
};

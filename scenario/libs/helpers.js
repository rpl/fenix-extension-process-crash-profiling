async function runChromeJS(context, code, ...args) {
  await context.selenium.driver.setContext("chrome");
  const res = await context.selenium.driver
    .executeScript(code, ...args);
  await context.selenium.driver.setContext("content");
  return res;
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
  addProfilerMarker,
  getStartTime,
  runChromeJS,
  runWithProfilerMarker
};

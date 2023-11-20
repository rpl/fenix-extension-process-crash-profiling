module.exports = async function (context, commands) {
  const {
    assertExtensionProcessEnabled,
    runWithProfilerMarker,
  } = require("./libs/helpers");

  await commands.navigate("about:blank");
  await assertExtensionProcessEnabled(context);

  context.log.info("Starting an extension-process-crash test");

  // measure.start will be starting the geckoProfiler.
  await commands.measure.start("extension-process-crash");

  for (let i = 0; i < 5; i++) {
    const testMsg = `Test Crash n. ${i + 1}`;
    context.log.info(testMsg);
    await commands.wait.byTime(1000);
    await runWithProfilerMarker(
      context,
      "test-extension-process-crash",
      testMsg,
      () => context.selenium.driver.navigate().to("about:crashextensions"),
    ); 
    await commands.wait.byTime(2000);
  }

  await commands.measure.stop();
};

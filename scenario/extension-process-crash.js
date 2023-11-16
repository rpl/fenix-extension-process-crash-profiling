module.exports = async function (context, commands) {
 context.log.info("Starting an extension-process-crash test");

 // measure.start will be starting the geckoProfiler.
 await commands.measure.start("extension-process-crash");
 await commands.navigate("about:blank");
 await commands.wait.byTime(1000);
 await context.selenium.driver.navigate().to("about:crashextensions");
 await commands.wait.byTime(5000);
 await context.selenium.driver.navigate().to("about:crashextensions");
 await commands.wait.byTime(5000);
 await context.selenium.driver.navigate().to("about:crashextensions");
 await commands.wait.byTime(5000);
 await context.selenium.driver.navigate().to("about:crashextensions");
 await commands.wait.byTime(5000);
 await context.selenium.driver.navigate().to("about:crashextensions");
 await commands.wait.byTime(5000);
 await commands.measure.stop();
};

const sh = require('shelljs');

const fenixApkName = process.env.FIREFOX_APK ?? 'org.mozilla.fenix';

// NOTE: extensions.webextensions.remote pref is set explicitly to also
// support running the scenario on GeckoView-based apps where the extension
// child process is not enabled by default (e.g. GeckoViewExample).
const BROWSERTIME_CMD = `
  browsertime \
    --android.enabled true \
    --browser firefox \
    --ignoreShutdownFailures true \
    --firefox.android.package ${fenixApkName} \
    --firefox.disableBrowsertimeExtension true \
    --firefox.geckoProfiler \
    --firefox.geckoProfilerParams.features js,stackwalk,cpu \
    --firefox.geckoProfilerParams.threads GeckoMain \
    --firefox.geckoProfilerParams.interval 1 \
    --firefox.geckoProfilerParams.bufferSize 8000000 \
    --firefox.noDefaultPrefs \
    --firefox.preference "extensions.webextensions.remote:true" \
    --iterations 1 \
    --resultDir ./tmp \
`;

const pathToScenario = process.argv[2];
sh.echo(`Running scenario ${pathToScenario}`);
sh.echo(`\ton Firefox APK: ${fenixApkName}`)
sh.echo('\twith the following extensions preinstalled:');

const browsertimeExtensionOptions = () => {
  if (process.env.NO_EXTENSIONS) {
    return "";
  }
  return sh.ls('./extensions/*.xpi').map(file => {
    sh.echo(`\t- ${file}`);
    return `--extension ${file}`;
  }).join(' ');
};

sh.exec(`${BROWSERTIME_CMD} ${browsertimeExtensionOptions()} ${pathToScenario}`);

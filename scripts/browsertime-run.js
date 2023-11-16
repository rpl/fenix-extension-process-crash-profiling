const sh = require('shelljs');

const fenixApkName = process.env.FIREFOX_APK ?? 'org.mozilla.fenix';

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
    --iterations 1 \
    --resultDir ./tmp \
`;

const pathToScenario = process.argv[2];
sh.echo(`Running scenario ${pathToScenario}`);
sh.echo(`\ton Firefox APK: ${fenixApkName}`)
sh.echo('\twith the following extensions preinstalled:');
const browsertimeExtensionOptions = sh.ls('./extensions/*.xpi').map(file => {
  sh.echo(`\t- ${file}`);
  return `--extension ${file}`;
}).join(' ');
sh.exec(`${BROWSERTIME_CMD} ${browsertimeExtensionOptions} ${pathToScenario}`);

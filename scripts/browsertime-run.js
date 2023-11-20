const sh = require('shelljs');

const fenixApkName = process.env.FIREFOX_APK ?? 'org.mozilla.fenix';
const resultDir = process.env.RESULT_DIR ?? './tmp';
const firefoxBinPath = process.env.FIREFOX_BIN && !process.env.FIREFOX_APK
  ? process.env.FIREFOX_BIN
  : null;

// NOTE: extensions.webextensions.remote pref is set explicitly to also
// support running the scenario on GeckoView-based apps where the extension
// child process is not enabled by default (e.g. GeckoViewExample).
const BROWSERTIME_CMD = `
  browsertime \
    --browser firefox \
    --ignoreShutdownFailures true \
    --firefox.disableBrowsertimeExtension true \
    --firefox.geckoProfiler \
    --firefox.geckoProfilerParams.features js,stackwalk,cpu \
    --firefox.geckoProfilerParams.threads GeckoMain \
    --firefox.geckoProfilerParams.interval 1 \
    --firefox.geckoProfilerParams.bufferSize 8000000 \
    --firefox.noDefaultPrefs \
    --firefox.preference "extensions.webextensions.remote:true" \
    --iterations 1 \
    --resultDir ${resultDir} \
`;

const ANDROID_OPT = `--android.enabled true --firefox.android.package ${fenixApkName}`;
// NOTE: on Firefox the HAR archive is collected through an extension,
// skip it to avoid a failure due to trying to retrieve the HAR file
// after triggering the extension process crash.
const DESKTOP_OPT = `--firefox.binaryPath ${firefoxBinPath} --skipHar`;

if (firefoxBinPath) {
  sh.echo([
    '\nNOTE: Firefox Desktop unpatched builds will fail due to Geckodriver forcefully setting',
    'MOZ_CRASHREPORTER_SHUTDOWN environment variable and Firefox Desktop crashing',
    'the parent process as a side effect of that.',
    'Please use a custom build with the forced shutdown commented out in',
    'browser/modules/ContentCrashHandlers.sys.mjs until that is fixed\n'
  ].join('\n'));
}

const pathToScenario = process.argv[2];
sh.echo(`Running scenario ${pathToScenario}`);
sh.echo(`\ton Firefox APK: ${fenixApkName}`)

const platformOptions = () => firefoxBinPath ? DESKTOP_OPT : ANDROID_OPT; 

const extensionOptions = () => {
  if (process.env.NO_EXTENSIONS) {
    return "";
  }
  sh.echo('\twith the following extensions preinstalled:');
  return sh.ls('./extensions/*.xpi').map(file => {
    sh.echo(`\t- ${file}`);
    return `--extension ${file}`;
  }).join(' ');
};

sh.exec(`${BROWSERTIME_CMD} ${platformOptions()} ${extensionOptions()} ${pathToScenario}`);

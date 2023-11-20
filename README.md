fenix-extension-process-crash-profiling
=======================================

This repository contains some helpers to automate the execution of extension process crash scenario and collecting
GeckoProfiler data to assess the impact of the extension process crash handling from a performance perspective.

The scenario is described by a browsertime-based scripts and all the extensions xpi files in the `extensions/`
will be installed in the browser instance being tested.

## How to run the scenario

Make sure to have installed the Firefox for Android apk on the device where the test will be running, by default
the scenario will be executed on the apk for Nightly (org.mozilla.fenix):

```
npm run extension-process-crash
```

After the execution is complited the GeckoProfiler data is store in the tmp/ subdir.

### Run on a specific APK

A custom apk name can be specified through the environment variable `FIREFOX_APK`:

```
FIREFOX_APK=org.mozilla.fenix.debug npm run extension-process-crash

# or

FIREFOX_APK=org.mozilla.geckoview_example npm run extension-process-crash
```

### Run with a different set of third party extensions

The scenario will run by default on a Firefox profile where all the extensions listed in `./extensions/`,
adding/removing/replace the xpi files is enough to run the scenario with a different set of extensions.

### Run without third party extensions

The scenario can also be forced to run without any third party extensions (which on Fenix means that only
builtins will be installed, while on GeckoViewExample translates into running the scenario with no
extension at all) by just setting the environment variable `NO_EXTENSIONS`:

```
NO_EXTENSIONS=1 npm run extension-process-crash
```

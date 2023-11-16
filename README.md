fenix-extension-process-crash-profiling
=======================================

This repository contains some helpers to automate the execution of extension process crash scenario and collecting
GeckoProfiler data to assess the impact of the extension process crash handling from a performance perspective.

The scenario is described by a browsertime-based scripts and all the extensions xpi files in the `extensions/`
will be installed in the browser instance being tested.

## how to run the scenario

Make sure to have installed the Firefox for Android apk on the device where the test will be running, by default
the scenario will be executed on the apk for Nightly (org.mozilla.fenix), but a custom apk name can be
passed through the environment variable `FIREFOX_APK`:

```
npm run extension-process-crash

# or

FIREFOX_APK=org.mozilla.fenix.debug npm run extension-process-crash
```

After the execution is complited the GeckoProfiler data is store in the tmp/ subdir.

## how to install some other extensions xpi files?

Dropping more xpi files in the same directory is enough to install more extensions during the next execution of the scenario.

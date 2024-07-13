fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## iOS

### ios get_version

```sh
[bundle exec] fastlane ios get_version
```



### ios sync_device_info

```sh
[bundle exec] fastlane ios sync_device_info
```



### ios increment_version_code

```sh
[bundle exec] fastlane ios increment_version_code
```



### ios increment_version_name

```sh
[bundle exec] fastlane ios increment_version_name
```



### ios firebase_staging

```sh
[bundle exec] fastlane ios firebase_staging
```

Push a new staging build to Firebase App Distribution

### ios commit_version

```sh
[bundle exec] fastlane ios commit_version
```



### ios handle_badge

```sh
[bundle exec] fastlane ios handle_badge
```



### ios sign

```sh
[bundle exec] fastlane ios sign
```

Sync All Cert & Provisioning Profile (Match => Github)

### ios build

```sh
[bundle exec] fastlane ios build
```



### ios upload_to_store

```sh
[bundle exec] fastlane ios upload_to_store
```



### ios staging

```sh
[bundle exec] fastlane ios staging
```

Push a new staging build

### ios release

```sh
[bundle exec] fastlane ios release
```

Push a new release build

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).

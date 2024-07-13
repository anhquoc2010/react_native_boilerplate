fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## Android

### android get_version

```sh
[bundle exec] fastlane android get_version
```



### android increment_version_code

```sh
[bundle exec] fastlane android increment_version_code
```



### android increment_version_name

```sh
[bundle exec] fastlane android increment_version_name
```



### android handle_badge

```sh
[bundle exec] fastlane android handle_badge
```



### android build

```sh
[bundle exec] fastlane android build
```



### android firebase_staging

```sh
[bundle exec] fastlane android firebase_staging
```

Push a new staging build to Firebase App Distribution

### android commit_version

```sh
[bundle exec] fastlane android commit_version
```



### android upload_to_store

```sh
[bundle exec] fastlane android upload_to_store
```



### android test

```sh
[bundle exec] fastlane android test
```

Android Testing

### android staging

```sh
[bundle exec] fastlane android staging
```

Push a new staging build

### android release

```sh
[bundle exec] fastlane android release
```

Push a new release build

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).

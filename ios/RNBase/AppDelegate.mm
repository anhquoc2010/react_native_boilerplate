#import "AppDelegate.h"

#import <Firebase.h>
// #import <GoogleMaps/GoogleMaps.h>
#import "RNSplashScreen.h"
#import <React/RCTBundleURLProvider.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // @react-native-firebase
  if ([FIRApp defaultApp] == nil) {
    [FIRApp configure];
  }

  // react-native-maps
  // [GMSServices provideAPIKey: [ReactNativeConfig envFor:@"GOOGLE_MAPS_API_KEY"]]; // add this line using the api key obtained from Google Console

  self.moduleName = @"RNBase";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  bool didFinish=[super application:application didFinishLaunchingWithOptions:launchOptions];
  
  // react-native-splash-screen
  [RNSplashScreen show];
  return didFinish;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self getBundleURL];
}

- (NSURL *)getBundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
